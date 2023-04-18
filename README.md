# <span style="color:red;">google-calendar-free-slots-scheduler</span>

Google Calendar Free Slots Scheduler is a package that provides a simple way to schedule meetings on Google Calendar by
finding free slots in the calendars of attendees and checking for availability during specific time frame and handle the
timeZone working hours issues and also can save you valuable time and effort in the scheduling process and ensure that
everyone involved can find a suitable time to meet.

## <span style="color:red;">Installation</span>

You can install this package using npm by running the following command in your terminal.

```bash
npm install google-calendar-free-slots-scheduler
```

## <span style="color:red;">After Installation</span>

### Follow these steps:

- Setup you google service account.
- Enable the google calendar API.
- Link google service account with google admin console.

## Usage

**get all modules in one object**

The top level export gives you an object with all the three modules:

```js
var meetingSchedular = require('google-calendar-free-slots-schedular');
```

**Only get a specific module**

If you just want the scheduleCalendarMeetings,getUsersFreeSlots or createCalendarMeeting:

```js
var scheduleCalendarMeetings = require('google-calendar-free-slots-schedular').scheduleCalendarMeetings;
var getUsersFreeSlots = require('google-calendar-free-slots-schedular').getUsersFreeSlots;
var createCalendarMeeting = require('google-calendar-free-slots-schedular').createCalendarMeeting;
```

## API

### <span style="color:red;">ScheduleCalendarMeetings</span>

get the free slots of all participents and schedule the meeting within specific time frame and timeZone working hours.

**Params**

* `meetings` **{Array}**: An array of meeting objects with the necessary parameters, including the title, description,
  organizedEmail, attendeesEmail, startDay, endDay, duration, and usersAvailabilityStartDate
* `SERVICE_ACCOUNT_CLIENT_EMAIL` **{String}**: The email address of the service account used for authentication
* `SERVICE_ACCOUNT_PRIVATE_KEY` **{String}**:  The private key of the service account used for authentication.
* `ORGANIZATION_ADMIN_EMAIL` **{String}**: The email address of the organization admin whose Google Calendar will be
  used for scheduling the meetings.
* `returns` **{Array}**: scheduled google meeting data.

**Example**

```js
const {googleCalendar} = require('google-calendar-free-slots-scheduler');

const meetings = [
    {
        title: 'Example Meeting',
        description: 'This is an example meeting',
        organizedEmail: 'organizer@example.com',
        attendeesEmail: ['attendee1@example.com', 'attendee2@example.com'],
        startDay: 1, // start Day
        endDay: 7, // end day
        duration: '30', // duration of meeting in minutes
        usersAvailabilityStartDate: '2022-12-15', // start date for scheduleCalendarMeetings to find the meeting slots between given start and end day 
    },
];

const SERVICE_ACCOUNT_CLIENT_EMAIL = 'your-service-account-email@example.iam.gserviceaccount.com';
const SERVICE_ACCOUNT_PRIVATE_KEY = '-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n';
const ORGANIZATION_ADMIN_EMAIL = 'admin@example.com';

googleCalendar.scheduleCalendarMeetings(meetings, SERVICE_ACCOUNT_CLIENT_EMAIL, SERVICE_ACCOUNT_PRIVATE_KEY, ORGANIZATION_ADMIN_EMAIL)
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });
```

### <span style="color:red;">createCalendarMeetingEvent</span>

The createCalendarMeeting function is responsible for creating a new meeting on the Google Calendar of the organizer. The function takes the following parameters

**Params**

* `meetingStartTime` **{Date}**:  The start time of the meeting in ISO format.
* `meetingEndTime` **{String}**: The end time of the meeting in ISO format.
* `scheduledMeeting` **{Object}**: An object containing details of the meeting, including its title, description, organizerEmail, and attendeesEmail.
* `organizerEmail` **{String}**: The email address of the meeting organizer.
* `googleCalendarAuth` **{String}**: An authenticated Google Calendar API client.
* `returns` **{Array}**: scheduled google meeting data.

**Example**

```js
const { createCalendarMeeting } = require('google-calendar-free-slots-scheduler');

const meetingStartTime = '2023-05-01T10:00:00-07:00';
const meetingEndTime = '2023-05-01T11:00:00-07:00';
const scheduledMeeting = {
  title: 'New Meeting',
  description: 'This is a new meeting',
  organizerEmail: 'organizer@example.com',
  attendeesEmail: ['attendee1@example.com', 'attendee2@example.com'],
};
const organizerEmail = 'organizer@example.com';
const googleCalendarAuth = new google.auth.JWT(
        SERVICE_ACCOUNT_CLIENT_EMAIL,
        null,
        SERVICE_ACCOUNT_PRIVATE_KEY,
        GOOGLE_CALENDAR_SCOPE,
        ORGANIZATION_ADMIN_EMAIL
);        
        createCalendarMeeting(meetingStartTime, meetingEndTime, scheduledMeeting, organizerEmail, googleCalendarAuth)
                .then((result) => {
                  console.log(result);
                })
                .catch((error) => {
                  console.error(error);
                });
```

### <span style="color:red;">getUsersFreeSlots</span>

The getUsersFreeSlots function is responsible for fetching the free time slots for a given list of participants within a specified date range. The function takes the following parameters:

**Params**

* `participantsEmail` **{Date}**:  An array of email addresses of the participants for whom the free slots are to be fetched.
* `withinStartDate` **{String}**:  The start date in ISO format of the date range for which the free slots are to be fetched.
* `withinEndDate` **{Object}**: The end date in ISO format of the date range for which the free slots are to be fetched.
* `userStartDate` **{String}**: The start date in ISO format from which to start fetching the free slots.
* `googleCalendarAuth` **{String}**: An authenticated Google Calendar API client.
* `returns` **{Array}**: list of provided users free slots.

**Example**

```js
const { getUsersFreeSlots } = require('google-calendar-free-slots-scheduler');

const participantsEmail = ['attendee1@example.com', 'attendee2@example.com'];
const withinStartDate = '2023-05-01';
const withinEndDate = '2023-05-07';
const userStartDate = '2023-05-01';
const googleCalendarAuth = new google.auth.JWT(
        SERVICE_ACCOUNT_CLIENT_EMAIL,
        null,
        SERVICE_ACCOUNT_PRIVATE_KEY,
        GOOGLE_CALENDAR_SCOPE,
        ORGANIZATION_ADMIN_EMAIL
);
getUsersFreeSlots(participantsEmail, withinStartDate, withinEndDate, userStartDate, googleCalendarAuth)
                .then((result) => {
                  console.log(result);
                })
                .catch((error) => {
                  console.error(error);
                });

```
## Conclusion

With Google Calendar Free Slots Scheduler, scheduling meetings on Google Calendar can be simple and hassle-free. This
package can save you valuable time and effort in the scheduling process and ensure that everyone involved can find a
suitable time to meet.

## License

This package is licensed under the MIT License.
