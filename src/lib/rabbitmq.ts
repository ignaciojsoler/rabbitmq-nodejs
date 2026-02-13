import amqplib from "amqplib";

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost:5672";

let channel: amqplib.Channel | null = null;

export const connectRabbitMQ = async () => {
  const connection = await amqplib.connect(RABBITMQ_URL); // connect to RabbitMQ server
  channel = await connection.createChannel(); // create a channel

  if (!channel) {
    throw new Error("Failed to create channel");
  }

  await channel.assertQueue("hello", { durable: false }); // create a queue called 'hello'. Durable means the queue will survive a server restart.

  console.log("Connected to RabbitMQ");
};

export const getChannel = () => {
  if (!channel) {
    throw new Error("Channel not connected");
  }

  return channel;
};

export const sendMessage = async (queue: string, message: string) => {
  const channel = getChannel();

  channel.assertQueue(queue, { durable: false }); // create a queue if it doesn't exist.

  channel.sendToQueue(queue, Buffer.from(message), { persistent: true });

  console.log(`Message sent to ${queue}: ${message}`);
};
