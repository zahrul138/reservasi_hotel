import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, X } from "lucide-react";
import axios from "axios";

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

const CheckInAdmin = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("https://localhost:7298/api/Booking");

        // ✅ Filter hanya booking dengan status 'pending'
        const filteredBookings = res.data.filter((b) => b.status?.toLowerCase() === "pending");
        setBookings(filteredBookings);
      } catch (err) {
        console.error("Gagal memuat booking:", err);
      }
    };

    fetchBookings();
  }, []);



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

  const handleApprove = async (id) => {
    try {
      await axios.patch(`https://localhost:7298/api/Booking/${id}`, {
        status: "waiting-checkout",
        checkInApprovedDate: new Date().toISOString(),
      });

      alert(`Booking approved.`);

      // Hilangkan booking dari daftar tampilan (tanpa fetch ulang)
      setBookings((prev) => prev.filter((b) => b.id !== id));
      setSelectedBooking(null);
    } catch (err) {
      console.error(err);
      alert("Gagal menyetujui booking.");
    }
  };



  const handleReject = async (id) => {
    try {
      await axios.delete(`https://localhost:7298/api/Booking/${id}`);
      alert(`Booking rejected and removed.`);
      setSelectedBooking(null);

      // ✅ Fetch ulang booking dan filter hanya yang status 'pending'
      const res = await axios.get("https://localhost:7298/api/Booking");
      const filtered = res.data.filter(b => b.status === "pending");
      setBookings(filtered);
    } catch (err) {
      console.error(err);
      alert("Failed to reject booking.");
    }
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
              {bookings.length > 0 ? (
                bookings.map((booking, index) => (
                  <tr key={booking.id}>
                    <td style={style.td}>{index + 1}</td>
                    <td style={style.td}>{booking.fullname}</td>
                    <td style={style.td}>{formatDate(booking.createdAt)}</td>
                    <td style={style.td}>{booking.roomType}</td>
                    <td style={style.td}>{formatDate(booking.checkinDate)}</td>
                    <td style={style.td}>
                      {booking.adultGuests} Adults, {booking.childGuests} Children
                    </td>
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
                  <td colSpan={7} style={{ padding: "30px", textAlign: "center" }}>
                    No guests currently checked in
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
                  <span style={style.label}>Full Name</span>
                  <span style={style.value}>{selectedBooking.fullname}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Phone</span>
                  <span style={style.value}>{selectedBooking.phoneNumber}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Email</span>
                  <span style={style.value}>{selectedBooking.email}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Booking Date</span>
                  <span style={style.value}>{formatDate(selectedBooking.createdAt)}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Guest</span>
                  <span style={style.value}>
                    {selectedBooking.adultGuests} Adults, {selectedBooking.childGuests} Children
                  </span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Check-in Date</span>
                  <span style={style.value}>{formatDate(selectedBooking.checkinDate)}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Check-out Date</span>
                  <span style={style.value}>{formatDate(selectedBooking.checkoutDate)}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Room Type</span>
                  <span style={style.value}>{selectedBooking.roomType}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Total Payment</span>
                  <span style={style.value}>${selectedBooking.totalPrice}</span>
                </div>
                <div style={{ ...style.field, gridColumn: "span 2" }}>
                  <span style={style.label}>Special Request</span>
                  <span style={style.value}>{selectedBooking.specialRequest || "-"}</span>
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