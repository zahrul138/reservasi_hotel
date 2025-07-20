// src/pages/DashboardAdmin.js
import React, { useState } from "react";
import {
  FaBookmark,
  FaCalendarCheck,
  FaSignInAlt,
  FaSignOutAlt as FaExit,
} from "react-icons/fa";
import SidebarAdmin from "../components/SidebarAdmin";
import { Navigate } from "react-router-dom";

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
  cardContainer: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },
  card: {
    backgroundColor: "#d0b375",
    padding: "20px",
    borderRadius: "10px",
    width: "200px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardValue: {
    fontSize: "28px",
    fontWeight: "bold",
  },
  cardIcon: {
    fontSize: "24px",
  },
  cardTitle: {
    marginTop: "10px",
    fontSize: "16px",
    fontWeight: "500",
  },
  availability: {
    marginTop: "20px",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "fit-content",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  occupiedCount: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
};

const Card = ({ title, value, icon }) => (
  <div style={style.card}>
    <div style={style.cardHeader}>
      <div style={style.cardValue}>{value}</div>
      <div style={style.cardIcon}>{icon}</div>
    </div>
    <div style={style.cardTitle}>{title}</div>
  </div>
);

const DashboardAdmin = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div style={style.container}>
      <SidebarAdmin
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        hoveredItem={hoveredItem}
        setHoveredItem={setHoveredItem}
      />

      <main style={style.main}>
        <h1 style={style.title}>Dashboard</h1>
        <div style={style.cardContainer}>
          <Card title="New Booking" value={282} icon={<FaBookmark />} />
          <Card title="Schedule Room" value={118} icon={<FaCalendarCheck />} />
          <Card title="Check In" value={78} icon={<FaSignInAlt />} />
          <Card title="Check Out" value={63} icon={<FaExit />} />
        </div>

        <div style={style.availability}>
          <h2>Room Availability</h2>
          <div>
            <p style={{ marginBottom: "4px" }}>Occupied</p>
            <span style={style.occupiedCount}>282</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardAdmin;
