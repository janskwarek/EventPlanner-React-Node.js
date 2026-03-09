import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { con } from "./db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_change_this";

router.post("/login", (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: "Brak loginu lub hasła" });
  }

  const sql = "SELECT * FROM accounts WHERE username = ?";
  con.query(sql, [login], async (err, result) => {
    if (err) {
      console.error("Login error:", err.message);
      return res.status(500).json({ error: "Błąd serwera" });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: "Nieprawidłowy login lub hasło" });
    }

    try {
      const user = result[0];

      let passwordMatch = await bcrypt
        .compare(password, user.password)
        .catch(() => false);

      if (!passwordMatch && password === user.password) {
        passwordMatch = true;
      }

      if (!passwordMatch) {
        return res.status(401).json({ error: "Nieprawidłowy login lub hasło" });
      }

      const token = jwt.sign({ username: user.username }, JWT_SECRET, {
        expiresIn: "1h",
      });
      res.cookie("token", token, { httpOnly: true });
      res.json({
        message: "Zalogowano pomyślnie",
        token,
        username: user.username,
      });
    } catch (error) {
      console.error("Error comparing password:", error);
      res.status(500).json({ error: "Błąd serwera" });
    }
  });
});

export default router;

// loginRoute.js: Route do logowania użytkownika
// - POST /login: {login, password}
// - Wyszukuje użytkownika w tabeli accounts
// - Porównuje hasło z bcrypt.compare (z fallback na plaintext)
// - Generuje JWT token (1h expiration) z username w payload
// - Zwraca: {token, username, message}
// - Cookies: httpOnly token (dla dodatkowej bezpieczeństwa)
