import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import eventsRoutes from "./routes/events.js";
import favoritesRoutes from "./routes/favorites.js";
import userEventsRoutes from "./routes/userEvents.js";
import "./config/database.js";

dotenv.config();

const app = express();
const PORT = 5001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api", authRoutes);
app.use("/api", eventsRoutes);
app.use("/api", favoritesRoutes);
app.use("/api", userEventsRoutes);

app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));
