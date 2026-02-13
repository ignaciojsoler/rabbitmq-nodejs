import { emailConsumer } from "./emailConsumer";

export const startConsumers = () => {
  emailConsumer(); // start the email consumer
};