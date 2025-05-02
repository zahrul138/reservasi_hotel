// pages/Dashboard/GuestList.js
import React, { useState } from "react";
import SidebarAdmin from "../components/SidebarAdmin";// pastikan path sesuai

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
  status: (value) => ({
    padding: "6px 12px",
    borderRadius: "20px",
    color: "#fff",
    fontSize: "14px",
    backgroundColor:
      value === "Checked In"
        ? "#4caf50"
        : value === "Checked Out"
        ? "#2196f3"
        : "#ff9800",
    display: "inline-block",
    textAlign: "center",
  }),
};

const guestData = [
  {
    id: 1,
    name: "Andi Saputra",
    email: "andi@email.com",
    checkInDate: "2025-04-20",
    status: "Checked In",
  },
  {
    id: 2,
    name: "Rina Marlina",
    email: "rina@email.com",
    checkInDate: "2025-04-22",
    status: "Pending",
  },
  {
    id: 3,
    name: "Budi Hartono",
    email: "budi@email.com",
    checkInDate: "2025-04-25",
    status: "Checked Out",
  },
  {
    id: 4,
    name: "Siti Aminah",
    email: "siti@email.com",
    checkInDate: "2025-04-29",
    status: "Checked In",
  },
];

const GuestList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div style={style.container}>
      <SidebarAdmin
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />

      <main style={style.main}>
        <h1 style={style.title}>Guest List</h1>
        <div style={style.tableContainer}>
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.th}>#</th>
                <th style={style.th}>Name</th>
                <th style={style.th}>Email</th>
                <th style={style.th}>Check-In Date</th>
                <th style={style.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {guestData.map((guest, index) => (
                <tr key={guest.id}>
                  <td style={style.td}>{index + 1}</td>
                  <td style={style.td}>{guest.name}</td>
                  <td style={style.td}>{guest.email}</td>
                  <td style={style.td}>{guest.checkInDate}</td>
                  <td style={style.td}>
                    <span style={style.status(guest.status)}>{guest.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default GuestList;
