import { Router } from "express";
import { sendMessage } from "../lib/rabbitmq";
import { QUEUES } from "../constants";

const emailRoute = Router();

emailRoute.post("/email", (req, res) => {
  const { message } = req.body;

  sendMessage(QUEUES.EMAIL, JSON.stringify({ message }));

  res.json({ message: "Email sent to the queue" });
});

export { emailRoute };
