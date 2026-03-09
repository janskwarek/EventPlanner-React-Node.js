import React, { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import "../css/TicketPDF.css";

const TicketPDF = forwardRef(
  (
    {
      selectedEvent,
      ticketType,
      qrData,
      getPrice,
      getTypeClass,
      getTypeLabel,
      getPriceClass,
    },
    ref,
  ) => {
    const getTypeClassName = () => {
      switch (ticketType) {
        case "vip":
          return "vip";
        case "discounted":
          return "discounted";
        default:
          return "normal";
      }
    };

    const getTypeLabelText = () => {
      switch (ticketType) {
        case "normal":
          return "NORMALNY";
        case "discounted":
          return "ULGOWY";
        default:
          return "VIP";
      }
    };

    const getPriceClassName = () => {
      switch (ticketType) {
        case "vip":
          return "ticket-price-vip";
        case "discounted":
          return "ticket-price-discounted";
        default:
          return "ticket-price-normal";
      }
    };

    return (
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        <div ref={ref} className="ticket-pdf-container">
          {/* Lewa strona - informacje */}
          <div className="ticket-pdf-left">
            <div>
              <span className={`ticket-pdf-type ${getTypeClassName()}`}>
                {getTypeLabelText()}
              </span>
            </div>

            <h2 className="ticket-pdf-title">
              {selectedEvent?.title || "Wydarzenie"}
            </h2>

            <div className="ticket-pdf-info">
              <p>
                <strong>Data:</strong>{" "}
                {selectedEvent?.date || "Brak podanej daty"}
              </p>
              <p>
                <strong>Miejsce:</strong>{" "}
                {selectedEvent?.location || "Skontaktuj sie z organizatorem"}
              </p>
              <p>
                <strong>Host:</strong>{" "}
                {selectedEvent?.created_by || "Anonimowy"}
              </p>
              <p className="ticket-pdf-price">
                <strong>Cena:</strong>{" "}
                <span className={getPriceClassName()}>
                  {getPrice().toFixed(2)} zł
                </span>
              </p>
            </div>
          </div>

          {/* Prawa strona - QR kod */}
          <div className="ticket-pdf-right">
            <div className="ticket-pdf-qr">
              <QRCodeSVG
                value={qrData}
                size={100}
                level={"H"}
                includeMargin={false}
              />
            </div>
            <p className="ticket-pdf-qr-label">Zeskanuj przy wejściu</p>
          </div>

          {/* Stopka */}
          <div className="ticket-pdf-footer">
            <span>Event Planner App</span>
            <span>{new Date().toLocaleDateString("PL")}</span>
          </div>
        </div>
      </div>
    );
  },
);

TicketPDF.displayName = "TicketPDF";

export default TicketPDF;
