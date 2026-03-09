import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

function LoginPassword() {
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
      const res = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Coś poszło nie tak");
      }

      setResponse("Zalogowano pomyślnie!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setResponse(`Błąd: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <header className="login-header">
          <h1>Witaj na stronie EventPlanner!</h1>
          <p className="login-subtitle">
            Zaloguj się, aby zarządzać swoimi wydarzeniami
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
                placeholder="Wpisz swój login"
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
                placeholder="Wpisz swoje hasło"
                required
              />
            </div>

            <button type="submit" className="login-btn" disabled={isLoading}>
              {isLoading ? "Logowanie..." : "Zaloguj się"}
            </button>

            <button
              type="button"
              className="login-btn register-btn"
              onClick={() => navigate("/register")}
            >
              Nie masz konta? Zarejestruj się
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
}

export default LoginPassword;
