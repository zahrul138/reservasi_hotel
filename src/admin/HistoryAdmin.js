"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import SidebarAdmin from "../components/SidebarAdmin";

const style = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', sans-serif",
  },
  main: {
    flex: 1,
    padding: "30px",
    backgroundColor: "#f5f2db",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
  },
  tableContainer: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#d0b375",
    padding: "14px",
    textAlign: "left",
    fontWeight: "bold",
    color: "#333",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    color: "#444",
  },
  actionBtn: {
    padding: "8px 16px",
    marginRight: "8px",
    cursor: "pointer",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  approveBtn: {
    backgroundColor: "#4caf50",
  },
  rejectBtn: {
    backgroundColor: "#f44336",
  },
  detailBtn: {
    backgroundColor: "#1976d2",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100vh",
    width: "100vw",
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    width: "700px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 8px 30px rgba(0,0,0,0.25)",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "10px",
    textAlign: "center",
    borderBottom: "2px solid #e0c68b",
    paddingBottom: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    fontSize: "15px",
    color: "#444",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "4px",
    color: "#555",
  },
  value: {
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  closeBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "transparent",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  badge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "12px",
    backgroundColor: "#ffc107",
    color: "#333",
  },
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  if (isNaN(date)) return "Invalid Date"

  const day = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })

  const time = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return `${day} at ${time}`
}

// Sample data for bookings with waiting-checkout status
const initialBookings = [
  {
    id: 1,
    guestName: "John Doe",
    guestPhone: "081234567890",
    guestEmail: "john@example.com",
    bookingDate: "2025-05-11T09:30:00Z",
    checkInDate: "2025-05-15T14:00:00Z",
    checkOutDate: "2025-05-18T12:00:00Z",
    guestAmount: "2 Adult, 1 Child",
    roomType: "Deluxe Room",
    roomNumber: "301",
    stayDuration: "3 Nights",
    totalPayment: "Rp3.200,000",
    specialRequest: "Sea view room",
    status: "waiting-checkout",
    checkInApprovedDate: "2025-05-15T14:30:00Z",
  },
  {
    id: 2,
    guestName: "Jane Smith",
    guestPhone: "082345678901",
    guestEmail: "jane@example.com",
    bookingDate: "2025-05-10T10:00:00Z",
    checkInDate: "2025-05-20T12:00:00Z",
    checkOutDate: "2025-05-22T10:00:00Z",
    guestAmount: "3 Adult",
    roomType: "Suite Room",
    roomNumber: "405",
    stayDuration: "2 Nights",
    totalPayment: "Rp3.000,000",
    specialRequest: "Late check-in",
    status: "waiting-checkout",
    checkInApprovedDate: "2025-05-20T12:45:00Z",
  },
  {
    id: 3,
    guestName: "Robert Johnson",
    guestPhone: "083456789012",
    guestEmail: "robert@example.com",
    bookingDate: "2025-05-12T11:15:00Z",
    checkInDate: "2025-05-16T15:00:00Z",
    checkOutDate: "2025-05-19T11:00:00Z",
    guestAmount: "1 Adult",
    roomType: "Standard Room",
    roomNumber: "205",
    stayDuration: "3 Nights",
    totalPayment: "Rp2.400,000",
    specialRequest: "Quiet room away from elevator",
    status: "waiting-checkout",
    checkInApprovedDate: "2025-05-16T15:20:00Z",
  },
]

const HistoryAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [hoveredItem, setHoveredItem] = useState(null)
  const [bookings, setBookings] = useState(initialBookings)
  const [selectedBooking, setSelectedBooking] = useState(null)

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev)

  const handleApprove = (id) => {
    // In a real application, this would make an API call to update the booking status
    setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: "checkout-approved" } : booking)))

    // Show success message
    alert(`Approved check-out for booking ID: ${id}`)

    // Close modal if it's open
    if (selectedBooking && selectedBooking.id === id) {
      setSelectedBooking(null)
    }
  }

  const handleReject = (id) => {
    // In a real application, this would make an API call to handle rejection
    alert(`Rejected check-out for booking ID: ${id}`)
    setSelectedBooking(null)
  }

  // Filter to only show bookings with waiting-checkout status
  const waitingCheckoutBookings = bookings.filter((booking) => booking.status === "waiting-checkout")

  return (
    <div style={style.container}>
      <SidebarAdmin
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />
      <main style={style.main}>
        <h1 style={style.title}>History Booking</h1>
        <div style={style.tableContainer}>
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.th}>No</th>
                <th style={style.th}>Name</th>
                <th style={style.th}>Room</th>
                <th style={style.th}>Check-in Date</th>
                <th style={style.th}>Check-out Date</th>

                <th style={style.th}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {waitingCheckoutBookings.length > 0 ? (
                waitingCheckoutBookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td style={style.td}>{index + 1}</td>
                    <td style={style.td}>{booking.guestName}</td>
                    <td style={style.td}>{`${booking.roomType} (${booking.roomNumber})`}</td>
                    <td style={style.td}>{formatDate(booking.checkInDate)}</td>
                    <td style={style.td}>{formatDate(booking.checkOutDate)}</td>
                   
                    <td style={style.td}>
                      <button
                        style={{ ...style.actionBtn, ...style.detailBtn }}
                        onClick={() => setSelectedBooking(booking)}
                      >
                        More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ ...style.td, textAlign: "center", padding: "30px" }}>
                    No guests waiting for check-out approval
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedBooking && (
          <div style={style.modalOverlay}>
            <div style={style.modal}>
              <button onClick={() => setSelectedBooking(null)} style={style.closeBtn}>
                ✖
              </button>
              <div style={style.heading}>Booking Details</div>
              <div style={style.grid}>
                <div style={style.field}>
                  <span style={style.label}>Guest Name</span>
                  <span style={style.value}>{selectedBooking.guestName}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Phone</span>
                  <span style={style.value}>{selectedBooking.guestPhone}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Email</span>
                  <span style={style.value}>{selectedBooking.guestEmail}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Room</span>
                  <span style={style.value}>{`${selectedBooking.roomType} (${selectedBooking.roomNumber})`}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Check-in Date</span>
                  <span style={style.value}>{formatDate(selectedBooking.checkInDate)}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Check-out Date</span>
                  <span style={style.value}>{formatDate(selectedBooking.checkOutDate)}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Guest</span>
                  <span style={style.value}>{selectedBooking.guestAmount}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Stay Duration</span>
                  <span style={style.value}>{selectedBooking.stayDuration}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Total Payment</span>
                  <span style={style.value}>{selectedBooking.totalPayment}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Check-in Approved</span>
                  <span style={style.value}>{formatDate(selectedBooking.checkInApprovedDate)}</span>
                </div>
                <div style={{ ...style.field, gridColumn: "span 2" }}>
                  <span style={style.label}>Special Request</span>
                  <span style={style.value}>{selectedBooking.specialRequest}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default HistoryAdmin
