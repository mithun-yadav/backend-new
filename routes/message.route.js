import express from "express";
import { getMessage, sendMessages } from "../controller/message.controller.js";
import secureRoute from "../middleware/secureRoute.js";

const router = express.Router();
router.post("/send/:id", secureRoute, sendMessages);
router.get("/get/:id", secureRoute, getMessage);

export default router;
