import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
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
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return "Invalid Date";

  const day = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const time = date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return `${day} at ${time}`;
};

const initialBookings = [
  {
    id: 1,
    guestName: "John Doe",
    guestPhone: "081234567890",
    guestEmail: "john@example.com",
    bookingDate: "2025-05-11T09:30:00Z",
    checkInDate: "2025-05-15T14:00:00Z",
    guestAmount: "2 Adult, 1 Child",
    roomType: "Deluxe Room",
    stayDuration: "3 Nights",
    totalPayment: "Rp3.200,000",
    specialRequest: "Sea view room",
  },
  {
    id: 2,
    guestName: "Jane Smith",
    guestPhone: "082345678901",
    guestEmail: "jane@example.com",
    bookingDate: "2025-05-10T10:00:00Z",
    checkInDate: "2025-05-20T12:00:00Z",
    guestAmount: "3 Adult",
    roomType: "Suite Room",
    stayDuration: "2 Nights",
    totalPayment: "Rp3.000,000",
    specialRequest: "Late check-in",
  },
];

const CheckInAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [bookings] = useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const handleApprove = (id) => {
    alert(`Approved booking ID: ${id}`);
    setSelectedBooking(null);
  };

  const handleReject = (id) => {
    alert(`Rejected booking ID: ${id}`);
    setSelectedBooking(null);
  };

  return (
    <div style={style.container}>
      <SidebarAdmin
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />
      <main style={style.main}>
        <h1 style={style.title}>Check In Approval</h1>
        <div style={style.tableContainer}>
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.th}>No</th>
                <th style={style.th}>Name</th>
                <th style={style.th}>Booking Date</th>
                <th style={style.th}>Room Type</th>
                <th style={style.th}>Check-in Date</th>
                <th style={style.th}>Guest</th>
                <th style={style.th}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={booking.id}>
                  <td style={style.td}>{index + 1}</td>
                  <td style={style.td}>{booking.guestName}</td>
                  <td style={style.td}>{formatDate(booking.bookingDate)}</td>
                  <td style={style.td}>{booking.roomType}</td>
                  <td style={style.td}>{formatDate(booking.checkInDate)}</td>
                  <td style={style.td}>{booking.guestAmount}</td>
                  
                  <td style={style.td}>
                    <button
                      style={{ ...style.actionBtn, ...style.detailBtn }}
                      onClick={() => setSelectedBooking(booking)}
                    >
                      More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedBooking && (
          <div style={style.modalOverlay}>
            <div style={style.modal}>
              <button onClick={() => setSelectedBooking(null)} style={style.closeBtn}>✖</button>
              <div style={style.heading}>Booking Details</div>
              <div style={style.grid}>
                <div style={style.field}>
                  <span style={style.label}>Guest Name</span>
                  <span style={style.value}>{selectedBooking.guestName}</span>
                </div>
                {/* <div style={style.field}>
                  <span style={style.label}>Phone</span>
                  <span style={style.value}>{selectedBooking.guestPhone}</span>
                </div> */}
                <div style={style.field}>
                  <span style={style.label}>Email</span>
                  <span style={style.value}>{selectedBooking.guestEmail}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Booking Date</span>
                  <span style={style.value}>{formatDate(selectedBooking.bookingDate)}</span>
                </div>
                 <div style={style.field}>
                  <span style={style.label}>Guest</span>
                  <span style={style.value}>{selectedBooking.guestAmount}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Check-in Date</span>
                  <span style={style.value}>{formatDate(selectedBooking.checkInDate)}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Check-out Date</span>
                  <span style={style.value}>{formatDate(selectedBooking.checkInDate)}</span>
                </div>
               
                <div style={style.field}>
                  <span style={style.label}>Room Type</span>
                  <span style={style.value}>{selectedBooking.roomType}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Stay Duration</span>
                  <span style={style.value}>{selectedBooking.stayDuration}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Total Payment</span>
                  <span style={style.value}>{selectedBooking.totalPayment}</span>
                </div>
                <div style={{ ...style.field, gridColumn: "span 2" }}>
                  <span style={style.label}>Special Request</span>
                  <span style={style.value}>{selectedBooking.specialRequest}</span>
                </div>
              </div>
              <div style={style.modalActions}>
                <button
                  style={{ ...style.actionBtn, ...style.approveBtn }}
                  onClick={() => handleApprove(selectedBooking.id)}
                >
                  <Check size={16} color="#fff" /> &nbsp; Approve
                </button>
                <button
                  style={{ ...style.actionBtn, ...style.rejectBtn }}
                  onClick={() => handleReject(selectedBooking.id)}
                >
                  <X size={16} color="#fff" /> &nbsp; Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckInAdmin;
