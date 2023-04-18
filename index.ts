const moment = require('moment-timezone');
const {google} = require('googleapis');

/**
 * scheduleCalendarMeetings
 * we extract the exact date from withing start and eithing end day from our start date
 * Then we will get the free slots and check the availability of our given specific time and schedule the meeting
 * @param meetings
 */
const scheduleCalendarMeetings = async (meetings, SERVICE_ACCOUNT_CLIENT_EMAIL,
                                        SERVICE_ACCOUNT_PRIVATE_KEY,
                                        ORGANIZATION_ADMIN_EMAIL) => {
    try {
        const GOOGLE_CALENDAR_SCOPE = ['https://www.googleapis.com/auth/admin.directory.user.readonly',
            'https://www.googleapis.com/auth/admin.directory.user ',
            'https://www.googleapis.com/auth/calendar',
            ' https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/userinfo.profile']
        
        const googleCalendarAuth = new google.auth.JWT(
            SERVICE_ACCOUNT_CLIENT_EMAIL,
            null,
            SERVICE_ACCOUNT_PRIVATE_KEY,
            GOOGLE_CALENDAR_SCOPE,
            ORGANIZATION_ADMIN_EMAIL
        );
        
        for (const meeting of meetings) {
            const usersFreeSlots = await getUsersFreeSlots(
                [...meeting.attendeesEmail, meeting.organizerEmail],
                parseInt(meeting.startDay),
                parseInt(meeting.endDay),
                new Date(meeting.usersAvailabilityStartDate),
                googleCalendarAuth
            );
            
            for (const freeSlotIndex of usersFreeSlots.freeSlots) {
                const timeDifferenceOfSlotsTimes = (freeSlotIndex.end.getTime() - freeSlotIndex.start.getTime()) / (1000 * 60);
                
                const freeSlotStartTime = new Date(freeSlotIndex.start);
                const freeSlotEndTime = new Date(freeSlotIndex.end);
                
                if (
                    parseInt(meeting.duration) <= timeDifferenceOfSlotsTimes &&
                    new Date(freeSlotStartTime).getUTCHours() <= 17 &&
                    new Date(freeSlotEndTime).getUTCHours() <= 17
                ) {
                    let meetingStartTime = freeSlotStartTime;
                    let meetingEndTime = freeSlotStartTime;
                    new Date(meetingEndTime.setMinutes(meetingEndTime.getMinutes() + parseInt(meeting.duration)));
                    
                    meetingStartTime = new Date(freeSlotIndex.start);
                    meetingEndTime = new Date(meetingEndTime);
                    const scheduledMeeting = meeting;
                    
                    const meetingCreatedData = await createCalendarMeetingEvent(
                        meetingStartTime,
                        meetingEndTime,
                        scheduledMeeting,
                        meeting.organizerEmail,
                        googleCalendarAuth
                    );
                    return meetingCreatedData;
                }
            }
        }
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * createCalendarMeetingEvent
 *
 * @param meeting Meeting
 *
 */
const createCalendarMeetingEvent = async (
    meetingStartTime,
    meetingEndTime,
    scheduledMeeting,
    organizerEmail,
    googleCalendarAuth
) => {
    try {
        const calendar = google.calendar({version: 'v3'});
        
        let meetingEvent = {
            summary: scheduledMeeting.title,
            description: scheduledMeeting.description,
            start: {
                dateTime: meetingStartTime, // will change the meeting start and end time
                timeZone: '',
            },
            end: {
                dateTime: meetingEndTime,
                timeZone: '',
            },
            attendees: [{email: scheduledMeeting.attendeesEmail.toString()}],
            conferenceData: {
                createRequests: {
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',
                    },
                    requestId: 'somerequestid',
                }
            }
        };
        const response = await calendar.events.insert({
            auth: googleCalendarAuth,
            calendarId: organizerEmail.toString(),
            conferenceDataVersion: 1,
            resource: meetingEvent,
            sendNotifications: true,
        });
        
        return response.data
        
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * getUsersFreeSlots
 * You got the within days from user, and we need to get the exact date
 * I got the new Hire start date and day from(means that start day from within)
 * @param participantsEmail
 * @param withingEndDate
 * @param withinStartDate
 * @param userStartDate
 * @param googleCalendarAuth
 */
const getUsersFreeSlots = async (
    participantsEmail,
    withinStartDate,
    withingEndDate,
    userStartDate,
    googleCalendarAuth
) => {
    try {
        const withinDates = calculateExactDuration(userStartDate, withinStartDate, withingEndDate);
        let secondUserBusySchedule = [];
        let firstUserBusySchedule = [];
        const UsersTimeZoneAndDifference = await getUsersTimeZoneAndDifference(participantsEmail, googleCalendarAuth);
        for (let [emailIndex, email] of participantsEmail.entries()) {
            const freeBusySlots = await google.calendar({version: 'v3', auth: googleCalendarAuth}).freebusy.query({
                resource: {
                    timeMin: new Date(withinDates.startDay.setHours(9, 0, 0)),
                    timeMax: new Date(withinDates.endDay.setHours(17, 0, 0)),
                    timeZone: UsersTimeZoneAndDifference.usersTimeZone[emailIndex].timeZone,
                    items: [{id: email}],
                },
            });
            let usersBusySlots = freeBusySlots.data.calendars[email].busy;
            const busySlots = usersBusySlots.map((busySlot) => {
                let startTime = new Date(busySlot.start).getTime();
                startTime += UsersTimeZoneAndDifference.timeDifference * 60 * 1000; //TODO this
                let endTime = new Date(busySlot.end).getTime();
                endTime += UsersTimeZoneAndDifference.timeDifference * 60 * 1000;
                
                return {
                    start: new Date(startTime),
                    end: new Date(endTime),
                };
            });
            if (busySlots) {
                if (email === UsersTimeZoneAndDifference.higherTimZoneUser['userEmail']) {
                    secondUserBusySchedule.push(...busySlots);
                } else {
                    firstUserBusySchedule.push(...busySlots);
                }
            }
        }
        for (const busySlot of firstUserBusySchedule) {
            const currentTimeHours = new Date(new Date().setHours(9, 0 + UsersTimeZoneAndDifference.timeDifference, 0, 0)).getUTCHours();
            if (new Date(busySlot.start).getUTCHours() >= currentTimeHours) {
                secondUserBusySchedule.push(busySlot);
            }
        }
        
        let bothUsersBusySlots = [];
        let bothusersFreeSlots = [];
        let bothUsersFreeDates = [];
        
        bothUsersBusySlots = secondUserBusySchedule;
        bothUsersBusySlots.sort((a, b) => {
            if (a.start < b.start) return -1;
            if (a.start > b.start) return 1;
            return 0;
        });
        
        const startTime = new Date(bothUsersBusySlots[0].start);
        const endTime = new Date(withinDates.endDay).getTime();
        
        let currentTime = startTime.getTime();
        
        const busySlots = new Set();
        
        for (const slot of bothUsersBusySlots) {
            let start = moment(slot.start);
            let end = moment(slot.end);
            
            let overlapping = false;
            for (const existing of busySlots) {
                if (start.isBetween(existing['start'], existing['end']) || end.isBetween(existing['start'], existing['end'])) {
                    overlapping = true;
                    break;
                }
            }
            if (!overlapping) {
                busySlots.add(slot);
            }
        }
        
        bothUsersBusySlots = Array.from(busySlots);
        for (const busySlot of bothUsersBusySlots) {
            const busyStart = new Date(busySlot.start).getTime();
            const busyEnd = new Date(busySlot.end).getTime();
            
            if (currentTime < busyStart) {
                bothusersFreeSlots.push({start: new Date(currentTime), end: new Date(busyStart)});
            }
            
            currentTime = busyEnd;
        }
        if (currentTime < endTime) {
            bothusersFreeSlots.push({start: new Date(currentTime), end: new Date(endTime)});
        }
        
        for (let date = withinDates.startDay; date <= withinDates.endDay; date.setDate(date.getDate() + 1)) {
            const withinStartDay = new Date(date);
            let start = new Date(withinStartDay.getFullYear(), withinStartDay.getMonth(), withinStartDay.getDate()); // start of the day
            start.setHours(parseInt(secondUserBusySchedule[1].start.getUTCHours())); // set the hours to 00:00:00:000
            start.setMinutes(+UsersTimeZoneAndDifference.timeDifference);
            
            let end = new Date(withinStartDay.getFullYear(), withinStartDay.getMonth(), withinStartDay.getDate()); // end of the day
            end.setHours(17, UsersTimeZoneAndDifference.timeDifference, 59, 999); // set the hours to 23:59:59:999
            if (await checkIfFree(date, UsersTimeZoneAndDifference.usersTimeZone[0].userEmail, googleCalendarAuth)) {
                bothUsersFreeDates.push(new Date(date));
                bothusersFreeSlots.push({
                    start: start,
                    end: end,
                });
            }
            if (await checkIfFree(date, UsersTimeZoneAndDifference.usersTimeZone[1].userEmail, googleCalendarAuth)) {
                bothUsersFreeDates.push(new Date(date));
                bothusersFreeSlots.push({
                    start: start,
                    end: end,
                });
            }
        }
        bothusersFreeSlots = eliminateWeekends(bothusersFreeSlots);
        const usersAvailability = {
            allUsersBusySlots: bothUsersBusySlots,
            freeSlots: bothusersFreeSlots,
        };
        return usersAvailability;
    } catch (error) {
        throw new Error(error);
    }
};

/**
 * calculateExactDuration
 * @param userStartDate Date,
 * @param startDay number,
 * @param endDay number,
 */
const calculateExactDuration = (userStartDate, startDay, endDay) => {
    const startDate = new Date(userStartDate);
    const futureDate = new Date(startDate);
    futureDate.setUTCDate(futureDate.getUTCDate() + endDay);
    futureDate.setHours(23, 59, 59, 999);
    const withinDates = {
        startDay: new Date(startDate.setUTCDate(startDate.getUTCDate() + startDay)),
        endDay: new Date(futureDate),
    };
    return withinDates;
};

/**
 * getUsersTimeZoneAndDifference
 * @param participantsEmail strings,
 *
 */
const getUsersTimeZoneAndDifference = async (participantsEmail, googleCalendarAuth) => {
    let usersTimeZone = [];
    let timeDifference = 0;
    let higherTimZoneUser = {};
    try {
        for (const email of participantsEmail) {
            await google
                .calendar({version: 'v3', auth: googleCalendarAuth})
                .events.list({
                    calendarId: email,
                })
                .then((res) => {
                    usersTimeZone.push({
                        userEmail: email,
                        timeZone: res.data.timeZone,
                    });
                });
        }
        
        const firstTimeZoneDateFormate = moment.tz('09:00', 'HH:mm', usersTimeZone[0]['timeZone'].toString());
        const secondTimeZoneDateFormate = moment.tz('09:00', 'HH:mm', usersTimeZone[1]['timeZone'].toString());
        
        timeDifference = secondTimeZoneDateFormate.diff(firstTimeZoneDateFormate, 'minutes');
        
        if (firstTimeZoneDateFormate.isAfter(secondTimeZoneDateFormate)) {
            higherTimZoneUser = usersTimeZone[0];
        } else {
            higherTimZoneUser = usersTimeZone[1];
        }
        
        return {
            usersTimeZone: usersTimeZone,
            timeDifference: timeDifference < 0 ? -timeDifference : timeDifference,
            higherTimZoneUser: higherTimZoneUser,
        };
    } catch (error) {
        throw new Error(error);
    }
};
/**
 * eliminateWeekends
 * @param bothusersFreeSlots strings,
 *
 */
const eliminateWeekends = (bothusersFreeSlots) => {
    bothusersFreeSlots = bothusersFreeSlots.filter((date) => {
        let start = moment(date.start);
        let end = moment(date.end);
        return start.weekday() !== 0 && start.weekday() !== 6 && end.weekday() !== 0 && end.weekday() !== 6;
    });
    return bothusersFreeSlots;
};
/**
 * checkIfFree
 * @param date strings,
 * @param calendarId
 * @param googleCalendarAuth
 */
const checkIfFree = async (date, calendarId, googleCalendarAuth) => {
    const calendar = google.calendar({version: 'v3'});
    
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
    const events = await calendar.events.list({
        auth: googleCalendarAuth,
        calendarId: calendarId,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
    });
    
    if (events.data.items.length === 0) {
        return true;
    }
    return false;
};

module.exports = {
    scheduleCalendarMeetings: scheduleCalendarMeetings,
    getUsersFreeSlots: getUsersFreeSlots,
    createCalendarMeetingEvent: createCalendarMeetingEvent
}
