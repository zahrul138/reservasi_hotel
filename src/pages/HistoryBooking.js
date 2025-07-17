"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { IoIosLock } from "react-icons/io"
import { FaBuilding, FaBed, FaRulerCombined, FaEye, FaSearch } from "react-icons/fa"
import { Slide } from "@mui/material"

const HistoryBooking = () => {
  // State management
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [noUser, setNoUser] = useState(false)
  const [filter, setFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showControls, setShowControls] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const navigate = useNavigate()

  // Fetch user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"))
    if (storedUser && storedUser.id) {
      setUserId(storedUser.id)
    } else {
      setBookings([])
      setLoading(false)
      setNoUser(true)
    }
  }, [])

  // Fetch bookings and rooms data
  useEffect(() => {
    if (!userId) return

    const fetchData = async () => {
      try {
        const [bookingsRes, roomsRes] = await Promise.all([
          fetch("https://localhost:7298/api/Booking"),
          fetch("https://localhost:7298/api/Room"),
        ])

        const bookingsData = await bookingsRes.json()
        const roomsData = await roomsRes.json()

        const userBookings = bookingsData
          .filter((b) => b.userId === userId)
          .map((booking) => {
            const matchedRoom = roomsData.find((room) => room.title === booking.roomType)

            // Handle image URL construction with better fallbacks
            let roomImage = "/placeholder.svg?height=180&width=220"
            if (matchedRoom?.image1) {
              // Clean the image path and ensure proper URL construction
              const imagePath = matchedRoom.image1.trim()
              if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
                // Already a full URL
                roomImage = imagePath
              } else if (imagePath.startsWith("/uploads/")) {
                // Relative path starting with /uploads/
                roomImage = `https://localhost:7298${imagePath}`
              } else {
                // Path without /uploads/ prefix
                roomImage = `https://localhost:7298/uploads/${imagePath}`
              }
            }

            return {
              ...booking,
              bookingId: `BK-${new Date(booking.createdAt).toISOString().split("T")[0].replace(/-/g, "")}-${booking.id.toString().padStart(3, "0")}`,
              roomImage: roomImage,
              roomDetails: matchedRoom || null,
            }
          })

        setBookings(userBookings)
      } catch (err) {
        console.error("Failed to fetch data:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [userId])

  // Scroll effect like navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setShowControls(false)
      } else {
        setShowControls(true)
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Responsive design handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getBookingStatus = (booking) => {
    // 1. Priority - cancelled status
    if (booking.paymentStatus.toLowerCase() === "cancelled" ||
      booking.status?.toLowerCase() === "cancelled") {
      return "cancelled";
    }

    // 2. If status is completed
    if (booking.status?.toLowerCase() === "completed") {
      return "completed";
    }

    // 3. For active status (set by admin approval)
    if (booking.status?.toLowerCase() === "active") {
      return "active";
    }

    // 4. Payment status logic
    if (booking.paymentMethod.toLowerCase().includes("cash")) {
      return booking.status?.toLowerCase() === "pending"
        ? "pending"
        : "paid";
    }

    // 5. For non-cash (Midtrans)
    if (booking.paymentMethod.toLowerCase().includes("midtrans")) {
      return "paid";
    }

    // Default completed if past checkout date
    return "completed";
  };

  // ... rest of the code remains the same ...

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return {
          backgroundColor: "#fff",
          color: "#f59e0b",
          borderColor: "#f59e0b"
        };
      case "paid":
        return {
          backgroundColor: "#fff",
          color: "#10b981",
          borderColor: "#10b981"
        };
      case "upcoming":
        return {
          backgroundColor: "#fff",
          color: "#2563eb",
          borderColor: "#2563eb"
        };
      case "active":
        return {
          backgroundColor: "#fff",
          color: "#059669",
          borderColor: "#059669"
        };
      case "completed":
        return {
          backgroundColor: "#fff",
          color: "#6b7280",
          borderColor: "#6b7280"
        };
      case "cancelled":
        return {
          backgroundColor: "#fff",
          color: "#dc2626",
          borderColor: "#dc2626"
        };
      default:
        return {
          backgroundColor: "#fff",
          color: "#6b7280",
          borderColor: "#6b7280"
        };
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "Pending";
      case "paid":
        return "Paid";
      case "upcoming":
        return "Upcoming";
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "#10b981"
      case "pending":
        return "#f59e0b"
      case "cancelled":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase())
  }

  const filteredAndSortedBookings = () => {
    let filtered = bookings

    if (filter !== "all") {
      filtered = bookings.filter((booking) => getBookingStatus(booking) === filter)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.roomType.toLowerCase().includes(searchQuery) ||
          booking.bookingId.toLowerCase().includes(searchQuery) ||
          (booking.roomDetails?.bed?.toLowerCase().includes(searchQuery)) ||
          (booking.roomDetails?.roomView?.toLowerCase().includes(searchQuery))
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt || b.checkinDate).getTime() - new Date(a.createdAt || a.checkinDate).getTime()
        case "oldest":
          return new Date(a.createdAt || a.checkinDate).getTime() - new Date(b.createdAt || b.checkinDate).getTime()
        case "checkin":
          return new Date(a.checkinDate).getTime() - new Date(b.checkinDate).getTime()
        default:
          return 0
      }
    })

    return filtered
  }

  const calculateNights = (checkinDate, checkoutDate) => {
    const checkIn = new Date(checkinDate)
    const checkOut = new Date(checkoutDate)
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
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
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount)
  }

  // Action handlers
  const handleModifyBooking = (booking) => {
    console.log("Modifying booking:", booking.bookingId)
    alert(`Modify booking ${booking.bookingId}`)
  }

  const handleContactHotel = (booking) => {
    console.log("Contacting hotel for:", booking.bookingId)
    alert(`Contact hotel for booking ${booking.bookingId}`)
  }

  const handleReviewStay = (booking) => {
    console.log("Reviewing stay:", booking.bookingId)
    alert(`Review stay for booking ${booking.bookingId}`)
  }

  // Styles
  const styles = {
    page: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
      backgroundColor: "#F8F5F0",
      lineHeight: 1.6,
      margin: 0,
      padding: 0,
      minHeight: "100vh",
    },
    container: {
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "2rem",
      paddingTop: "2rem",
    },
    header: {
      background: "linear-gradient(135deg, #B4881B 0%, #d09500 100%)",
      borderRadius: "12px",
      padding: "2rem 2.5rem",
      marginBottom: "2rem",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      textAlign: "center",
    },
    headerTitle: {
      color: "white",
      fontSize: "2.5rem",
      fontWeight: "700",
      margin: "0 0 0.5rem 0",
    },
    headerSubtitle: {
      color: "rgba(255,255,255,0.9)",
      fontSize: "1.1rem",
      margin: "0",
    },
    controlsCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "2rem",
      marginBottom: "2rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1rem",
      position: "sticky",
      top: "10rem",
      right: "22rem",
      zIndex: 90,
      width: "100%",
      maxWidth: "1130px",
      margin: "0 auto",
      transition: "transform 0.3s ease",
    },
    filterGroup: {
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#374151",
      whiteSpace: "nowrap",
    },
    select: {
      padding: "0.5rem 0.75rem",
      border: "1px solid #d1d5db",
      borderRadius: "6px",
      fontSize: "0.9rem",
      backgroundColor: "white",
      minWidth: "150px",
      cursor: "pointer",
      transition: "border-color 0.2s ease",
    },
    statsContainer: {
      display: "flex",
      gap: "2rem",
    },
    statItem: {
      textAlign: "center",
    },
    statNumber: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#B4881B",
      margin: "0",
    },
    statLabel: {
      fontSize: "0.75rem",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      margin: "0",
    },
    bookingsList: {
      display: "flex",
      flexDirection: "column",
      gap: "1.25rem",
      marginTop: "150px"
    },
    bookingCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      border: "1px solid #f0f0f0",
      minHeight: "180px",
    },
    bookingContent: {
      display: "flex",
      flexDirection: "row",
      height: "100%",
    },
    imageContainer: {
      width: "20%",
      minHeight: "280px",
      position: "relative",
      flexShrink: 0,
    },
    roomImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      backgroundColor: "#f3f4f6",
      transition: "opacity 0.3s ease",
    },
    statusBadge: {
      position: "absolute",
      top: "0.75rem",
      right: "0.75rem",
      padding: "0.25rem 0.75rem",
      borderRadius: "20px",
      fontSize: "0.75rem",
      fontWeight: "600",
      textTransform: "uppercase",
      letterSpacing: "0.025em",
    },
    contentSection: {
      flex: 1,
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
    },
    bookingHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: "1rem",
      flexWrap: "wrap",
      gap: "0.75rem",
    },
    roomType: {
      fontSize: "1.25rem",
      fontWeight: "600",
      color: "#111827",
      margin: "0 0 0.25rem 0",
    },
    bookingId: {
      fontSize: "0.85rem",
      color: "#6b7280",
      fontFamily: "monospace",
      margin: "0",
    },
    priceSection: {
      textAlign: "right",
    },
    price: {
      fontSize: "1.5rem",
      fontWeight: "700",
      color: "#d09500",
      margin: "0",
    },
    nights: {
      fontSize: "0.85rem",
      color: "#6b7280",
      margin: "0",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "1rem",
      marginBottom: "1.25rem",
    },
    infoItem: {
      display: "flex",
      flexDirection: "column",
      gap: "0.25rem",
    },
    infoLabel: {
      fontSize: "0.75rem",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      fontWeight: "500",
    },
    infoValue: {
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#111827",
    },
    paymentStatus: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    statusDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
    },
    specialRequest: {
      backgroundColor: "#fef7ed",
      border: "1px solid #fed7aa",
      borderRadius: "8px",
      padding: "0.75rem",
      marginBottom: "1.25rem",
    },
    specialRequestTitle: {
      fontSize: "0.8rem",
      fontWeight: "600",
      color: "#B4881B",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      marginBottom: "0.25rem",
    },
    specialRequestText: {
      fontSize: "0.9rem",
      color: "#d97706",
      lineHeight: "1.4",
      margin: "0",
    },
    actions: {
      display: "flex",
      gap: "0.75rem",
      flexWrap: "wrap",
      marginTop: "auto",
    },
    button: {
      display: "inline-flex",
      alignItems: "center",
      gap: "0.5rem",
      padding: "0.5rem 1rem",
      borderRadius: "6px",
      fontSize: "0.85rem",
      fontWeight: "500",
      cursor: "pointer",
      border: "none",
      transition: "all 0.2s ease",
      textDecoration: "none",
    },
    primaryButton: {
      backgroundColor: "#d09500",
      color: "white",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: "#374151",
      border: "1px solid #d1d5db",
    },
    emptyState: {
      textAlign: "center",
      padding: "4rem 2rem",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      marginTop: "10rem"
    },
    emptyIcon: {
      fontSize: "3rem",
      marginBottom: "1rem",
      color: "#d09500",
    },
    emptyTitle: {
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#111827",
      marginBottom: "0.5rem",
    },
    emptyText: {
      color: "#6b7280",
      fontSize: "1rem",
      marginBottom: "2rem",
    },
    browseButton: {
      backgroundColor: "#d09500",
      color: "white",
      padding: "0.75rem 1.5rem",
      borderRadius: "6px",
      fontWeight: "600",
      textDecoration: "none",
      display: "inline-block",
      border: "none",
      cursor: "pointer",
      transition: "all 0.2s ease",
    },
    mobileBookingContent: {
      flexDirection: "column",
    },
    mobileImageContainer: {
      width: "100%",
      height: "200px",
    },
    mobileBookingHeader: {
      flexDirection: "column",
      alignItems: "flex-start",
      gap: "0.5rem",
    },
    mobilePriceSection: {
      textAlign: "left",
    },
    mobileInfoGrid: {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    roomDetails: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1rem",
      marginBottom: "1rem",
      backgroundColor: "#f8f5f0",
      padding: "0.75rem",
      borderRadius: "8px",
    },
    roomDetailItem: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontSize: "0.85rem",
    },
    roomDetailIcon: {
      color: "#d09500",
      fontSize: "0.9rem",
    },
    roomDetailText: {
      fontWeight: "500",
    },
    searchContainer: {
      width: "15%",
      marginRight: "4rem",
      position: "relative",
    },
    searchInput: {
      width: "100%",
      padding: "0.75rem 1rem 0.75rem 2.5rem",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "0.95rem",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      transition: "all 0.2s ease",
      "&:focus": {
        outline: "none",
        borderColor: "#d09500",
        boxShadow: "0 0 0 3px rgba(208, 149, 0, 0.2)",
      },
    },
    searchIcon: {
      position: "absolute",
      left: "1rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#6b7280",
      fontSize: "0.9rem",
    },

  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Controls Section with Slide effect */}
        <Slide direction="down" in={showControls}>
          <div style={styles.controlsCard}>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
              <div style={styles.filterGroup}>
                <label style={styles.label}>Filter:</label>
                <select style={styles.select} value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All Bookings</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>

              <div style={styles.filterGroup}>
                <label style={styles.label}>Sort by:</label>
                <select style={styles.select} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="checkin">Check-in Date</option>
                </select>
              </div>
            </div>

            <div style={styles.searchContainer}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search"
                style={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              />
            </div>
          </div>
        </Slide>

        {/* Loading State */}
        {loading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "300px",
              color: "#6b7280",
              fontSize: "1.1rem",
            }}
          >
            Loading your booking history...
          </div>
        )}

        {/* Login Required */}
        {!loading && noUser && (
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              padding: "5rem",
              marginTop: "10rem",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "3rem", color: "#d09500" }}>
              <IoIosLock />
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "600", marginBottom: "0.5rem" }}>Login Required</h3>
            <p style={{ color: "#6b7280", marginBottom: "1rem" }}>You need to login to see your booking history.</p>
            <button
              style={{
                padding: "0.6rem 1.5rem",
                backgroundColor: "#d09500",
                color: "#fff",
                borderRadius: "8px",
                fontWeight: "500",
                cursor: "pointer",
                border: "none",
                fontSize: "1rem",
              }}
              onClick={() => navigate("/signin")}
            >
              Go to Login
            </button>
          </div>
        )}

        {/* Empty Booking State */}
        {!loading && !noUser && bookings.length === 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>
              <FaBuilding />
            </div>
            <h3 style={styles.emptyTitle}>No Bookings Yet</h3>
            <p style={styles.emptyText}>You haven't made any hotel reservations yet. Start exploring our rooms!</p>
            <button style={styles.browseButton} onClick={() => navigate("/searchbooking")}>
              Browse Rooms
            </button>
          </div>
        )}

        {/* Filtered Empty State */}
        {!loading && !noUser && filteredAndSortedBookings().length === 0 && bookings.length > 0 && (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🔍</div>
            <h3 style={styles.emptyTitle}>No Bookings Found</h3>
            <p style={styles.emptyText}>No bookings match your current filter criteria.</p>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !noUser && filteredAndSortedBookings().length > 0 && (
          <div style={styles.bookingsList}>
            {filteredAndSortedBookings().map((booking) => {
              const status = getBookingStatus(booking)
              const nights = calculateNights(booking.checkinDate, booking.checkoutDate)
              const roomDetails = booking.roomDetails

              return (
                <div key={booking.bookingId} style={styles.bookingCard}>
                  <div
                    style={
                      isMobile ? { ...styles.bookingContent, ...styles.mobileBookingContent } : styles.bookingContent
                    }
                  >
                    {/* Room Image with Status Badge */}
                    <div
                      style={
                        isMobile
                          ? { ...styles.imageContainer, ...styles.mobileImageContainer }
                          : styles.imageContainer
                      }
                    >
                      <img
                        src={booking.roomImage || "/placeholder.svg?height=180&width=220"}
                        alt={`${booking.roomType} room`}
                        style={{
                          ...styles.roomImage,
                          position: "absolute",  // Tambahkan ini untuk memastikan gambar menutupi area
                          top: 0,
                          left: 0,
                        }}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=180&width=220"
                          e.target.style.backgroundColor = "#f9fafb"
                        }}
                        onLoad={(e) => {
                          e.target.style.opacity = "1"
                        }}
                        loading="lazy"
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "0.75rem",
                          right: "0.75rem",
                          padding: "0.25rem 0.75rem",
                          borderRadius: "12px",
                          fontSize: "0.75rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.025em",
                          backgroundColor: getStatusColor(status).backgroundColor,
                          color: getStatusColor(status).color,
                          border: `1px solid ${getStatusColor(status).borderColor}`,
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          zIndex: 2,
                        }}
                      >
                        {getStatusText(status)}
                      </div>
                    </div>

                    {/* Booking Content */}
                    <div style={styles.contentSection}>
                      <div
                        style={
                          isMobile ? { ...styles.bookingHeader, ...styles.mobileBookingHeader } : styles.bookingHeader
                        }
                      >
                        <div>
                          <h3 style={styles.roomType}>{booking.roomType}</h3>
                          <p style={styles.bookingId}>#{booking.bookingId}</p>
                        </div>
                        <div
                          style={
                            isMobile ? { ...styles.priceSection, ...styles.mobilePriceSection } : styles.priceSection
                          }
                        >
                          <div style={styles.price}>{formatCurrency(booking.totalPrice)}</div>
                          <div style={styles.nights}>{nights} nights</div>
                        </div>
                      </div>

                      {/* Room Details Section */}
                      {roomDetails && (
                        <div
                          style={isMobile ? { ...styles.roomDetails, ...styles.mobileRoomDetails } : styles.roomDetails}
                        >
                          <div style={styles.roomDetailItem}>
                            <FaRulerCombined style={styles.roomDetailIcon} />
                            <span style={styles.roomDetailText}>{roomDetails.size || "N/A"}</span>
                          </div>
                          <div style={styles.roomDetailItem}>
                            <FaBed style={styles.roomDetailIcon} />
                            <span style={styles.roomDetailText}>{roomDetails.bed || "N/A"}</span>
                          </div>
                          <div style={styles.roomDetailItem}>
                            <FaEye style={styles.roomDetailIcon} />
                            <span style={styles.roomDetailText}>{roomDetails.roomView || "N/A"}</span>
                          </div>
                        </div>
                      )}

                      {/* Booking Information Grid */}
                      <div style={isMobile ? { ...styles.infoGrid, ...styles.mobileInfoGrid } : styles.infoGrid}>
                        <div style={styles.infoItem}>
                          <div style={styles.infoLabel}>Check-in</div>
                          <div style={styles.infoValue}>{formatDate(booking.checkinDate)}</div>
                        </div>
                        <div style={styles.infoItem}>
                          <div style={styles.infoLabel}>Check-out</div>
                          <div style={styles.infoValue}>{formatDate(booking.checkoutDate)}</div>
                        </div>
                        <div style={styles.infoItem}>
                          <div style={styles.infoLabel}>Guests</div>
                          <div style={styles.infoValue}>{booking.adultGuests + booking.childGuests} guests</div>
                        </div>
                        <div style={styles.infoItem}>
                          <div style={styles.infoLabel}>Payment</div>
                          <div style={styles.paymentStatus}>
                            <div
                              style={{
                                ...styles.statusDot,
                                backgroundColor: getPaymentStatusColor(booking.paymentStatus),
                              }}
                            />
                            <span style={styles.infoValue}>{booking.paymentMethod === "cash" ? "Cash" : "Online"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Special Request Section */}
                      {booking.specialRequest && (
                        <div style={styles.specialRequest}>
                          <div style={styles.specialRequestTitle}>Special Request</div>
                          <p style={styles.specialRequestText}>{booking.specialRequest}</p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={styles.actions}>
                        <button
                          style={{ ...styles.button, ...styles.primaryButton }}
                          onClick={() => navigate("/invoice", { state: { bookingId: booking.id } })}
                        >
                          📄 Invoice
                        </button>

                        {status === "upcoming" && (
                          <button
                            style={{ ...styles.button, ...styles.secondaryButton }}
                            onClick={() => handleModifyBooking(booking)}
                          >
                            ✏️ Modify
                          </button>
                        )}

                        {status === "active" && (
                          <button
                            style={{ ...styles.button, ...styles.secondaryButton }}
                            onClick={() => handleContactHotel(booking)}
                          >
                            📞 Contact
                          </button>
                        )}

                        {status === "completed" && (
                          <button
                            style={{ ...styles.button, ...styles.secondaryButton }}
                            onClick={() => handleReviewStay(booking)}
                          >
                            ⭐ Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default HistoryBooking
