import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/Tickets.css";
import TicketPDF from "../components/TicketPDF";

function Tickets() {
  const { eventId } = useParams();
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [ticketType, setTicketType] = useState("normal");
  const [qrData, setQrData] = useState("");
  const ticketRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:5001/api/events")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        const event = data.find((e) => e.id === parseInt(eventId));
        setSelectedEvent(event);
      })
      .catch((err) => console.error(err));
  }, [eventId]);

  useEffect(() => {
    if (selectedEvent) {
      const username = localStorage.getItem("username") || "gosc";
      const typeLabel =
        ticketType === "normal"
          ? "NORMALNY"
          : ticketType === "discounted"
            ? "ULGOWY"
            : "VIP";
      const qrString = `EVENT=${selectedEvent.id};USER=${username};TYPE=${typeLabel};DATE=${selectedEvent.date};PRICE=${selectedEvent.price}`;
      setQrData(qrString);
    }
  }, [selectedEvent, ticketType]);

  const generatePDF = async () => {
    if (!ticketRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const jsPDF = (await import("jspdf")).default;

      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: [120, 65],
      });

      pdf.addImage(imgData, "PNG", 0, 0, 120, 65);
      pdf.save(`bilet_${selectedEvent?.id || "event"}_${ticketType}.pdf`);
    } catch (err) {
      console.error("Błąd generowania PDF:", err);
      alert("Błąd podczas generowania biletu PDF: " + err.message);
    }
  };

  const getPrice = () => {
    if (!selectedEvent) return 0;
    const basePrice = parseFloat(selectedEvent.price) || 0;
    switch (ticketType) {
      case "vip":
        return basePrice * 1.5;
      case "discounted":
        return basePrice * 0.5;
      default:
        return basePrice;
    }
  };

  return (
    <>
      <div className="ticket-shop">
        {selectedEvent ? (
          <>
            <h1>{selectedEvent.title}</h1>
            <p className="ticket-date">📅 {selectedEvent.date}</p>
            <p className="ticket-price">
              Cena bazowa: <strong>{selectedEvent.price} zł</strong> <br />
              Vip +50%, Ulgowy -50% (na podstawie ceny bazowej)
            </p>
            <hr />
          </>
        ) : (
          <h1>Ładowanie wydarzenia...</h1>
        )}

        <h2>Wybierz bilet</h2>
        <select
          name="ticket-type"
          id="ticket-type"
          value={ticketType}
          onChange={(e) => setTicketType(e.target.value)}
        >
          <option value="normal">Normalny</option>
          <option value="discounted">Ulgowy</option>
          <option value="vip">VIP </option>
        </select>

        <div className="ticket-actions">
          <button onClick={generatePDF} className="buy-ticket-btn">
            Pobierz bilet (PDF)
          </button>
          <Link to="/" className="back-link">
            ← Wróć do wydarzeń
          </Link>
        </div>
      </div>

      <TicketPDF
        ref={ticketRef}
        selectedEvent={selectedEvent}
        ticketType={ticketType}
        qrData={qrData}
        getPrice={getPrice}
      />
    </>
  );
}

export default Tickets;
