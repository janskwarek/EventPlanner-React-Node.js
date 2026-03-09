import express from "express";
import { con } from "./db.js";

const router = express.Router();

router.get("/user-events", (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username jest wymagany" });
  }

  const sql = "SELECT * FROM events WHERE created_by = ? ORDER BY id DESC";

  con.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

export default router;
