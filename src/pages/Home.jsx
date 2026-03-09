import { useState, useEffect } from "react";
import EventCard from "../components/EventCard";
import AddEventForm from "../components/AddEventForm";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    fetch("http://localhost:5001/api/events")
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery("");
  };

  const handleAddEvent = async (eventData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Błąd dodawania eventu");
      }

      setEvents((prevEvents) => [data, ...prevEvents]);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="home">
      <header className="home-header">
        <div className="header-left">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search for events..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-btn">
              Search
            </button>
          </form>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="date-desc">Najnowsze</option>
            <option value="name-asc">A-Z</option>
            <option value="price-asc">Cena: od najniższej </option>
            <option value="price-desc">Cena: od najwyższej</option>
          </select>
        </div>

        <button
          className="add-event-toggle-btn"
          onClick={() => setShowAddForm((prev) => !prev)}
        >
          {showAddForm ? "✕" : "+ Add Event"}
        </button>
      </header>

      {showAddForm && (
        <AddEventForm
          onAddEvent={handleAddEvent}
          onClose={() => setShowAddForm(false)}
        />
      )}

      <div className="events-grid">
        {events
          .filter((event) =>
            event.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .sort((a, b) => {
            if (sortBy === "date-asc") {
              return new Date(a.date) - new Date(b.date);
            } else if (sortBy === "date-desc") {
              return new Date(b.date) - new Date(a.date);
            } else if (sortBy === "name-asc") {
              return a.title.localeCompare(b.title);
            } else if (sortBy === "name-desc") {
              return b.title.localeCompare(a.title);
            } else if (sortBy === "price-asc") {
              return parseFloat(a.price || 0) - parseFloat(b.price || 0);
            } else if (sortBy === "price-desc") {
              return parseFloat(b.price || 0) - parseFloat(a.price || 0);
            }
            return 0;
          })
          .map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
      </div>
    </div>
  );
}

export default Home;
