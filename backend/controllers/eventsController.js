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

  if (!title || !date) {
    return res.status(400).json({ error: "Tytuł i data są wymagane" });
  }

  const sql =
    "INSERT INTO events (title, date, url, price, description, created_by) VALUES (?, ?, ?, ?, ?, ?)";

  con.query(
    sql,
    [title, date, url || "", price || 0, description || "", created_by],
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
