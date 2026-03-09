import { con } from "../config/database.js";

export const getAllEvents = (req, res) => {
  const sql = "SELECT * FROM events ORDER BY id DESC";
  con.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: "Błąd serwera" });
    res.json(result);
  });
};

export const createEvent = (req, res) => {
  const { title, date, url, price, description } = req.body;
  const created_by = req.user.username;

  // Walidacja
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Tytuł jest wymagany" });
  }
  if (!date || date.trim() === "") {
    return res.status(400).json({ error: "Data jest wymagana" });
  }
  if (price && isNaN(price)) {
    return res.status(400).json({ error: "Cena musi być liczbą" });
  }

  const sql =
    "INSERT INTO events (title, date, url, price, description, created_by) VALUES (?, ?, ?, ?, ?, ?)";

  con.query(
    sql,
    [title.trim(), date, url || "", price || 0, description || "", created_by],
    (err, result) => {
      if (err) {
        console.error("Database error adding event:", err.message);
        return res.status(500).json({ error: "Błąd serwera podczas dodawania" });
      }

      const newEvent = {
        id: result.insertId,
        title,
        date,
        url,
        price: price || 0,
        description: description || "",
        created_by,
      };

      res.status(201).json(newEvent);
    }
  );
};

export const deleteEvent = (req, res) => {
  const eventId = req.params.id;
  const username = req.user.username;

  // Sprawdzenie czy event należy do użytkownika
  const checkSql = "SELECT created_by FROM events WHERE id = ?";
  con.query(checkSql, [eventId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Błąd serwera" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Event nie znaleziony" });
    }
    if (result[0].created_by !== username) {
      return res.status(403).json({ error: "Nie masz uprawnień do usunięcia" });
    }

    // Usuń event
    const deleteSql = "DELETE FROM events WHERE id = ?";
    con.query(deleteSql, [eventId], (err) => {
      if (err) {
        return res.status(500).json({ error: "Błąd serwera" });
      }
      res.json({ message: "Event usunięty" });
    });
  });
};
