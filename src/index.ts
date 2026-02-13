import express from "express";
import { connectRabbitMQ } from "./lib/rabbitmq";
import router from "./routes/router";
import { startConsumers } from "./consumers/consumers";

const app = express();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Connect to RabbitMQ
connectRabbitMQ();

// Routes
app.use("/", router);

// Start server
const startServer = async () => {
  await connectRabbitMQ();

  startConsumers(); // start the consumers

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
