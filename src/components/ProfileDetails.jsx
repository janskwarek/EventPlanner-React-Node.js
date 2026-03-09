import { useState, useEffect } from "react";
import EventCard from "./EventCard";
import "../css/ProfileDetails.css";

function ProfileDetails() {
  const [userEvents, setUserEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:5001/api/user-events", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Błąd sieci");
          return res.json();
        })
        .then((data) => {
          setUserEvents(data);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Błąd pobierania wydarzeń użytkownika:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="profile-details">
      <div className="profile-header">
        <h2>Profil Użytkownika</h2>
        <div className="profile-info">
          <p className="profile-info-item">
            <span className="profile-icon">👤</span>
            <strong>Nazwa użytkownika:</strong> {username || "Niezalogowany"}
          </p>
        </div>
      </div>

      <div className="my-events-section">
        <h3>Twoje dodane wydarzenia</h3>

        {isLoading ? (
          <p className="loading-msg">Ładowanie Twoich wydarzeń...</p>
        ) : userEvents.length > 0 ? (
          <div className="user-events-grid">
            {userEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="no-events-msg">
            Nie dodałeś jeszcze żadnych wydarzeń.{" "}
            <strong>Skorzystaj z formularza, aby stworzyć pierwsze!</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default ProfileDetails;
