import express from "express";
import { con } from "./db.js";

const router = express.Router();

router.get("/favorites", (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username jest wymagany" });
  }

  const sql = `
    SELECT events.* FROM events 
    JOIN favorites ON events.id = favorites.event_id
    WHERE favorites.username = ?
  `;
  con.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

router.get("/favorites/ids", (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username jest wymagany" });
  }

  const sql = "SELECT event_id FROM favorites WHERE username = ?";
  con.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.map((row) => row.event_id));
  });
});

router.post("/favorites/:id", (req, res) => {
  const eventId = req.params.id;
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: "Username jest wymagany" });
  }

  con.query(
    "SELECT * FROM favorites WHERE event_id = ? AND username = ?",
    [eventId, username],
    (err, result) => {
      if (result.length > 0) {
        con.query(
          "DELETE FROM favorites WHERE event_id = ? AND username = ?",
          [eventId, username],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ isFavorite: false });
          },
        );
      } else {
        con.query(
          "INSERT INTO favorites (event_id, username) VALUES (?, ?)",
          [eventId, username],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ isFavorite: true });
          },
        );
      }
    },
  );
});

export default router;

// favoritesRoute.js: Route do zarządzania ulubionymi eventami
// - GET /favorites?username=X: zwraca wszystkie ulubione eventy użytkownika
// - GET /favorites/ids?username=X: zwraca tylko IDs ulubionych
// - POST /favorites/:id?username=X: toggle favorite (dodaj lub usuń)
// - UNIQUE(event_id, username) zapobiega duplikatom
// - Wszystkie operacje wymagają username w query param
// - DELETE jest CASCADE (usunięcie eventu usuwa z favorites)
