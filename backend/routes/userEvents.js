import express from "express";
import { getUserEvents } from "../controllers/userEventsController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/user-events", verifyToken, getUserEvents);

export default router;
