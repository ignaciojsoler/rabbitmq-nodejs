import { Router } from "express";
import { sendMessage } from "../lib/rabbitmq";

const emailRoute = Router();

emailRoute.post("/email", (req, res) => {
  const { message } = req.body;

  sendMessage("email", message);

  res.json({ message: "Message sent" });
});

export { emailRoute };
