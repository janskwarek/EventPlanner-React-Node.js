import { con } from "../config/database.js";

export const getFavorites = (req, res) => {
  const username = req.user.username;

  const sql = `
    SELECT events.* FROM events 
    JOIN favorites ON events.id = favorites.event_id
    WHERE favorites.username = ?
  `;
  con.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

export const getFavoriteIds = (req, res) => {
  const username = req.user.username;

  const sql = "SELECT event_id FROM favorites WHERE username = ?";
  con.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result.map((row) => row.event_id));
  });
};

export const addFavorite = (req, res) => {
  const eventId = req.params.id;
  const username = req.user.username;

  con.query(
    "SELECT * FROM favorites WHERE event_id = ? AND username = ?",
    [eventId, username],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Błąd serwera" });
      if (result.length > 0) {
        return res.status(400).json({ message: "Event już jest w ulubionych" });
      }

      con.query(
        "INSERT INTO favorites (event_id, username) VALUES (?,?)",
        [eventId, username],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ message: "Dodano do ulubionych", isFavorite: true });
        }
      );
    }
  );
};

export const removeFavorite = (req, res) => {
  const eventId = req.params.id;
  const username = req.user.username;

  const sql = "DELETE FROM favorites WHERE event_id = ? AND username = ?";
  con.query(sql, [eventId, username], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Usunięto z ulubionych", isFavorite: false });
  });
};
