import { useEffect, useState } from "react";
import axios from "axios";
import { Check } from "lucide-react";
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

const CheckOutAdmin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [hoveredItem, setHoveredItem] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

    // ✅ Fetch booking data dari API
    const fetchBookings = async () => {
        try {
            const response = await axios.get("https://localhost:7298/api/Booking");
            setBookings(response.data);
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // ✅ Approve Check-out
    const handleApprove = async (id) => {
        const confirm = window.confirm("Are you sure you want to approve this check-out?");
        if (!confirm) return;

        try {
            await axios.patch(`https://localhost:7298/api/Booking/${id}`, {
                status: "completed",
            });
            alert(`Check-out approved for booking ID: ${id}`);
            setSelectedBooking(null);
            fetchBookings();
        } catch (error) {
            console.error("Error approving checkout:", error);
            alert("Failed to approve check-out.");
        }
    };


    // ✅ Filter booking dengan status "waiting-checkout"
    const waitingCheckoutBookings = bookings.filter(
        (b) => b.status?.toLowerCase() === "waiting-checkout"
    );


    return (
        <div style={style.container}>
            <SidebarAdmin
                isOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                hoveredItem={hoveredItem}
                setHoveredItem={setHoveredItem}
            />
            <main style={style.main}>
                <h1 style={style.title}>Check Out Approval</h1>
                <div style={style.tableContainer}>
                    <table style={style.table}>
                        <thead>
                            <tr>
                                <th style={style.th}>No</th>
                                <th style={style.th}>Name</th>
                                <th style={style.th}>Room</th>
                                <th style={style.th}>Check-in Date</th>
                                <th style={style.th}>Check-out Date</th>
                                <th style={style.th}>Status</th>
                                <th style={style.th}>Action</th>
                                <th style={style.th}>Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {waitingCheckoutBookings.length > 0 ? (
                                waitingCheckoutBookings.map((booking, index) => (
                                    <tr key={booking.id}>
                                        <td style={style.td}>{index + 1}</td>
                                        <td style={style.td}>{booking.fullname}</td>
                                        <td style={style.td}>{booking.roomType}</td>
                                        <td style={style.td}>{formatDate(booking.checkinDate)}</td>
                                        <td style={style.td}>{formatDate(booking.checkoutDate)}</td>
                                        <td style={style.td}>
                                            <span
                                                style={{ ...style.badge, backgroundColor: "#ffc107" }}
                                            >
                                                Waiting for Check-out
                                            </span>
                                        </td>
                                        <td style={style.td}>
                                            <button
                                                style={{ ...style.actionBtn, ...style.approveBtn }}
                                                onClick={() => handleApprove(booking.id)}
                                            >
                                                <Check size={16} color="#fff" /> &nbsp;
                                            </button>
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
                                    <td colSpan={8} style={{ ...style.td, textAlign: "center", padding: "30px" }}>
                                        No guests waiting for check-out approval
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal detail */}
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
                                    <span style={style.label}>Room</span>
                                    <span style={style.value}>{selectedBooking.roomType}</span>
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
                                    <span style={style.label}>Guest</span>
                                    <span style={style.value}>
                                        {selectedBooking.adultGuests} Adult, {selectedBooking.childGuests} Child
                                    </span>
                                </div>
                                <div style={style.field}>
                                    <span style={style.label}>Total Payment</span>
                                    <span style={style.value}>
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                        }).format(selectedBooking.totalPrice)}
                                    </span>
                                </div>
                                <div style={{ ...style.field, gridColumn: "span 2" }}>
                                    <span style={style.label}>Special Request</span>
                                    <span style={style.value}>
                                        {selectedBooking.specialRequest || "-"}
                                    </span>
                                </div>
                            </div>
                            <div style={style.modalActions}>
                                <button
                                    style={{ ...style.actionBtn, ...style.approveBtn }}
                                    onClick={() => handleApprove(selectedBooking.id)}
                                >
                                    <Check size={16} color="#fff" /> &nbsp; Approve
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CheckOutAdmin
