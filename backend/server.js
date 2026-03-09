import express from "express";
import cors from "cors";
import LoginRoute from "./loginRoute.js";
import eventsRoute from "./eventsRoute.js";
import favoritesRoute from "./favoritesRoute.js";
import registerRoute from "./registerRoute.js";
import userEventsRoute from "./userEventsRoute.js";
import crypto from "crypto";
import "./db.js";
const app = express();
const PORT = 5001;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

app.use("/api", LoginRoute);
app.use("/api", eventsRoute);
app.use("/api", favoritesRoute);
app.use("/api", registerRoute);
app.use("/api", userEventsRoute);

app.listen(PORT, () => console.log(`Backend: http://localhost:${PORT}`));
console.log(crypto.randomBytes(64).toString("hex"));
