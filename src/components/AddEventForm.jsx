import { useState } from "react";

function AddEventForm({ onAddEvent, onClose }) {
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    url: "",
    price: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newEvent.title || !newEvent.date) {
      setError("Tytuł i data są wymagane!");
      return;
    }

    setIsLoading(true);
    try {
      await onAddEvent(newEvent);
      setNewEvent({ title: "", date: "", url: "", price: "", description: "" });
      onClose();
    } catch (err) {
      setError(err.message || "Nie udało się dodać eventu");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="add-event-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Tytuł"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        required
      />

      <input
        type="date"
        value={newEvent.date}
        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Cena"
        step="0.01"
        value={newEvent.price}
        onChange={(e) => setNewEvent({ ...newEvent, price: e.target.value })}
      />

      <input
        type="text"
        placeholder="Link do obrazka (opcjonalnie)"
        value={newEvent.url}
        onChange={(e) => setNewEvent({ ...newEvent, url: e.target.value })}
      />

      <textarea
        placeholder="Opis"
        value={newEvent.description}
        onChange={(e) =>
          setNewEvent({ ...newEvent, description: e.target.value })
        }
        rows="4"
      />

      <button type="submit" className="submit-event-btn" disabled={isLoading}>
        {isLoading ? "Dodawanie..." : "Dodaj"}
      </button>

      {error && <p className="error-message">{error}</p>}
    </form>
  );
}

export default AddEventForm;

// AddEventForm.jsx: Formularz do dodawania nowych wydarzeń
// - Pola: title, date, price, url, description
// - Validuje czy title i date nie są puste
// - Stan error wyświetlany na górze formularza (red banner)
// - isLoading pokazuje "Dodawanie..." i disabluje przycisk
// - onClose zamyka formularz po sukcesie
// - onAddEvent callback do dodania eventu
