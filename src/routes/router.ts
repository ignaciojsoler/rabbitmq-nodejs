import { Router } from "express";
import { emailRoute } from "./email.route";

const router = Router();

router.get("/", (_req, res) => {
  res.json({ message: "Hello World" });
});

router.use("/", emailRoute);

export default router;
