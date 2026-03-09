import express from "express";
import { con } from "./db.js";

const router = express.Router();

router.get("/events", (req, res) => {
  const sql = "SELECT * FROM events ORDER BY id DESC";
  con.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Błąd serwera" });
    res.json(result);
  });
});

router.post("/events", (req, res) => {
  const { title, date, url, price, description, created_by } = req.body;

  if (!title || !date) {
    return res.status(400).json({ error: "Tytuł i data są wymagane" });
  }

  const sql =
    "INSERT INTO events (title, date, url, price, description, created_by) VALUES (?, ?, ?, ?, ?, ?)";

  con.query(
    sql,
    [
      title,
      date,
      url || "",
      price || 0,
      description || "",
      created_by || "Anonymous",
    ],
    (err, result) => {
      if (err) {
        console.error("Database error adding event:", err.message);
        return res
          .status(500)
          .json({ error: "Błąd serwera podczas dodawania" });
      }

      const newEvent = {
        id: result.insertId,
        title,
        date,
        url,
        price: price || 0,
        description: description || "",
        created_by: created_by || "Anonymous",
      };

      res.status(201).json(newEvent);
    },
  );
});

export default router;
