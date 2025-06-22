import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";

const BookingForm = () => {
  const [formStep, setFormStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("indonesia");
  const [address, setAddress] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [isAutoFilledName, setIsAutoFilledName] = useState(false);
  const [isAutoFilledEmail, setIsAutoFilledEmail] = useState(false);

  const location = useLocation();
  const { bookingDetails = {} } = location.state || {};

  useEffect(() => {
    const storedName = localStorage.getItem("fullname") || "";
    const storedEmail = localStorage.getItem("email") || "";
    setFullName(storedName);
    setEmail(storedEmail);
  }, []);

  useEffect(() => {
    const storedName = localStorage.getItem("fullname");
    const storedEmail = localStorage.getItem("email");

    if (storedName) {
      setFullName(storedName);
      setIsAutoFilledName(true);
    }

    if (storedEmail) {
      setEmail(storedEmail);
      setIsAutoFilledEmail(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const response = await fetch("https://localhost:7298/api/Booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: bookingDetails.userId,
          fullname: fullName,
          email: email,
          checkinDate: bookingDetails.checkinDate,
          checkoutDate: bookingDetails.checkoutDate,
          roomType: bookingDetails.roomType,
          adultGuests: bookingDetails.adultGuests,
          childGuests: bookingDetails.childGuests,
          specialRequest: specialRequests,
          totalPrice: bookingDetails.totalPrice,
          phoneNumber: phone,
          region: country,
          address: address,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (
          errorData.message &&
          errorData.message.includes("Pesanan dengan data yang sama")
        ) {
          alert("Pesanan dengan data yang sama sudah pernah dibuat.");
        } else {
          alert("Gagal menyimpan booking: " + JSON.stringify(errorData));
        }
        return;
      }

      setFormStep(2);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Terjadi kesalahan saat memproses booking.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCountryName = (countryCode) => {
    const countries = {
      indonesia: "Indonesia",
      singapore: "Singapore",
      malaysia: "Malaysia",
      thailand: "Thailand",
      philippines: "Philippines",
      other: "Other",
    };
    return countries[countryCode] || countryCode;
  };

  const steps = [
    { id: 1, name: "Guest Info", status: formStep > 1 ? "complete" : "current" },
    { id: 2, name: "Confirmation", status: formStep === 2 ? "current" : "upcoming" },
  ];




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

        /* Grid Layout */
        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
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

        /* Form Elements */
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        input[type="text"],
        input[type="email"],
        input[type="tel"],
        input[type="password"],
        select,
        textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
          font-size: 1rem;
          font-family: inherit;
        }

        input:focus,
        select:focus,
        textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(208, 149, 0, 0.15);
        }

        textarea {
          resize: vertical;
          min-height: 100px;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
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

        .btn-with-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }

        /* Payment Methods */
        .payment-methods {
          margin-bottom: 1.5rem;
        }

        .payment-method {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.75rem;
          border-radius: 0.25rem;
          cursor: pointer;
        }

        .payment-method:hover {
          background-color: #f1f5f9;
        }

        .payment-method input {
          margin-right: 0.75rem;
        }

        .payment-method label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0;
          cursor: pointer;
        }

        .payment-icon {
          font-size: 1.25rem;
        }

        .payment-details {
          background-color: #f9fafb;
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .payment-info {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .paypal-logo {
          display: flex;
          justify-content: center;
          margin: 1.5rem 0;
        }

        .paypal-placeholder {
          background-color: #0070ba;
          color: white;
          padding: 1rem 2rem;
          border-radius: 0.25rem;
          font-weight: bold;
        }

        .bank-details {
          margin: 1rem 0;
        }

        .detail-label {
          font-weight: 500;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .terms-checkbox input {
          margin-top: 0.25rem;
        }

        .terms-checkbox label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .link {
          color: var(--primary-color);
          text-decoration: none;
        }

        .link:hover {
          text-decoration: underline;
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
          margin-bottom: 1.5rem;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--primary-hover);
          margin-bottom: 1rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .detail-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-icon {
          font-size: 1rem;
          color: var(--primary-color);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          margin-bottom: 1rem;
        }

        .detail-value {
          margin-top: 0.25rem;
          padding-left: 1.5rem;
        }

        .payment-method-display {
          margin-bottom: 1rem;
        }

        .payment-details-display {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .payment-note {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .price-summary {
          background-color: var(--bg-color);
          border-radius: 0.25rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .total {
          font-weight: 700;
          font-size: 1.125rem;
        }

        .total-price {
          color: var(--primary-color);
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
        }

        .confirmation-note {
          margin-top: 1rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        /* Sidebar */
        .summary-content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .benefits {
          margin-top: 1rem;
        }

        .benefit-item {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .benefit-icon {
          color: var(--success-color);
          flex-shrink: 0;
        }

        .assistance-card {
          background-color: var(--card-bg);
          border-radius: 0.5rem;
          border: 1px solid var(--border-color);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .assistance-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--primary-hover);
          margin-bottom: 0.75rem;
        }

        .assistance-text {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        .contact-info {
          margin-top: 1rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .contact-icon {
          color: var(--primary-color);
        }

        .return-home {
          text-align: center;
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

          .form-row {
            grid-template-columns: 1fr;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .form-actions button {
            width: 100%;
          }
        }

        /* Utility Classes */
        hr {
          border: 0;
          height: 1px;
          background-color: var(--border-color);
          margin: 1rem 0;
        }
          .autofilled-input {
          background-color: #e0f0ff; /* biru muda */
          border: 1px solid #007bff;
        }
      `}</style>

      <div className="booking-process">
        <div className="container">
          <div className="header">
            <h1 className="title">
              {formStep < 3 ? "Complete Your Booking" : "Booking Confirmed!"}
            </h1>
            <p className="subtitle">
              {formStep < 3
                ? "Please fill in your details to confirm your reservation"
                : "Thank you for your reservation. Your booking has been successfully confirmed."}
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

          <div className={`content-grid ${formStep !== 1 ? "centered" : ""}`}>
            {/* Main Form Area */}
            <div className="main-content centered-content">
              {/* Guest Information Form */}
              {formStep === 1 && (
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Guest Information</h2>
                    <p className="card-subtitle">
                      Please provide your personal details
                    </p>
                  </div>
                  <form>
                    <div className="form-row">
                      <div className="form-group" style={{ width: "100%" }}>
                        <label htmlFor="fullName">Full Name</label>
                        <div className="input-with-icon">
                          <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            readOnly
                            onChange={(e) => {
                              setFullName(e.target.value);
                              setIsAutoFilledName(false);
                            }}
                            placeholder="Enter your full name"
                            required
                            className={isAutoFilledName ? "autofilled-input" : ""}
                          />
                          <span className="input-icon">👤</span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email Address</label>
                      <div className="input-with-icon">
                        <input
                          id="email"
                          type="email"
                          value={email}
                          readOnly

                          placeholder="Enter your email address"
                          required
                          className={isAutoFilledEmail ? "autofilled-input" : ""}
                        />
                        <span className="input-icon">📧</span>
                      </div>
                    </div>


                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <div className="input-with-icon">
                        <input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Enter your phone number"
                          required
                        />
                        <span className="input-icon">📱</span>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="country">Country/Region</label>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      >
                        <option value="indonesia">Indonesia</option>
                        <option value="singapore">Singapore</option>
                        <option value="malaysia">Malaysia</option>
                        <option value="thailand">Thailand</option>
                        <option value="philippines">Philippines</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="address">Address</label>
                      <textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="form-group">
                      <label htmlFor="specialRequests">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        id="specialRequests"
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Any special requests or preferences?"
                        rows="3"
                      ></textarea>
                    </div>

                    <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end" }}>
                      <button
                        type="button"
                        onClick={() => setFormStep(2)}
                        className="btn btn-primary"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Confirmation Details */}
              {formStep === 2 && (
                <div className="confirmation-wrapper">
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">Booking Details</h2>
                      <p className="card-subtitle">
                        Booking ID: {bookingDetails.bookingId}
                      </p>
                    </div>

                    <div className="confirmation-details">
                      {/* Room Details */}
                      <div className="detail-section">
                        <div className="detail-row">
                          <span className="detail-label">Room Type:</span>
                          <span>{bookingDetails.roomType}</span>
                        </div>
                        <hr />
                        <div className="detail-row">
                          <div className="detail-with-icon">
                            <span className="detail-icon">📅</span>
                            <span>Check-in:</span>
                          </div>
                          <span>
                            {bookingDetails.checkinDate
                              ? new Date(bookingDetails.checkinDate).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                              : "-"}
                          </span>
                        </div>
                        <div className="detail-row">
                          <div className="detail-with-icon">
                            <span className="detail-icon">📅</span>
                            <span>Check-out:</span>
                          </div>
                          <span>
                            {bookingDetails.checkoutDate
                              ? new Date(bookingDetails.checkoutDate).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                              : "-"}
                          </span>
                        </div>
                        <div className="detail-row">
                          <div className="detail-with-icon">
                            <span className="detail-icon">👤</span>
                            <span>Guests:</span>
                          </div>
                          <span>
                            {bookingDetails.adultGuests || 0} Adults,{" "}
                            {bookingDetails.childGuests || 0} Children
                          </span>
                        </div>
                        <hr />
                      </div>

                      {/* Guest Information */}
                      <div className="detail-section">
                        <h3 className="section-title">Guest Information</h3>
                        <div className="detail-grid">
                          <div className="detail-item">
                            <div className="detail-with-icon">
                              <span className="detail-icon">👤</span>
                              <span className="detail-label">Full Name:</span>
                            </div>
                            <p className="detail-value">{fullName}</p>
                          </div>
                          <div className="detail-item">
                            <div className="detail-with-icon">
                              <span className="detail-icon">📧</span>
                              <span className="detail-label">Email:</span>
                            </div>
                            <p className="detail-value">{email}</p>
                          </div>
                          <div className="detail-item">
                            <div className="detail-with-icon">
                              <span className="detail-icon">📱</span>
                              <span className="detail-label">Phone:</span>
                            </div>
                            <p className="detail-value">{phone}</p>
                          </div>
                          <div className="detail-item">
                            <div className="detail-with-icon">
                              <span className="detail-icon">🌐</span>
                              <span className="detail-label">Country:</span>
                            </div>
                            <p className="detail-value">
                              {formatCountryName(country)}
                            </p>
                          </div>
                        </div>

                        <div className="detail-item">
                          <div className="detail-with-icon">
                            <span className="detail-icon">📍</span>
                            <span className="detail-label">Address:</span>
                          </div>
                          <p className="detail-value">
                            {address || "Not provided"}
                          </p>
                        </div>

                        {specialRequests && (
                          <div className="detail-item">
                            <div className="detail-with-icon">
                              <span className="detail-icon">✓</span>
                              <span className="detail-label">
                                Special Requests:
                              </span>
                            </div>
                            <p className="detail-value">{specialRequests}</p>
                          </div>
                        )}

                        <hr />
                      </div>

                      {/* Price Summary */}
                      <div className="price-summary">
                        <div className="detail-row">
                          <span>Room Rate:</span>
                          <span>
                            ${bookingDetails.pricePerNight} ×{" "}
                            {bookingDetails.nights} nights
                          </span>
                        </div>
                        <div className="detail-row">
                          <span>Taxes & Fees:</span>
                          <span>${bookingDetails.taxes}</span>
                        </div>
                        <hr />
                        <div className="detail-row total">
                          <span>Total Paid:</span>
                          <span className="total-price">
                            ${bookingDetails.total}
                          </span>
                        </div>
                      </div>

                      <div className="important-info">
                        <h3 className="section-title">Important Information</h3>
                        <div className="info-item">
                          <span className="info-icon">✓</span>
                          <span>
                            Check-in time starts at 3:00 PM. If you plan to arrive
                            after 6:00 PM, please notify the hotel.
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-icon">✓</span>
                          <span>
                            Check-out time is 12:00 PM. Late check-out may result
                            in an additional charge.
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-icon">✓</span>
                          <span>
                            Please present a valid ID and the credit card used for
                            booking upon check-in.
                          </span>
                        </div>
                        <div className="info-item">
                          <span className="info-icon">✓</span>
                          <span>
                            Free cancellation is available up to 48 hours before
                            check-in.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="terms-checkbox">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        required
                      />
                      <label htmlFor="terms">
                        I agree to the{" "}
                        <a href="#" className="link">
                          terms and conditions
                        </a>{" "}
                        and{" "}
                        <a href="#" className="link">
                          privacy policy
                        </a>
                      </label>
                    </div>

                  </div>
                </div>
              )}
            </div>

            {/* Booking Summary Sidebar */}
            {formStep === 1 && (
              <div className="sidebar">
                <div className="card">
                  <h2 className="card-title">Booking Summary</h2>
                  <div className="summary-content">
                    <div className="detail-section">
                      <div className="detail-row">
                        <span className="detail-label">Room Type:</span>
                        <span>{bookingDetails.roomType || "-"}</span>
                      </div>
                      <hr />
                      <div className="detail-row">
                        <div className="detail-with-icon">
                          <span className="detail-icon">📅</span>
                          <span>Check-in:</span>
                        </div>
                        <span>
                          {bookingDetails.checkinDate
                            ? new Date(bookingDetails.checkinDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                            : "-"}
                        </span>
                      </div>
                      <div className="detail-row">
                        <div className="detail-with-icon">
                          <span className="detail-icon">📅</span>
                          <span>Check-out:</span>
                        </div>
                        <span>
                          {bookingDetails.checkoutDate
                            ? new Date(bookingDetails.checkoutDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                            : "-"}
                        </span>
                      </div>
                      <div className="detail-row">
                        <div className="detail-with-icon">
                          <span className="detail-icon">👤</span>
                          <span>Guests:</span>
                        </div>
                        <span>
                          {bookingDetails.adultGuests || 0} Adults,{" "}
                          {bookingDetails.childGuests || 0} Children
                        </span>
                      </div>
                      <hr />
                    </div>

                    <div className="price-summary">
                      <div className="detail-row">
                        <span>Total Price:</span>
                        <span className="total-price">
                          ${bookingDetails.totalPrice || 0}
                        </span>
                      </div>
                    </div>

                    <div className="benefits">
                      <div className="benefit-item">
                        <span className="benefit-icon">✓</span>
                        <span>Free cancellation before 48 hours of check-in</span>
                      </div>
                      <div className="benefit-item">
                        <span className="benefit-icon">✓</span>
                        <span>No payment needed today</span>
                      </div>
                      <div className="benefit-item">
                        <span className="benefit-icon">✓</span>
                        <span>Secure payment process</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="assistance-card">
                  <h3 className="assistance-title">Need Assistance?</h3>
                  <p className="assistance-text">
                    Our customer service team is available 24/7 to help with your booking.
                  </p>
                  <div className="contact-info">
                    <div className="contact-item">
                      <span className="contact-icon">📱</span>
                      <span>+62 812 3456 7890</span>
                    </div>
                    <div className="contact-item">
                      <span className="contact-icon">📧</span>
                      <span>booking@goldenstay.com</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingForm;
