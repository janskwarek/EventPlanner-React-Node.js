import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const sendData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResponse("");

    try {
      const res = await fetch("http://localhost:5001/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
        credentials: "include",
      });

      const data = await res.json();
      setResponse(data.message || "Rejestracja udana!");
      if (data.message.includes("pomyślnie")) {
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (error) {
      console.error("Błąd podczas rejestracji:", error);
      setResponse("Błąd podczas rejestracji. Spróbuj ponownie.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <header className="login-header">
          <h1>Witaj na stronie EventPlanner</h1>
          <p className="login-subtitle">
            Utwórz konto, aby zacząć planować swoje wydarzenia za pomoca naszej
            aplikacji!
          </p>
        </header>

        <div className="login-form-wrapper">
          <form className="login-form" onSubmit={sendData}>
            <div className="form-group">
              <label htmlFor="login">Login</label>
              <input
                type="text"
                id="login"
                className="form-input"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="Utwórz swój login"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Hasło</label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Utwórz swoje hasło"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Rejestrowanie..." : "Zarejestruj się"}
            </button>

            <button
              type="button"
              className="login-btn register-btn"
              onClick={() => navigate("/login")}
            >
              Masz już konto? Zaloguj się
            </button>
          </form>

          {response && (
            <p
              className={`response-msg ${response.includes("Błąd") ? "error" : "success"}`}
            >
              {response}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;

// Register.jsx: Strona rejestracji nowego użytkownika
// - Formularz z pola login i hasło
// - Wysyła POST do /api/register
// - Po sukcesie: komunikat "pomyślnie" i redirect do /login po 1.5s
// - Wyświetla komunikaty sukcesu/błędu
// - Przycisk do logowania jeśli użytkownik już ma konto
