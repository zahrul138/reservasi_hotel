"use client";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Utility function to generate steps based on current step
const generateSteps = (currentStep) => {
  const stepDefinitions = [
    { id: 1, name: "Guest Info" },
    { id: 2, name: "Confirmation" },
    { id: 3, name: "Success" },
  ];

  return stepDefinitions.map((step) => ({
    ...step,
    status:
      step.id < currentStep
        ? "complete"
        : step.id === currentStep
          ? "current"
          : "upcoming",
  }));
};

const BookingFormThree = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData: stateBookingData, paymentMethod: statePaymentMethod } =
    location.state || {};
  const [bookingData, setBookingData] = useState(stateBookingData || null);
  const [paymentMethod, setPaymentMethod] = useState(
    statePaymentMethod || "cash"
  );
  const [calculatedTotalPrice, setCalculatedTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate nights and total price
  useEffect(() => {
    if (bookingData) {
      const calculateNights = () => {
        if (!bookingData.checkinDate || !bookingData.checkoutDate) return 0;
        const checkIn = new Date(bookingData.checkinDate);
        const checkOut = new Date(bookingData.checkoutDate);
        const diffTime = Math.abs(checkOut - checkIn);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      };

      const nightsCount = calculateNights();
      setNights(nightsCount);
      setCalculatedTotalPrice((bookingData.pricePerNight || 0) * nightsCount);
    }
  }, [bookingData]);

  // Load data from localStorage if not in state
  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = localStorage.getItem("invoiceData");
        const method = localStorage.getItem("paymentMethod");

        if (stored) {
          const parsedData = JSON.parse(stored);
          setBookingData(parsedData);

          // Calculate nights and total for stored data
          if (parsedData.checkinDate && parsedData.checkoutDate) {
            const checkIn = new Date(parsedData.checkinDate);
            const checkOut = new Date(parsedData.checkoutDate);
            const diffTime = Math.abs(checkOut - checkIn);
            const nightsCount = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setNights(nightsCount);
            setCalculatedTotalPrice(
              (parsedData.pricePerNight || 0) * nightsCount
            );
          }
        }

        if (method) {
          setPaymentMethod(method);
        }
      } catch (error) {
        console.error("Error loading booking data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!stateBookingData) {
      loadData();
    } else {
      setIsLoading(false);
    }
  }, [stateBookingData]);

  // Load html2pdf script
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `INV-${year}${month}${day}-${random}`;
  };

  // Handle navigation to invoice page
  const handleSeeInvoice = () => {
    if (!bookingData) {
      alert(
        "Booking data is not available. Please complete your booking first."
      );
      return;
    }

    navigate("/invoice", {
      state: {
        bookingData: {
          ...bookingData,
          fullName: bookingData.fullname || bookingData.fullName || "Guest",
          email: bookingData.email || "",
          phone: bookingData.phoneNumber || "",
          country: bookingData.region || "",
          address: bookingData.address || "",
          specialRequests: bookingData.specialRequest || "",
          paymentMethod: paymentMethod,
          paymentStatus: bookingData.paymentStatus || "Pending",
          pricePerNight: bookingData.pricePerNight || 0,
          nights: nights,
          totalAmount: bookingData.totalPrice || calculatedTotalPrice || 0,
        },
        paymentMethod: paymentMethod,
      },
    });
  };

  const steps = generateSteps(3);

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <h2>No booking data found</h2>
        <p>Please complete your booking first</p>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#d09500",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px",
          }}
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        /* Base Styles */
        :root {
          --primary-color: #d09500;
          --primary-hover: #87723b;
          --text-color: #333;
          --text-muted: #666;
          --border-color: #e2e8f0;
          --bg-color: #f8f5f0;
          --card-bg: #fff;
          --success-color: #2ecc71;
          --error-color: #e74c3c;
          --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: var(--font-family);
          color: var(--text-color);
          line-height: 1.5;
        }

        /* Layout */
        .booking-process {
          min-height: 100vh;
          background-color: var(--bg-color);
          padding: 3rem 1rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-hover);
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-muted);
        }

        .centered-grid {
          display: flex;
          justify-content: center;
        }

        .centered-grid .confirmation-wrapper {
          width: 100%;
          max-width: 800px;
        }

        .content-grid.centered {
          display: flex;
          justify-content: center;
        }

        .content-grid.centered .main-content {
          width: 100%;
          max-width: 800px;
        }

        .centered-content {
          width: 100%;
          max-width: 800px;
        }

        /* Progress Bar */
        .progress-bar {
          margin-bottom: 2.5rem;
        }

        .steps {
          display: flex;
          list-style: none;
        }

        .step {
          position: relative;
          flex: 1;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .step-circle {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          z-index: 1;
        }

        .step.complete .step-circle {
          background-color: var(--primary-color);
          color: white;
        }

        .step.current .step-circle {
          border: 2px solid var(--primary-color);
          background-color: white;
        }

        .step.upcoming .step-circle {
          border: 2px solid var(--border-color);
          background-color: white;
        }

        .step-dot {
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          background-color: var(--primary-color);
        }

        .step.upcoming .step-dot {
          background-color: transparent;
        }

        .step-line {
          position: absolute;
          top: 1rem;
          left: 50%;
          width: 100%;
          height: 2px;
          background-color: var(--border-color);
          z-index: 0;
        }

        .step-line.complete {
          background-color: var(--primary-color);
        }

        .step-name {
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .step.complete .step-name {
          color: var(--primary-color);
        }

        .step.current .step-name {
          color: var(--primary-hover);
          font-weight: 600;
        }

        .step.upcoming .step-name {
          color: var(--text-muted);
        }

        /* Success Icon */
        .success-icon {
          text-align: center;
          margin-bottom: 2rem;
        }

        .check-circle {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          background-color: #d1f7dd;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .check {
          color: var(--success-color);
          font-size: 1.5rem;
          font-weight: bold;
        }

        /* Cards */
        .card {
          background-color: var(--card-bg);
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .card-header {
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary-hover);
          margin-bottom: 0.5rem;
        }

        .card-subtitle {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        /* Buttons */
        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 0.25rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--primary-hover);
        }

        .btn-outline {
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-color);
        }

        .btn-outline:hover {
          background-color: #f1f5f9;
        }

        .btn-block {
          display: block;
          width: 100%;
        }

        /* Invoice Button Styles */
        .btn-invoice {
          background: linear-gradient(135deg, #d09500 0%, #f4b942 100%);
          color: white;
          border: none;
          padding: 0.875rem 2rem;
          border-radius: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          box-shadow: 0 4px 12px rgba(208, 149, 0, 0.3);
          transition: all 0.3s ease;
          text-decoration: none;
          margin-right: 1rem;
        }

        .btn-invoice:hover {
          background: linear-gradient(135deg, #b8850a 0%, #e6a73b 100%);
          box-shadow: 0 6px 16px rgba(208, 149, 0, 0.4);
          transform: translateY(-2px);
        }

        .btn-invoice:active {
          transform: translateY(0);
          box-shadow: 0 2px 8px rgba(208, 149, 0, 0.3);
        }

        .btn-icon {
          font-size: 1.125rem;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
        }

        /* Confirmation Details */
        .confirmation-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .confirmation-wrapper .card {
          max-width: 800px;
          width: 100%;
        }

        .confirmation-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .detail-section {
          margin-bottom: 1rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .detail-label {
          font-weight: 500;
        }

        .important-info {
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
          padding: 1rem;
          background-color: #f9fafb;
        }

        .info-item {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .info-icon {
          color: var(--success-color);
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .confirmation-actions {
          margin-top: 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        @media (min-width: 640px) {
          .confirmation-actions {
            flex-direction: row;
            justify-content: center;
          }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .booking-process {
            padding: 2rem 1rem;
          }

          .title {
            font-size: 1.5rem;
          }

          .steps {
            flex-direction: column;
            gap: 1rem;
          }

          .step {
            display: flex;
            align-items: center;
          }

          .step-content {
            flex-direction: row;
            align-items: center;
            gap: 1rem;
          }

          .step-line {
            display: none;
          }
        }

        /* Utility Classes */
        hr {
          border: 0;
          height: 1px;
          background-color: var(--border-color);
          margin: 1rem 0;
        }
      `}</style>

      <div className="booking-process">
        <div className="container">
          <div className="header">
            <h1 className="title">Booking Confirmed!</h1>
            <p className="subtitle">
              Thank you for your reservation. Your booking has been successfully
              confirmed.
            </p>
          </div>

          {/* Booking Progress Bar */}
          <div className="progress-bar">
            <ol className="steps">
              {steps.map((step, stepIdx) => (
                <li key={step.id} className={`step ${step.status}`}>
                  <div className="step-content">
                    <span className="step-circle">
                      {step.status === "complete" ? (
                        <span className="icon">✓</span>
                      ) : (
                        <span className="step-dot"></span>
                      )}
                    </span>
                    {stepIdx !== steps.length - 1 && (
                      <span
                        className={`step-line ${step.status === "complete" ? "complete" : ""
                          }`}
                      ></span>
                    )}
                    <span className="step-name">{step.name}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="content-grid centered">
            {/* Success Confirmation */}
            <div className="confirmation-wrapper">
              <div className="card">
                <div className="success-icon">
                  <div className="check-circle">
                    <span className="check">✓</span>
                  </div>
                  <h2 className="card-title">Booking Confirmed!</h2>
                  <p className="card-subtitle">
                    Your reservation has been successfully processed.
                  </p>
                </div>

                <div className="confirmation-details">
                  <div className="detail-section">
                    <div className="detail-row">
                      <span className="detail-label">Booking ID:</span>
                      <span>
                        {bookingData?.bookingId || `BK-${Date.now()}`}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Payment Status:</span>
                      <div className="detail-row">
                        <span className="detail-value">
                          {paymentMethod === "Cash Payment"
                            ? "Pending (Pay On Check In)"
                            : "Complete"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="important-info">
                    <div className="info-item">
                      <span className="info-icon">✓</span>
                      <span>
                        A confirmation email has been sent to{" "}
                        {bookingData?.email}
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">✓</span>
                      <span>
                        Please save your booking ID for future reference
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">✓</span>
                      <span>
                        Check-in starts at 3:00 PM on your arrival date
                      </span>
                    </div>
                    {paymentMethod === "cash" && (
                      <div className="info-item">
                        <span className="info-icon">💵</span>
                        <span>
                          Payment will be collected upon check-in at the hotel
                          reception
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="confirmation-actions">
                  {/* <button
                    onClick={() => navigate("/invoice", { state: { bookingId: bookingData.bookingId } })}
                    className="btn-invoice"
                    disabled={!bookingData}
                  >
                    📄 See Invoice
                  </button> */}
                  <button
                    onClick={() => navigate("/")}
                    className="btn btn-outline"
                  >
                    Return to Home
                  </button>
                </div>
              </div>

              {/* Hidden Invoice Content for PDF Generation */}
              {bookingData && (
                <div
                  id="invoice-content"
                  style={{
                    position: "absolute",
                    left: "-9999px",
                    top: "-9999px",
                  }}
                >
                  <div
                    style={{
                      padding: "1.5rem",
                      backgroundColor: "white",
                      fontFamily:
                        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    }}
                  >
                    {/* Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "1rem",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "1rem",
                        }}
                      >
                        <div>
                          <h1
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: "700",
                              color: "#1f2937",
                              margin: "0 0 0.25rem 0",
                            }}
                          >
                            Golden Stay Hotel
                          </h1>
                          <p
                            style={{
                              fontSize: "1.125rem",
                              color: "#6b7280",
                              margin: "0",
                              fontWeight: "500",
                            }}
                          >
                            Hotels invoice
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          textAlign: "right",
                          fontSize: "0.875rem",
                          color: "#6b7280",
                          lineHeight: "1.6",
                        }}
                      >
                        <div style={{ fontWeight: "600", color: "#1f2937" }}>
                          Golden Stay
                        </div>
                        <div>123 Luxury Avenue</div>
                        <div>Jakarta, Indonesia</div>
                        <div>12345</div>
                        <div>Indonesia</div>
                      </div>
                    </div>

                    {/* Invoice Details */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr 1fr",
                        gap: "2rem",
                        marginBottom: "1rem",
                        alignItems: "flex-start",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#d09500",
                            marginBottom: "0.75rem",
                          }}
                        >
                          Billed To
                        </h3>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            lineHeight: "1.6",
                            color: "#374151",
                          }}
                        >
                          <div
                            style={{
                              fontWeight: "600",
                              marginBottom: "0.25rem",
                            }}
                          >
                            {bookingData.fullname}
                          </div>
                          <div style={{ marginBottom: "0.25rem" }}>
                            {bookingData.email}
                          </div>
                          <div style={{ marginBottom: "0.25rem" }}>
                            {bookingData.phoneNumber}
                          </div>
                          <div style={{ marginBottom: "0.25rem" }}>
                            {bookingData.address || "Address not provided"}
                          </div>
                          <div>{bookingData.region}</div>
                        </div>
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#d09500",
                            marginBottom: "0.75rem",
                          }}
                        >
                          Date of Issue
                        </h3>
                        <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                          {new Date().toLocaleDateString("en-GB")}
                        </div>
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#d09500",
                            marginBottom: "0.75rem",
                          }}
                        >
                          Invoice Number
                        </h3>
                        <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                          {generateInvoiceNumber().replace("INV-", "")}
                        </div>
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#d09500",
                            marginBottom: "0.75rem",
                          }}
                        >
                          Booking ID
                        </h3>
                        <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                          {bookingData.bookingId || `BK-${Date.now()}`}
                        </div>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div style={{ marginBottom: "1rem" }}>
                      <h3
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: "600",
                          color: "#d09500",
                          marginBottom: "0.75rem",
                        }}
                      >
                        Booking Details
                      </h3>
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "1rem",
                          fontSize: "0.875rem",
                          color: "#374151",
                        }}
                      >
                        <div>
                          <strong>Room Type:</strong> {bookingData.roomType}
                        </div>
                        <div>
                          <strong>Guests:</strong> {bookingData.adultGuests}{" "}
                          Adults, {bookingData.childGuests} Children
                        </div>
                        <div>
                          <strong>Check-in:</strong>{" "}
                          {new Date(bookingData.checkinDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </div>
                        <div>
                          <strong>Check-out:</strong>{" "}
                          {new Date(
                            bookingData.checkoutDate
                          ).toLocaleDateString("en-GB")}
                        </div>
                        <div>
                          <strong>Nights:</strong> {bookingData.nights}
                        </div>
                        <div>
                          <strong>Payment Method:</strong>{" "}
                          {bookingData.paymentMethod}
                        </div>
                      </div>
                    </div>

                    {/* Special Requests */}
                    {bookingData.specialRequest && (
                      <div style={{ marginBottom: "1rem" }}>
                        <h3
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "600",
                            color: "#d09500",
                            marginBottom: "0.75rem",
                          }}
                        >
                          Special Requests
                        </h3>
                        <div style={{ fontSize: "0.875rem", color: "#374151" }}>
                          {bookingData.specialRequest}
                        </div>
                      </div>
                    )}

                    {/* Invoice Table */}
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginBottom: "1rem",
                        fontSize: "0.875rem",
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f9fafb" }}>
                          <th
                            style={{
                              padding: "0.75rem",
                              textAlign: "left",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            Description
                          </th>
                          <th
                            style={{
                              padding: "0.75rem",
                              textAlign: "center",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            Nights
                          </th>
                          <th
                            style={{
                              padding: "0.75rem",
                              textAlign: "right",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            Rate/Night
                          </th>
                          <th
                            style={{
                              padding: "0.75rem",
                              textAlign: "right",
                              fontWeight: "600",
                              color: "#374151",
                              borderBottom: "1px solid #e5e7eb",
                            }}
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            style={{
                              padding: "0.75rem",
                              borderBottom: "1px solid #e5e7eb",
                              color: "#374151",
                            }}
                          >
                            {bookingData.roomType}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              textAlign: "center",
                              borderBottom: "1px solid #e5e7eb",
                              color: "#374151",
                            }}
                          >
                            {bookingData.nights}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              textAlign: "right",
                              borderBottom: "1px solid #e5e7eb",
                              color: "#374151",
                            }}
                          >
                            Rp{" "}
                            {bookingData.pricePerNight?.toLocaleString("id-ID")}
                          </td>
                          <td
                            style={{
                              padding: "0.75rem",
                              textAlign: "right",
                              borderBottom: "1px solid #e5e7eb",
                              color: "#374151",
                            }}
                          >
                            Rp{" "}
                            {bookingData.totalAmount?.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Total */}
                    <div style={{ textAlign: "right", marginBottom: "1rem" }}>
                      <div
                        style={{
                          fontSize: "1.125rem",
                          fontWeight: "700",
                          color: "#1f2937",
                          padding: "0.75rem",
                          backgroundColor: "#f9fafb",
                          borderRadius: "0.25rem",
                          display: "inline-block",
                          minWidth: "200px",
                        }}
                      >
                        Total: Rp{" "}
                        {bookingData.totalAmount?.toLocaleString("id-ID")}
                      </div>
                    </div>

                    {/* Footer */}
                    <div
                      style={{
                        borderTop: "1px solid #e5e7eb",
                        paddingTop: "1rem",
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        textAlign: "center",
                      }}
                    >
                      <p style={{ margin: "0 0 0.5rem 0" }}>
                        Thank you for choosing Golden Stay Hotel. We look
                        forward to welcoming you!
                      </p>
                      <p style={{ margin: "0" }}>
                        For any questions, please contact us at
                        booking@goldenstay.com or +62 812 3456 7890
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingFormThree;