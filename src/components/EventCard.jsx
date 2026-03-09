import { useState, useEffect } from "react";
import "../css/EventCard.css";
import { Link } from "react-router-dom";

function EventCard({ event, isInitiallyFavorite, onToggle, onDelete }) {
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUsername = localStorage.getItem("username");
  const isOwner = currentUsername === event.created_by;

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleDeleteEvent = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Czy na pewno chcesz usunąć ten event?")) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musisz się zalogować!");
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:5001/api/events/${event.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Błąd przy usuwaniu");
      }

      alert("Event usunięty!");
      setIsModalOpen(false);
      if (onDelete) onDelete(event.id);
    } catch (err) {
      alert(`Błąd: ${err.message}`);
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const username = localStorage.getItem("username");

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Musisz się zalogować aby dodać do ulubionych!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5001/api/favorites/${event.id}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setIsFavorite(!isFavorite);
      if (onToggle) onToggle(event.id);
    } catch (err) {
      console.error("Błąd ulubionych:", err);
    }
  };

  return (
    <>
      <div className="event-card" onClick={toggleModal}>
        <div className="event-poster">
          <img
            src={event.url || "https://via.placeholder.com/300x450"}
            alt={event.title}
          />
          <button
            className={`favorite-btn ${isFavorite ? "active" : ""}`}
            onClick={handleFavoriteClick}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>
        <div className="event-info">
          <h3>{event.title}</h3>
          <p>{event.date}</p>
          {event.created_by && (
            <p className="event-creator">👤 {event.created_by}</p>
          )}
          <div className="event-price-small">
            <b>{event.price} zł</b>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={toggleModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={toggleModal}>
              ✕
            </button>
            <div className="modal-body">
              <div className="modal-img-container">
                <img src={event.url} alt={event.title} className="modal-img" />
              </div>
              <div className="modal-details">
                <div className="modal-header">
                  <h2 className="modal-title">{event.title}</h2>
                  <div className="modal-meta">
                    <span className="modal-meta-item">📅 {event.date}</span>
                    {event.created_by && (
                      <span className="modal-meta-item modal-creator">
                        👤 {event.created_by}
                      </span>
                    )}
                  </div>
                </div>
                <div className="modal-description-section">
                  <p className="modal-description-label">Opis</p>
                  <p className="modal-description">
                    {event.description || "Brak opisu."}
                  </p>
                </div>
                <div className="modal-footer">
                  <div className="modal-price-section">
                    <span className="modal-price-label">Cena biletu</span>
                    <span className="modal-price">{event.price} zł</span>
                  </div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <Link to={`/Tickets/${event.id}`} className="buy-button">
                      Kup bilet
                    </Link>
                    {isOwner && (
                      <button
                        className="delete-button"
                        onClick={handleDeleteEvent}
                        disabled={isDeleting}
                      >
                        🗑️ {isDeleting ? "Usuwanie..." : "Usuń"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EventCard;
