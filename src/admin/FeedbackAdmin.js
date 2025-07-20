"use client";

import { useState, useEffect } from "react";
import { Star, Check, X } from "lucide-react"; // Assuming lucide-react is installed
import SidebarAdmin from "../components/SidebarAdmin"; // Assuming SidebarAdmin.js exists at this path
import { Navigate } from "react-router-dom";

// --- Inlined Review Storage Logic (simulating a backend with localStorage) ---
const REVIEWS_STORAGE_KEY = "admin_pending_reviews";

function getReviews() {
  if (typeof window === "undefined") return []; // Ensure this runs only in browser
  try {
    const storedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
    return storedReviews ? JSON.parse(storedReviews) : [];
  } catch (error) {
    console.error("Failed to load reviews from localStorage:", error);
    return [];
  }
}

function saveReviews(reviews) {
  if (typeof window === "undefined") return; // Ensure this runs only in browser
  try {
    localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  } catch (error) {
    console.error("Failed to save reviews to localStorage:", error);
  }
}

function addReview(newReview) {
  const reviews = getReviews();
  const reviewWithId = {
    id: Date.now().toString(), // Simple unique ID
    status: "pending", // Default status
    createdAt: new Date().toISOString(),
    ...newReview,
  };
  reviews.push(reviewWithId);
  saveReviews(reviews);
  return reviewWithId;
}

function updateReviewStatus(reviewId, newStatus) {
  const reviews = getReviews();
  const reviewIndex = reviews.findIndex((r) => r.id === reviewId);
  if (reviewIndex > -1) {
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      status: newStatus,
      moderatedAt: new Date().toISOString(),
    };
    saveReviews(reviews);
    return reviews[reviewIndex];
  }
  return null;
}

// --- Helper Functions ---
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

// --- FeedbackAdmin Component ---
const FeedbackAdmin = () => {
  const [reviews, setReviews] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null); // For detail modal

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Function to refresh reviews from localStorage
  const refreshReviews = () => {
    const loadedReviews = getReviews();
    setReviews(loadedReviews);
    setLoading(false);
  };

  // Fungsi untuk mengambil semua review pending
  const fetchPendingReviews = async () => {
    try {
      const response = await fetch(
        "https://localhost:7298/api/Review?status=pending"
      );
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data = await response.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
      return [];
    }
  };

  // Fungsi untuk update status review
  const updateReviewStatus = async (reviewId, status, moderatedById) => {
    try {
      const response = await fetch(
        `https://localhost:7298/api/Review/${reviewId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            moderatedById,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to update review status");
      return true;
    } catch (error) {
      console.error("Error updating review status:", error);
      return false;
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("https://localhost:7298/api/Review");
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleStatusChange = async (reviewId, newStatus) => {
    try {
      const response = await fetch(
        `https://localhost:7298/api/Review/${reviewId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus, // Just send the new status
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update review status");
      }

      // Update UI immediately
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                status: newStatus,
                moderatedAt: new Date().toISOString(),
              }
            : review
        )
      );

      // Close modal if open
      if (selectedReview?.id === reviewId) {
        setSelectedReview(null);
      }

      alert(`Review has been ${newStatus}`);
    } catch (error) {
      console.error("Error updating review:", error);
      alert(`Error: ${error.message}`);
    }
  };

  const filteredReviews = reviews.filter((review) => {
    if (filterStatus === "all") {
      return true;
    }
    return review.status === filterStatus;
  });

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || user.role !== "admin") {
    return <Navigate to="/signin" replace />;
  }

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
      color: "#fff",
    },
    controls: {
      display: "flex",
      gap: "1rem",
      alignItems: "center",
      marginBottom: "20px",
      flexWrap: "wrap",
    },
    select: {
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "white",
      minWidth: "150px",
      cursor: "pointer",
      transition: "border-color 0.2s ease",
    },
    filterLabel: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#333",
      whiteSpace: "nowrap",
    },
    emptyState: {
      textAlign: "center",
      padding: "60px 20px",
      color: "#666",
      fontSize: "18px",
    },
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
        <h1 style={style.title}>Guest Feedback Management</h1>

        <div style={style.controls}>
          <label style={style.filterLabel} htmlFor="filterStatus">
            Filter by Status:
          </label>
          <select
            id="filterStatus"
            style={style.select}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div style={style.tableContainer}>
          <table style={style.table}>
            <thead>
              <tr>
                <th style={style.th}>No</th>
                <th style={style.th}>Booking ID</th>
                <th style={style.th}>Room</th>
                <th style={style.th}>Guest</th>
                <th style={style.th}>Title</th>
                <th style={style.th}>Rating</th>
                <th style={style.th}>Status</th>
                <th style={style.th}>Submitted At</th>
                <th style={style.th}>Actions</th>
                <th style={style.th}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      ...style.td,
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    Loading reviews...
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      ...style.td,
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No reviews found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review, index) => (
                  <tr key={review.id}>
                    <td style={style.td}>{index + 1}</td>
                    <td style={style.td}>#{review.bookingId}</td>
                    <td style={style.td}>
                      {review.room?.title || review.roomType || "N/A"}
                    </td>
                    <td style={style.td}>
                      {review.user?.fullName || review.fullname || "Anonymous"}
                    </td>
                    <td style={style.td}>{review.title}</td>
                    <td style={style.td}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            style={{
                              color: i < review.rating ? "#d09500" : "#e5e7eb",
                              fill: i < review.rating ? "#d09500" : "none",
                              stroke: i < review.rating ? "#d09500" : "#9ca3af",
                            }}
                          />
                        ))}
                      </div>
                    </td>
                    <td style={style.td}>
                      <span
                        style={{
                          ...style.badge,
                          ...(review.status === "pending" && {
                            backgroundColor: "#f59e0b",
                          }),
                          ...(review.status === "approved" && {
                            backgroundColor: "#4caf50",
                          }),
                          ...(review.status === "rejected" && {
                            backgroundColor: "#f44336",
                          }),
                        }}
                      >
                        {review.status.charAt(0).toUpperCase() +
                          review.status.slice(1)}
                      </span>
                    </td>
                    <td style={style.td}>{formatDate(review.createdAt)}</td>
                    <td style={style.td}>
                      {review.status === "pending" && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            style={{
                              ...style.actionBtn,
                              ...style.approveBtn,
                              marginRight: 0,
                            }}
                            onClick={() =>
                              handleStatusChange(review.id, "approved")
                            }
                          >
                            <Check size={16} /> Approve
                          </button>
                          <button
                            style={{
                              ...style.actionBtn,
                              ...style.rejectBtn,
                              marginRight: 0,
                            }}
                            onClick={() =>
                              handleStatusChange(review.id, "rejected")
                            }
                          >
                            <X size={16} /> Reject
                          </button>
                        </div>
                      )}
                      {review.status !== "pending" && (
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          Moderated
                        </span>
                      )}
                    </td>
                    <td style={style.td}>
                      <button
                        style={{
                          ...style.actionBtn,
                          ...style.detailBtn,
                          marginRight: 0,
                        }}
                        onClick={() => setSelectedReview(review)}
                      >
                        More
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Detail Modal */}
        {selectedReview && (
          <div style={style.modalOverlay}>
            <div style={style.modal}>
              <button
                onClick={() => setSelectedReview(null)}
                style={style.closeBtn}
              >
                ✖
              </button>
              <div style={style.heading}>Review Details</div>
              <div style={style.grid}>
                <div style={style.field}>
                  <span style={style.label}>Booking ID</span>
                  <span style={style.value}>#{selectedReview.bookingId}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Guest</span>
                  <span style={style.value}>
                    {selectedReview.user?.fullName || selectedReview.fullname}
                  </span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Room</span>
                  <span style={style.value}>
                    {selectedReview.room?.title ||
                      selectedReview.roomType ||
                      "N/A"}
                  </span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Review Title</span>
                  <span style={style.value}>{selectedReview.title}</span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Rating</span>
                  <span style={style.value}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                      }}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          style={{
                            color:
                              i < selectedReview.rating ? "#d09500" : "#e5e7eb",
                            fill:
                              i < selectedReview.rating ? "#d09500" : "none",
                            stroke:
                              i < selectedReview.rating ? "#d09500" : "#9ca3af",
                          }}
                        />
                      ))}
                    </div>
                  </span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Status</span>
                  <span style={style.value}>
                    <span
                      style={{
                        ...style.badge,
                        ...(selectedReview.status === "pending" && {
                          backgroundColor: "#f59e0b",
                        }),
                        ...(selectedReview.status === "approved" && {
                          backgroundColor: "#4caf50",
                        }),
                        ...(selectedReview.status === "rejected" && {
                          backgroundColor: "#f44336",
                        }),
                      }}
                    >
                      {selectedReview.status.charAt(0).toUpperCase() +
                        selectedReview.status.slice(1)}
                    </span>
                  </span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Submitted At</span>
                  <span style={style.value}>
                    {formatDate(selectedReview.createdAt)}
                  </span>
                </div>
                <div style={style.field}>
                  <span style={style.label}>Moderated At</span>
                  <span style={style.value}>
                    {selectedReview.moderatedAt
                      ? formatDate(selectedReview.moderatedAt)
                      : "N/A"}
                  </span>
                </div>
                <div style={{ ...style.field, gridColumn: "span 2" }}>
                  <span style={style.label}>Comment</span>
                  <span style={style.value}>
                    {selectedReview.comment || "-"}
                  </span>
                </div>
              </div>
              {selectedReview.status === "pending" && (
                <div style={style.modalActions}>
                  <button
                    style={{ ...style.actionBtn, ...style.approveBtn }}
                    onClick={() =>
                      handleStatusChange(selectedReview.id, "approved")
                    }
                  >
                    <Check size={16} /> &nbsp; Approve
                  </button>
                  <button
                    style={{ ...style.actionBtn, ...style.rejectBtn }}
                    onClick={() =>
                      handleStatusChange(selectedReview.id, "rejected")
                    }
                  >
                    <X size={16} /> &nbsp; Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default FeedbackAdmin;
