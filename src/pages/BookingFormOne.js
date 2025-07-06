"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// Utility function to generate steps based on current step
const generateSteps = (currentStep) => {
  const stepDefinitions = [
    { id: 1, name: "Guest Info" },
    { id: 2, name: "Confirmation" },
    { id: 3, name: "Success" },
  ]

  return stepDefinitions.map((step) => ({
    ...step,
    status: step.id < currentStep ? "complete" : step.id === currentStep ? "current" : "upcoming",
  }))
}

const BookingFormOne = () => {
  const [phone, setPhone] = useState("")
  const [country, setCountry] = useState("indonesia")
  const [address, setAddress] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [isAutoFilledName, setIsAutoFilledName] = useState(false)
  const [isAutoFilledEmail, setIsAutoFilledEmail] = useState(false)
  const location = useLocation()
  const { bookingDetails = {} } = location.state || {}
  const navigate = useNavigate()
  const [roomData, setRoomData] = useState(null)

  useEffect(() => {
    const fetchRoom = async () => {
      if (!bookingDetails.roomId) return

      try {
        const res = await fetch(`https://localhost:7298/api/room/${bookingDetails.roomId}`)
        const data = await res.json()
        setRoomData(data)
      } catch (err) {
        console.error("Gagal mengambil data room:", err)
      }
    }

    fetchRoom()
  }, [bookingDetails.roomId])

  const calculateNights = () => {
    const checkIn = new Date(bookingDetails.checkinDate)
    const checkOut = new Date(bookingDetails.checkoutDate)
    if (isNaN(checkIn) || isNaN(checkOut)) return 0
    const diffTime = Math.abs(checkOut - checkIn)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()
  const pricePerNight = roomData?.price || 0
  const calculatedTotalPrice = pricePerNight * nights

  useEffect(() => {
    const storedName = localStorage.getItem("fullname")
    const storedEmail = localStorage.getItem("email")

    if (storedName) {
      setFullName(storedName)
      setIsAutoFilledName(true)
    }

    if (storedEmail) {
      setEmail(storedEmail)
      setIsAutoFilledEmail(true)
    }
  }, [])

  const handleContinue = (e) => {
    e.preventDefault()

    if (!fullName || !email || !phone || !address) {
      alert("Please fill in all required fields")
      return
    }

    const formData = {
      fullName,
      email,
      phone,
      country,
      address,
      specialRequests,
    }

    navigate("/bookingformtwo", {
      state: {
        bookingDetails,
        formData,
      },
    })
  }

  const steps = generateSteps(1) // Current step is 1

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

        .autofilled-input {
          background-color: #e0f0ff;
          border: 1px solid #007bff;
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

        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 2rem;
        }

        /* Sidebar */
        .summary-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-section {
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

        .detail-label {
          font-weight: 500;
        }

        .price-summary {
          background-color: var(--bg-color);
          border-radius: 0.25rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .price-summary .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .total {
          font-weight: 700;
          font-size: 1.125rem;
        }

        .total-price {
          color: var(--primary-color);
        }

        .benefits {
          margin-top: 0.5rem;
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
      `}</style>

      <div className="booking-process">
        <div className="container">
          <div className="header">
            <h1 className="title">Complete Your Booking</h1>
            <p className="subtitle">Please fill in your details to confirm your reservation</p>
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
                      <span className={`step-line ${step.status === "complete" ? "complete" : ""}`}></span>
                    )}
                    <span className="step-name">{step.name}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="content-grid">
            {/* Main Form Area */}
            <div className="main-content">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Guest Information</h2>
                  <p className="card-subtitle">Please provide your personal details</p>
                </div>
                <form onSubmit={handleContinue}>
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
                            setFullName(e.target.value)
                            setIsAutoFilledName(false)
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
                    <select id="country" value={country} onChange={(e) => setCountry(e.target.value)}>
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
                      required
                    ></textarea>
                  </div>

                  <div className="form-group">
                    <label htmlFor="specialRequests">Special Requests (Optional)</label>
                    <textarea
                      id="specialRequests"
                      value={specialRequests}
                      onChange={(e) => setSpecialRequests(e.target.value)}
                      placeholder="Any special requests or preferences?"
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="form-actions" style={{ display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="btn btn-primary">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Booking Summary Sidebar */}
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
                        {bookingDetails.adultGuests || 0} Adults, {bookingDetails.childGuests || 0} Children
                      </span>
                    </div>
                    <hr />
                  </div>

                  <div className="price-summary">
                    <div className="detail-row">
                      <span>
                        Rp {pricePerNight.toLocaleString("id-ID")} x {nights} night{nights !== 1 ? "s" : ""}
                      </span>
                      <span>Rp {calculatedTotalPrice.toLocaleString("id-ID")}</span>
                    </div>
                    <hr />
                    <div className="detail-row total">
                      <span>
                        <strong>Total</strong>
                      </span>
                      <span className="total-price">
                        <strong>Rp {calculatedTotalPrice.toLocaleString("id-ID")}</strong>
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
          </div>
        </div>
      </div>
    </>
  )
}

export default BookingFormOne
