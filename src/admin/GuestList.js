// src/admin/GuestList.js atau pages/Dashboard/GuestList.js
import React, { useState, useEffect } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import { getAllUsers } from "../services/userService"; // pastikan path benar

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

const GuestList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [guests, setGuests] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const users = await getAllUsers();
        setGuests(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchGuests();
  }, []);

  return (
    <div style={style.container}>
      <SidebarAdmin
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />

      <main style={style.main}>
        <h1 style={style.title}>Guest Account</h1>
        <div style={style.tableContainer}>
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.th}>No</th>
                <th style={style.th}>Name</th>
                <th style={style.th}>Email</th>
                <th style={style.th}>Create Time</th>
                <th style={style.th}>Role</th> 
              </tr>
            </thead>
            <tbody>
              {guests.map((guest, index) => (
                <tr key={guest.id}>
                  <td style={style.td}>{index + 1}</td>
                  <td style={style.td}>{guest.fullname}</td>
                  <td style={style.td}>{guest.email}</td>
                  <td style={style.td}>{guest.createtime}</td>
                  <td style={style.td}>{guest.role}</td>
                </tr>
              ))}
              {guests.length === 0 && (
                <tr>
                  <td style={style.td} colSpan="5">
                    No guest data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default GuestList;
