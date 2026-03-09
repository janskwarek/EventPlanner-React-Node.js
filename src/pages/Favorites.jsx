import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import "../css/Favorites.css";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5001/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleRemoveFromList = (id) => {
    setFavorites((prev) => prev.filter((event) => event.id !== id));
  };

  const handleDeleteEvent = (eventId) => {
    setFavorites((prev) => prev.filter((e) => e.id !== eventId));
  };

  if (loading)
    return (
      <div className="favorites">
        <p>Ładowanie...</p>
      </div>
    );

  return (
    <div className="favorites">
      <h2>Twoje Ulubione</h2>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <h2>Brak ulubionych</h2>
          <p>Kliknij serduszko przy wydarzeniu, aby je tu dodać!</p>
        </div>
      ) : (
        <div className="events-grid">
          {favorites.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isInitiallyFavorite={true}
              onToggle={handleRemoveFromList}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
