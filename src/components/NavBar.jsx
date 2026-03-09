import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
    setIsMenuOpen(false);
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" onClick={closeMenu}>
          Events app
        </Link>
      </div>

      <button
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className="navbar-links">
        <Link to="/" className="nav-link" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/favorites" className="nav-link" onClick={closeMenu}>
          Favorites
        </Link>
        <Link to="/ProfilePage" className="nav-link" onClick={closeMenu}>
          Profil
        </Link>

        {!token ? (
          <Link to="/login" className="login-link" onClick={closeMenu}>
            Zaloguj się
          </Link>
        ) : (
          <button onClick={logout} className="login-link">
            Wyloguj
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <Link to="/" className="mobile-nav-link" onClick={closeMenu}>
          Home
        </Link>
        <Link to="/favorites" className="mobile-nav-link" onClick={closeMenu}>
          Favorites
        </Link>
        {!token ? (
          <Link to="/login" className="mobile-nav-link" onClick={closeMenu}>
            Zaloguj się
          </Link>
        ) : (
          <button onClick={logout} className="mobile-nav-link logout-btn">
            Wyloguj
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
