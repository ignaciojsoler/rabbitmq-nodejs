import express from "express";
import { connectRabbitMQ } from "./lib/rabbitmq";
import router from "./routes/router";

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

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
