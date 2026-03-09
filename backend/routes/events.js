import express from "express";
import { getAllEvents, createEvent } from "../controllers/eventsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/events", getAllEvents);
router.post("/events", verifyToken, createEvent);

export default router;
