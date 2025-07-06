"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"

const HistoryPage = () => {
  // Add dummy data at the top of the component
  const dummyBookings = [
    {
      bookingId: "BK-20241201-001",
      fullname: "John Doe",
      email: "john.doe@email.com",
      phoneNumber: "+62 812 3456 7890",
      region: "Indonesia",
      address: "Jl. Sudirman No. 123, Jakarta",
      roomType: "Deluxe Ocean View Suite",
      checkinDate: "2024-12-15",
      checkoutDate: "2024-12-18",
      adultGuests: 2,
      childGuests: 1,
      specialRequest: "Late check-in requested, arriving around 10 PM. Please prepare extra towels.",
      totalPrice: 2400000,
      paymentMethod: "cash",
      paymentStatus: "pending",
      createdAt: "2024-12-01T10:30:00Z",
    },
    {
      bookingId: "BK-20241125-002",
      fullname: "Jane Smith",
      email: "jane.smith@email.com",
      phoneNumber: "+62 813 9876 5432",
      region: "Singapore",
      address: "Marina Bay Street 45, Singapore",
      roomType: "Executive Business Suite",
      checkinDate: "2024-12-05",
      checkoutDate: "2024-12-08",
      adultGuests: 1,
      childGuests: 0,
      specialRequest: "Need workspace setup for business meetings",
      totalPrice: 3600000,
      paymentMethod: "midtransfer",
      paymentStatus: "paid",
      createdAt: "2024-11-25T14:20:00Z",
    },
    {
      bookingId: "BK-20241110-003",
      fullname: "Michael Johnson",
      email: "michael.j@email.com",
      phoneNumber: "+62 814 1122 3344",
      region: "Malaysia",
      address: "KLCC Area, Kuala Lumpur",
      roomType: "Standard Twin Room",
      checkinDate: "2024-11-20",
      checkoutDate: "2024-11-23",
      adultGuests: 2,
      childGuests: 0,
      specialRequest: null,
      totalPrice: 1800000,
      paymentMethod: "midtransfer",
      paymentStatus: "paid",
      createdAt: "2024-11-10T09:15:00Z",
    },
    {
      bookingId: "BK-20241020-004",
      fullname: "Sarah Wilson",
      email: "sarah.wilson@email.com",
      phoneNumber: "+62 815 5566 7788",
      region: "Indonesia",
      address: "Bali, Ubud Center",
      roomType: "Luxury Presidential Suite",
      checkinDate: "2024-10-25",
      checkoutDate: "2024-10-30",
      adultGuests: 2,
      childGuests: 2,
      specialRequest: "Honeymoon package with romantic dinner setup",
      totalPrice: 7500000,
      paymentMethod: "cash",
      paymentStatus: "paid",
      createdAt: "2024-10-20T16:45:00Z",
    },
    {
      bookingId: "BK-20240915-005",
      fullname: "David Brown",
      email: "david.brown@email.com",
      phoneNumber: "+62 816 9988 7766",
      region: "Thailand",
      address: "Bangkok Central District",
      roomType: "Family Connecting Rooms",
      checkinDate: "2024-09-20",
      checkoutDate: "2024-09-25",
      adultGuests: 4,
      childGuests: 3,
      specialRequest: "Need baby crib and high chair for toddler",
      totalPrice: 4200000,
      paymentMethod: "midtransfer",
      paymentStatus: "cancelled",
      createdAt: "2024-09-15T11:30:00Z",
    },
    {
      bookingId: "BK-20240801-006",
      fullname: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      phoneNumber: "+62 817 3344 5566",
      region: "Indonesia",
      address: "Bandung, West Java",
      roomType: "Garden View Deluxe",
      checkinDate: "2024-08-10",
      checkoutDate: "2024-08-14",
      adultGuests: 1,
      childGuests: 1,
      specialRequest: "Vegetarian meals for all dining",
      totalPrice: 2800000,
      paymentMethod: "cash",
      paymentStatus: "paid",
      createdAt: "2024-08-01T13:20:00Z",
    },
  ]
  const [bookings, setBookings] = useState(dummyBookings) // Initialize with dummy data immediately
  const [isLoading, setIsLoading] = useState(false) // Start with false so data shows immediately
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all") // all, upcoming, past, cancelled
  const [sortBy, setSortBy] = useState("newest") // newest, oldest, checkin
  const navigate = useNavigate()

  // Also update the user info to use dummy data
  // Replace the localStorage calls at the top with:
  const userId = "user123" // Always show dummy data
  const userEmail = "john.doe@email.com"
  const userName = "John Doe"

  // Replace the fetchBookingHistory function with this:
  const fetchBookingHistory = async () => {
    setBookings(dummyBookings)
  }

  const getBookingStatus = (booking) => {
    const today = new Date()
    const checkinDate = new Date(booking.checkinDate)
    const checkoutDate = new Date(booking.checkoutDate)

    if (booking.paymentStatus === "cancelled") return "cancelled"
    if (today < checkinDate) return "upcoming"
    if (today >= checkinDate && today <= checkoutDate) return "active"
    return "completed"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "#2563eb"
      case "active":
        return "#059669"
      case "completed":
        return "#6b7280"
      case "cancelled":
        return "#dc2626"
      default:
        return "#6b7280"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "upcoming":
        return "Upcoming"
      case "active":
        return "Active"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return "Unknown"
    }
  }

  const filteredAndSortedBookings = () => {
    let filtered = bookings

    // Apply filter
    if (filter !== "all") {
      filtered = bookings.filter((booking) => getBookingStatus(booking) === filter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || b.checkinDate) - new Date(a.createdAt || a.checkinDate)
        case "oldest":
          return new Date(a.createdAt || a.checkinDate) - new Date(b.createdAt || b.checkinDate)
        case "checkin":
          return new Date(a.checkinDate) - new Date(b.checkinDate)
        default:
          return 0
      }
    })

    return filtered
  }

  const generateInvoice = (booking) => {
    // Store booking data for invoice generation
    const invoiceData = {
      ...booking,
      fullname: booking.fullname || userName,
      email: booking.email || userEmail,
      phoneNumber: booking.phoneNumber,
      region: booking.region,
      address: booking.address,
      totalAmount: booking.totalPrice,
      pricePerNight: booking.totalPrice / calculateNights(booking.checkinDate, booking.checkoutDate),
      nights: calculateNights(booking.checkinDate, booking.checkoutDate),
    }

    localStorage.setItem("invoiceData", JSON.stringify(invoiceData))
    window.open("/invoice", "_blank")
  }

  const calculateNights = (checkinDate, checkoutDate) => {
    const checkIn = new Date(checkinDate)
    const checkOut = new Date(checkoutDate)
    const diffTime = Math.abs(checkOut - checkIn)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return `Rp ${amount.toLocaleString("id-ID")}`
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
          --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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

        .history-page {
          min-height: 100vh;
          background-color: var(--bg-color);
          padding: 2rem 1rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 2rem;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-hover);
        }

        .back-btn {
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background-color: #f1f5f9;
        }

        .subtitle {
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }

        .user-info {
          background-color: var(--card-bg);
          padding: 1rem 1.5rem;
          border-radius: 0.5rem;
          border-left: 4px solid var(--primary-color);
          margin-bottom: 2rem;
        }

        .user-name {
          font-weight: 600;
          color: var(--text-color);
        }

        .user-email {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: center;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-label {
          font-weight: 500;
          color: var(--text-color);
          font-size: 0.875rem;
        }

        .filter-select {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
          background-color: white;
          color: var(--text-color);
          font-size: 0.875rem;
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(208, 149, 0, 0.15);
        }

        .stats {
          display: flex;
          gap: 1rem;
          margin-left: auto;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          color: var(--text-muted);
        }

        .error {
          background-color: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 0.5rem;
          text-align: center;
          margin-bottom: 2rem;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 1rem;
          color: var(--text-muted);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-color);
        }

        .empty-text {
          margin-bottom: 2rem;
        }

        .btn-primary {
          background-color: var(--primary-color);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.25rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: all 0.2s ease;
        }

        .btn-primary:hover {
          background-color: var(--primary-hover);
        }

        .bookings-grid {
          display: grid;
          gap: 1.5rem;
        }

        .booking-card {
          background-color: var(--card-bg);
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .booking-card:hover {
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }

        .booking-header {
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .booking-header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .booking-id {
          font-weight: 600;
          color: var(--text-color);
          font-size: 1.125rem;
        }

        .booking-status {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .room-type {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary-hover);
          margin-bottom: 0.5rem;
        }

        .booking-dates {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .date-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .booking-body {
          padding: 1.5rem;
        }

        .booking-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .detail-label {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        .detail-value {
          font-weight: 500;
          color: var(--text-color);
        }

        .price-highlight {
          color: var(--primary-color);
          font-weight: 700;
          font-size: 1.125rem;
        }

        .booking-actions {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .btn-secondary {
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          font-weight: 500;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .btn-secondary:hover {
          background-color: #f1f5f9;
        }

        .btn-invoice {
          background: linear-gradient(135deg, #d09500 0%, #f4b942 100%);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          font-weight: 500;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          box-shadow: 0 2px 4px rgba(208, 149, 0, 0.2);
          transition: all 0.2s ease;
        }

        .btn-invoice:hover {
          background: linear-gradient(135deg, #b8850a 0%, #e6a73b 100%);
          box-shadow: 0 4px 8px rgba(208, 149, 0, 0.3);
          transform: translateY(-1px);
        }

        .payment-status {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
        }

        .payment-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .payment-pending {
          background-color: #f59e0b;
        }

        .payment-paid {
          background-color: #10b981;
        }

        .payment-cancelled {
          background-color: #ef4444;
        }

        @media (max-width: 768px) {
          .history-page {
            padding: 1rem;
          }

          .header-top {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .controls {
            flex-direction: column;
            align-items: stretch;
          }

          .stats {
            margin-left: 0;
            justify-content: center;
          }

          .booking-details {
            grid-template-columns: 1fr;
          }

          .booking-actions {
            flex-direction: column;
          }

          .booking-dates {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>

      <div className="history-page">
        <div className="container">
          <div className="header">
            <div className="header-top">
              <h1 className="title">Booking History</h1>
              <button onClick={() => navigate("/")} className="back-btn">
                ← Back to Home
              </button>
            </div>
            <p className="subtitle">View and manage all your hotel reservations</p>

            {userName && (
              <div className="user-info">
                <div className="user-name">Welcome back, {userName}!</div>
                <div className="user-email">{userEmail}</div>
              </div>
            )}
          </div>

          <div className="controls">
            <div className="filter-group">
              <label className="filter-label">Filter:</label>
              <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All Bookings</option>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">Sort by:</label>
              <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="checkin">Check-in Date</option>
              </select>
            </div>

            <div className="stats">
              <div className="stat-item">
                <div className="stat-number">{bookings.length}</div>
                <div className="stat-label">Total</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{bookings.filter((b) => getBookingStatus(b) === "upcoming").length}</div>
                <div className="stat-label">Upcoming</div>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="loading">
              <div>Loading your booking history...</div>
            </div>
          )}

          {error && (
            <div className="error">
              {error}
              <button
                onClick={fetchBookingHistory}
                style={{
                  marginLeft: "1rem",
                  background: "none",
                  border: "none",
                  color: "inherit",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
            </div>
          )}

          {!isLoading && !error && bookings.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">🏨</div>
              <h3 className="empty-title">No Bookings Yet</h3>
              <p className="empty-text">You haven't made any hotel reservations yet. Start exploring our rooms!</p>
              <a href="/" className="btn-primary">
                Browse Rooms
              </a>
            </div>
          )}

          {!isLoading && !error && filteredAndSortedBookings().length === 0 && bookings.length > 0 && (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">No Bookings Found</h3>
              <p className="empty-text">No bookings match your current filter criteria.</p>
            </div>
          )}

          {!isLoading && !error && filteredAndSortedBookings().length > 0 && (
            <div className="bookings-grid">
              {filteredAndSortedBookings().map((booking) => {
                const status = getBookingStatus(booking)
                const nights = calculateNights(booking.checkinDate, booking.checkoutDate)

                return (
                  <div key={booking.bookingId} className="booking-card">
                    <div className="booking-header">
                      <div className="booking-header-top">
                        <div className="booking-id">#{booking.bookingId}</div>
                        <div
                          className="booking-status"
                          style={{
                            backgroundColor: getStatusColor(status) + "20",
                            color: getStatusColor(status),
                          }}
                        >
                          {getStatusText(status)}
                        </div>
                      </div>
                      <div className="room-type">{booking.roomType}</div>
                      <div className="booking-dates">
                        <div className="date-item">
                          <span>📅</span>
                          <span>Check-in: {formatDate(booking.checkinDate)}</span>
                        </div>
                        <div className="date-item">
                          <span>📅</span>
                          <span>Check-out: {formatDate(booking.checkoutDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="booking-body">
                      <div className="booking-details">
                        <div className="detail-item">
                          <span className="detail-label">Guests:</span>
                          <span className="detail-value">
                            {booking.adultGuests} Adults, {booking.childGuests} Children
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Nights:</span>
                          <span className="detail-value">
                            {nights} night{nights !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Total Amount:</span>
                          <span className="detail-value price-highlight">{formatCurrency(booking.totalPrice)}</span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Payment:</span>
                          <span className="payment-status">
                            <span className={`payment-indicator payment-${booking.paymentStatus}`}></span>
                            {booking.paymentMethod === "cash" ? "Cash on Check-in" : "Online Payment"}
                          </span>
                        </div>
                      </div>

                      {booking.specialRequest && (
                        <div
                          style={{
                            marginBottom: "1rem",
                            padding: "0.75rem",
                            backgroundColor: "#f9fafb",
                            borderRadius: "0.25rem",
                          }}
                        >
                          <div style={{ fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem" }}>
                            Special Requests:
                          </div>
                          <div style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                            {booking.specialRequest}
                          </div>
                        </div>
                      )}

                      <div className="booking-actions">
                        <button onClick={() => generateInvoice(booking)} className="btn-invoice">
                          📄 View Invoice
                        </button>

                        {status === "upcoming" && <button className="btn-secondary">✏️ Modify Booking</button>}

                        {(status === "upcoming" || status === "active") && (
                          <button className="btn-secondary">📞 Contact Hotel</button>
                        )}

                        {status === "completed" && <button className="btn-secondary">⭐ Leave Review</button>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default HistoryPage
