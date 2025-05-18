# NotificationModel-PepSales
A microservice to send notifications via Email, SMS, and In-App channels.Built with queue-based processing and retry logic for reliability.

📢 Notification Service
🚀 Objective
A system designed to send notifications to users via Email, SMS, and In-App channels. This service provides RESTful APIs to send and retrieve notifications.

🧩 Features
Send notifications to users.

Retrieve a user’s notifications.

Supports Email, SMS, and In-App types.

Notification processing via message queue (e.g., RabbitMQ/Kafka).

Retry mechanism for failed notifications.

📘 API Endpoints
➕ Send Notification
POST /notifications

Request Body:

json
Copy
Edit
{
  "userId": "123",
  "type": "email", // or "sms", "in-app"
  "message": "Your message here"
}
📥 Get User Notifications
GET /users/{id}/notifications

⚙️ Tech Stack
Backend: Node.js 

Queue: RabbitMQ

Database: PostgreSQL 

Others: Express 

🧪 Retry Mechanism
Failed notifications are retried X times (mention how many times and with what delay if applicable).

**HOW TO RUN**

1) Add the desired API keys and authentication to .env file.
DATABASE_URL=postgres://user:password@localhost:5432/databasename
RABBIT_URL=amqp://guest:guest@localhost
PORT=3000

# Email (Nodemailer using Gmail App Password)
EMAIL_USER=your email
EMAIL_PASS=your password generated from App password under security section in Google my account

# Twilio (SMS)
TWILIO_ACCOUNT_SID=Your SID
TWILIO_AUTH_TOKEN=Your Auth Token
TWILIO_PHONE_NUMBER= Number generated


2) Run docker
3) Run RabbitMQ
4) In the terminal(VsCode) run index.js by node index.js
5) In the terminal(VsCode) run workder.js by node worker.js
6) Go to Postman and create a POST request on http://localhost:3000/notifications


You will get the desired mail and sms in your phone number.
