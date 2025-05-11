// src/admin/GuestList.js
import React, { useState, useEffect } from "react";
import SidebarAdmin from "../components/SidebarAdmin";
import { getAllUsers } from "../services/userService"; // pastikan path ini sesuai

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

const GuestList = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [guests, setGuests] = useState([]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

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
                <th style={style.th}>Created</th>
                <th style={style.th}>Role</th>
              </tr>
            </thead>
            <tbody>
              {guests.length > 0 ? (
                guests.map((guest, index) => (
                  <tr key={`${guest.id}-${index}`}>
                    <td style={style.td}>{index + 1}</td>
                    <td style={style.td}>{guest.fullname || "N/A"}</td>
                    <td style={style.td}>{guest.email || "N/A"}</td>
                    <td style={style.td}>{formatDate(guest.createtime)}</td>
                    <td style={style.td}>{guest.role || "Guest"}</td>
                  </tr>
                ))
              ) : (
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
