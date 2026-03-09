import express from "express";
import {
  getAllEvents,
  createEvent,
  deleteEvent,
} from "../controllers/eventsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/events", getAllEvents);
router.post("/events", verifyToken, createEvent);
router.delete("/events/:id", verifyToken, deleteEvent);

export default router;
