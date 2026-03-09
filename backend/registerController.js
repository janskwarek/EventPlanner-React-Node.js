import bcrypt from "bcrypt";
import { con } from "./db.js";
const register = async (req, res) => {
  const { login, password } = req.body;

  try {
    const hashed_password = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO accounts (username, password) VALUES (?,?)";
    con.query(sql, [login, hashed_password], (err, result) => {
      if (err) {
        console.error("Register error:", err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Użytkownik o tej nazwie już istnieje",
          });
        }

        return res.status(500).json({
          message: `błąd serwera: ${err.message}`,
        });
      }
      res.json({
        message: "Użytkownik zarejestrowany pomyślnie",
      });
    });
  } catch (err) {
    console.error("Bcrypt error:", err);
    res.status(500).json({
      message: `błąd serwera: ${err.message}`,
    });
  }
};
export default register;

// registerController.js: Logika rejestracji użytkownika
// - Haszuje hasło z bcrypt (10 rounds)
// - Wstawia login i hashed password do tabeli accounts
// - Sprawdza ER_DUP_ENTRY (login już istnieje)
// - Zwraca komunikat sukcesu lub błędu
