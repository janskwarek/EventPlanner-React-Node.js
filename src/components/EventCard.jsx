import { useState, useEffect } from "react";
import "../css/EventCard.css";
import { Link } from "react-router-dom";

function EventCard({ event, isInitiallyFavorite, onToggle }) {
  const [isFavorite, setIsFavorite] = useState(isInitiallyFavorite);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsFavorite(isInitiallyFavorite);
  }, [isInitiallyFavorite]);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const username = localStorage.getItem("username");

    if (!username) {
      alert("Musisz się zalogować aby dodać do ulubionych!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5001/api/favorites/${event.id}?username=${username}`,
        { method: "POST" },
      );
      const data = await res.json();
      setIsFavorite(data.isFavorite);
      if (onToggle && !data.isFavorite) onToggle(event.id);
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
                  <Link to={`/Tickets/${event.id}`} className="buy-button">
                    Kup bilet
                  </Link>
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
