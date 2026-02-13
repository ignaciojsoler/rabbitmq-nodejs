import { getChannel } from "../lib/rabbitmq";
import { QUEUES } from "../constants";

export const emailConsumer = () => {
  const channel = getChannel(); // get the channel from the RabbitMQ connection

  channel.prefetch(1); // prefetch one message at a time to avoid duplicate messages

  channel.consume(QUEUES.EMAIL, async (msg) => {
    // consume messages from the email queue
    try {
      if (!msg) return;

      console.log(`Received message from email queue: ${msg.content.toString()}`);

      const email = JSON.parse(msg.content.toString()); // parse the message to JSON
      
      await new Promise((resolve) => setTimeout(resolve, 5000)); // simulate email sending
      
      console.log(`Email sent to the user: ${JSON.stringify(email)}`);
      console.log(`Date: ${new Date().toISOString()}`);

      channel.ack(msg); // acknowledge the message to remove it from the queue
    } catch (error) {
      console.error(`Error sending email: ${error}`);
    }
  });
};
