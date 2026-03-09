import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { con } from "../config/database.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key_change_this";

export const login = (req, res) => {
  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ error: "Login i hasło są wymagane" });
  }

  if (password.trim() === "") {
    return res.status(400).json({ error: "Hasło nie może być puste" });
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
};

export const register = async (req, res) => {
  const { login, password } = req.body;

  try {
    const hashed_password = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO accounts (username, password) VALUES (?,?)";
    con.query(sql, [login, hashed_password], (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ message: "Użytkownik o tej nazwie już istnieje" });
        }
        return res.status(500).json({ message: `Błąd serwera: ${err.message}` });
      }
      res.json({ message: "Użytkownik zarejestrowany pomyślnie" });
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: `Błąd serwera: ${err.message}` });
  }
};
