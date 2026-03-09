import { con } from "../config/database.js";

export const getUserEvents = (req, res) => {
  const username = req.user.username;

  const sql = "SELECT * FROM events WHERE created_by = ? ORDER BY id DESC";
  con.query(sql, [username], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};
