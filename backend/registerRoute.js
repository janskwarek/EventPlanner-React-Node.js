import express from "express";
import register from "./registerController.js";
const router = express.Router();

router.post("/Register", register);

export default router;

// registerRoute.js: Route do rejestracji nowych użytkowników
// - POST /Register: {login, password}
// - Deleguje do registerController (z bcrypt hashing)
// - Sprawdza duplikaty za pomocą error code ER_DUP_ENTRY
// - Zwraca: {message: "pomyślnie"} lub błąd
