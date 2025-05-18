const amqp = require('amqplib');

const RABBIT_URL = process.env.RABBIT_URL;
const QUEUE = 'notifications';

async function publish(notificationId) {
  const conn = await amqp.connect(RABBIT_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });
  channel.sendToQueue(QUEUE, Buffer.from(notificationId), { persistent: true });
  setTimeout(() => conn.close(), 500);
}

module.exports = { publish, QUEUE };
