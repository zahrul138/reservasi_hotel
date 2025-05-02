// src/components/SidebarAdmin.js
import React, { useState } from "react";
import {
  FaUser,
  FaDoorOpen,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaChevronLeft,
  FaTachometerAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const styles = {
  sidebar: (isOpen) => ({
    width: isOpen ? "220px" : "60px",
    backgroundColor: "#3d2e13",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "width 0.3s ease",
    overflow: "hidden",
    minHeight: "100vh",
  }),
  sidebarTop: {
    padding: "20px",
    fontSize: "20px",
    fontWeight: "bold",
    backgroundColor: "#5b461b",
    borderBottom: "2px solid #a0843a",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toggleButton: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "18px",
    cursor: "pointer",
  },
  navItem: (isActive) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 20px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
    backgroundColor: isActive ? "#6d5523" : "transparent",
    borderLeft: isActive ? "4px solid #f0c040" : "4px solid transparent",
  }),
  logout: {
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#ffdddd",
    cursor: "pointer",
    borderTop: "1px solid #a0843a",
  },
};

const SidebarAdmin = ({ activePage = "" }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const menu = [
    { icon: <FaTachometerAlt />, text: "Dashboard", path: "/dashboardadmin" },
    { icon: <FaUser />, text: "Guest List", path: "/guestlist" },
    { icon: <FaDoorOpen />, text: "Rooms", path: "/admin/rooms" },
    { icon: <FaCog />, text: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside style={styles.sidebar(isOpen)}>
      <div>
        <div style={styles.sidebarTop}>
          {isOpen && <span>Hotel Admin</span>}
          <button onClick={() => setIsOpen(!isOpen)} style={styles.toggleButton}>
            {isOpen ? <FaChevronLeft /> : <FaBars />}
          </button>
        </div>
        <nav>
          {menu.map((item) => (
            <div
              key={item.text}
              style={styles.navItem(activePage === item.text)}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {isOpen && <span>{item.text}</span>}
            </div>
          ))}
        </nav>
      </div>
      <div style={styles.logout} onClick={() => navigate("/home")}>
        <FaSignOutAlt />
        {isOpen && <span>Logout</span>}
      </div>
    </aside>
  );
};

export default SidebarAdmin;
