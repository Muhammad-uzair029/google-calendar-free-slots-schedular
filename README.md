# google-calendar-free-slots-scheduler

Google Calendar Free Slots Scheduler is a package that provides a simple way to schedule meetings on Google Calendar by finding free slots in the calendars of attendees and checking for availability during specific times and I will also handle the timeZone issues. This package can save you valuable time and effort in the scheduling process and ensure that everyone involved can find a suitable time to meet.

## Installation

You can install this package using npm by running the following command in your terminal.

```bash
npm install google-calendar-free-slots-scheduler
```

## Usage

After installing the package, you can start using it in your Node.js project by requiring the scheduleCalendarMeetings function and passing it an array of meeting objects with the necessary parameters.
You just need to provide the start and end day and timeFrame. Then scheduleCalendarMeetings will find the free slots between start and end day according to your provided usersAvailabilityStartDate.

```bash
const { scheduleCalendarMeetings } = require('google-calendar-free-slots-scheduler');

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

scheduleCalendarMeetings(meetings, SERVICE_ACCOUNT_CLIENT_EMAIL, SERVICE_ACCOUNT_PRIVATE_KEY, ORGANIZATION_ADMIN_EMAIL)
  .then((result) => {
    console.log(result);
  })
  .catch((error) => {
    console.error(error);
  });
```
In the above example, you can modify the content of the meetings array to fit your specific needs and use cases. The SERVICE_ACCOUNT_CLIENT_EMAIL and SERVICE_ACCOUNT_PRIVATE_KEY parameters are required to access the Google Calendar API, and the ORGANIZATION_ADMIN_EMAIL parameter is the email address of the user who has access to all attendees' calendars.

## Conclusion
With Google Calendar Free Slots Scheduler, scheduling meetings on Google Calendar can be simple and hassle-free. This package can save you valuable time and effort in the scheduling process and ensure that everyone involved can find a suitable time to meet.

## License
This package is licensed under the MIT License.
