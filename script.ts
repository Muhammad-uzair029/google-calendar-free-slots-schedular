const meetingSchedular = require('google-calendar-free-slots-schedular')

const GCP_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCMF6DhDIKWeBiD\\nx6A+p6ChQuur/K6MVGUf/KX9G8uNe6wTn+qu2Ww7e7JIr91rO8RtDnZ5YdllAGkx\\nL0dJRtbR+au+1d1MffKmanjSg/AQbCSk6nqpelY3QvyGSnDnQYyfIGRorA1ny2Kd\\nwJIjwuCGZ+NK0Vfd9M3uD8maStV/ZclnsP+1TIJeA8pLzM9o1I+Xw3RtFE+nB1Pw\\nec+cbJ14asxgBv9MYtKGGuY0nRzaQnvpW7D0f/MxTevAdkpMIgAjevxPoyMGVdZ1\\nOuidBos8Psk4Ts+UUE+fozjjOG3DuKJdZkscyMygN7ok7Y8tSqxQUGuq/VZT9/4K\\nxVJHXZVnAgMBAAECggEAMaP7w1MSAOx8T1HQ0/LFBe93IAHQ/fO3w55cWPRc6/zr\\nLCcJ2zw60FcUBRKgJGvQvg4WaAuGo3YCUEXe/jWmUFAmjeAtYvnsHhDzUDElQ0R2\\ntaNKpLwvSbSoU5OULzW4dPhe7AIvW9yjTJ/ciOR4d9ffH/dPKdyhjd41Q0GKJnJu\\nNAbbQJbR6Ld84gses9f9IqJ0o/lfM64cFYERT8ctf77RRMsfWO6tLbuHyEzNlwrk\\nl5xFmychD3NaGsjOPJ/cbwcv1Tn60Sqdq/q0w9Cw5v3f5ofa8rADgDCSnLuDVEQL\\n97ULGLhvQjpf1c9eAf9xCY2Pi87eOoCE23zKIMs9CQKBgQC/ijpfiaUsLUGmfU3f\\nLX33bMLVGgvGkNiRlopTVR3oDaf9R5dkhVriLqnMJ21fDlqZeBD6ulTFzFllxr54\\nQNCaHDWdhG8DZydvU8iikMgFpOwGDGca4efma3wAihFHvYpRyQauZzIbKe+DffRM\\nHyyGXf+NYNE5kYdQyEn5tROO2QKBgQC7PQW//y7RsIlIl7lfcLD5IyyucbqcpGy5\\n/Q7xok8Y0cTxIVPthX0hrI3fqnZEbojTLK/Qa6sckM8MH1qw9mvZeIReBebfsuBB\\nyVh4QWVbM959eYEXU4gyK7PhX2hU30eBzx0XW2y50mD+iJnUuwP1+JfFsnVU+3gQ\\ndQvccVAePwKBgQCa32rJmyNp8AH4W7MedMs4x8FVy+SfnrjuJzobnWQ8IOanPj7k\\ncYuF/VMgFvUxegq5ssKP6R/oe44BZEzYMRg6s/qKLe4RY1QYiTdecxC4t5x8W4T2\\n0JjQ0DIIwZqtVk3ESXZUiG6UVjkrKinhbwdycgjTSOiD0u8F250tAkQZKQKBgHcu\\nnJ5d3Ht1F62xhjmODdhH34Uat2JF9z9cKUr9ucNeozGpuTaTpdbtc1FPvABLK6Tf\\n6PmNz1lbg69/tca21GeVIwyGTTNPNRgrBblmRxIKrjDISreCYEsvLkzi4hJEHcwu\\n/aGEfGy70Smz4ddbQ2YqWtFoiu8RMpenKWmkZw8ZAoGBALH4KuSygzIamnzSz6mL\\nGU9aTRj+nPo2u3/1yM1RqClL5IJMK4VL9blTi5YnkSla0e9ijrEXgmnvlkWTIehd\\nfVk+XnFUMOznCkgbMohxo4H7AW1C2zGsLlGL6PDVF3jnMIYMTfXq4zYDXVGz6JV+\\nOHSdLViObnksfKS2nF27Q/Ww\\n-----END PRIVATE KEY-----\\n"
const SERVICE_ACCOUNT_PRIVATE_KEY = GCP_PRIVATE_KEY.split(String.raw`\n`).join("\n");
const ORGANIZATION_ADMIN_EMAIL = 'calendaradmin@kinfolkhq.com';
const SERVICE_ACCOUNT_CLIENT_EMAIL = 'uzair-48@kinfolk-staging.iam.gserviceaccount.com';

const result = meetingSchedular.scheduleCalendarMeetings([{
    title: "This is the test meeting you can delete this jeet",
    description: "This is the first meeting description",
    attendeesEmail: ["calendaradmin@kinfolkhq.com"],
    duration: "23",
    startDay: "1",
    endDay: "7",
    organizerEmail: "kim@kinfolkhq.com",
    usersAvailabilityStartDate: "2023-03-28",
}], SERVICE_ACCOUNT_CLIENT_EMAIL,
    SERVICE_ACCOUNT_PRIVATE_KEY,
    ORGANIZATION_ADMIN_EMAIL)
console.log(result)
