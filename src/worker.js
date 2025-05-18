require('dotenv').config();
const amqp = require('amqplib');
const Notification = require('./models/notification');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const RABBIT_URL = process.env.RABBIT_URL;
const QUEUE = 'notifications';
const MAX_RETRIES = 3;
const BASE_DELAY = 60000;

// Twilio client
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function processMessage(msg, channel) {
  const id = msg.content.toString();
  console.log(`Received message with notification ID: ${id}`);

  const notif = await Notification.findByPk(id);
  if (!notif) {
    console.error(`Notification with ID ${id} not found!`);
    channel.ack(msg);
    return;
  }

  console.log(`Processing notification ${id} of type ${notif.type}`);

  try {
    if (notif.type === 'email') {
      await sendEmail(notif.payload);
    } else if (notif.type === 'sms') {
      await sendSMS(notif.payload);
    } else {
      await sendInApp(notif.payload); // Optional
    }

    notif.status = 'sent';
    console.log(`Notification ${id} sent successfully.`);
  } catch (err) {
    console.error(`Error processing notification ${id}:`, err);
    notif.retries += 1;
    if (notif.retries < MAX_RETRIES) {
      console.log(`Retrying notification ${id} after delay... Retry #${notif.retries}`);
      setTimeout(() => channel.nack(msg, false, true), BASE_DELAY * Math.pow(2, notif.retries - 1));
      return;
    } else {
      notif.status = 'failed';
      console.log(`Notification ${id} failed after ${notif.retries} retries.`);
    }
  }

  await notif.save();
  channel.ack(msg);
}

(async () => {
  const conn = await amqp.connect(RABBIT_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  channel.consume(QUEUE, msg => processMessage(msg, channel));
  console.log('Worker listening for messages...');
})();

// ========== Email, SMS, In-App ==========

async function sendEmail(payload) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: payload.to,
    subject: payload.subject,
    text: payload.body
  };

  await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${payload.to}`);
}

async function sendSMS(payload) {
  await twilioClient.messages.create({
    body: payload.body,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: payload.to
  });
  console.log(`SMS sent to ${payload.to}`);
}

async function sendInApp(payload) {
  // You can implement WebSocket or push service here
  console.log(`In-app message: ${payload.body}`);
}
