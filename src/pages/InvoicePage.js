"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Logo from "../assets/images/LogoRG3.png"

const InvoicePage = () => {
  const location = useLocation()
  const [bookingData, setBookingData] = useState(null)
  const [pdfReady, setPdfReady] = useState(false)
  const [currentDate] = useState(new Date())
  const [invoiceNumber] = useState(() => generateInvoiceNumber())

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"
    script.onload = () => setPdfReady(true)
    document.head.appendChild(script)
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    const fetchBookingData = async () => {
      const id = location.state?.bookingId
      if (!id) {
        // Mock data for demonstration
        const mockData = {
          fullName: "FaznYajid",
          fullname: "FaznYajid",
          email: "fazn123@gmail.com",
          phone: "081293077025",
          phoneNumber: "081293077025",
          address:
            "Jln. Abdulfattah, Perumahan Taman Valencia Blok C No 13, RT 01, RW 25, Kelurahan Belian, Kecamatan Batam Kota, Kota Batam, Batam Centre",
          country: "Indonesia",
          checkinDate: "2025-07-06T00:00:00",
          checkoutDate: "2025-07-08T00:00:00",
          roomType: "Superior Room",
          totalPrice: 300000,
          paymentMethod: "Online Payment",
          paymentStatus: "Completed",
          bookingId: "1333",
          specialRequests: null,
        }
        setBookingData(mockData)
        return
      }

      try {
        const res = await fetch(`https://localhost:7298/api/Booking/${id}`)
        const data = await res.json()
        setBookingData(data)
      } catch (err) {
        console.error("Failed to fetch booking:", err)
      }
    }
    fetchBookingData()
  }, [location.state])

  function generateInvoiceNumber() {
    const date = new Date()
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `INV-${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, "0")}${date
      .getDate()
      .toString()
      .padStart(2, "0")}-${random}`
  }

  const calculateNights = () => {
    if (!bookingData?.checkinDate || !bookingData?.checkoutDate) return 0
    const checkIn = new Date(bookingData.checkinDate)
    const checkOut = new Date(bookingData.checkoutDate)
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24))
  }

  const downloadPDF = async () => {
    if (typeof window !== "undefined" && window.html2pdf) {
      const element = document.getElementById("invoice-content")
      const opt = {
        margin: 10,
        filename: `invoice-${invoiceNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "pt", format: "a4", orientation: "portrait" },
      }
      await window.html2pdf().set(opt).from(element).save()
    }
  }

  const nights = calculateNights()
  const totalAmount = bookingData?.totalPrice || 0
  const pricePerNight = nights > 0 ? totalAmount / nights : totalAmount
  const paymentMethod = bookingData?.paymentMethod?.toLowerCase() || ""

  const renderPaymentMethod = () => {
    if (paymentMethod.includes("cash")) {
      return "Cash Payment (Pending)";
    }
    return `Midtrans (${bookingData.paymentStatus})`;
  };

  const renderDueDate = () => {
    if (paymentMethod.includes("cash")) {
      return "Pending (Pay On Arrive)";
    }
    return `Paid on ${currentDate.toLocaleDateString("en-GB")}`;
  };

  if (!bookingData) return <p style={{ textAlign: "center" }}>Loading invoice...</p>

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f5f0",
        padding: "2rem 1rem",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <a
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              backgroundColor: "white",
              color: "#374151",
              textDecoration: "none",
              borderRadius: "6px",
              fontSize: "0.875rem",
              border: "1px solid #d1d5db",
              fontWeight: "500",
            }}
          >
            ← Back to Home
          </a>
          <button
            onClick={downloadPDF}
            disabled={!pdfReady}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1.25rem",
              backgroundColor: "rgb(208, 149, 0)",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.875rem",
              cursor: "pointer",
              fontWeight: "500",
            }}
          >
            📄 Download PDF
          </button>
        </div>
        {/* Invoice Card */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
        >
          <div
            id="invoice-content"
            style={{
              width: "794px",
              height: "1123px",
              padding: "40px",
              backgroundColor: "#ffffff",
              boxSizing: "border-box",
              fontFamily: "Arial, sans-serif",
              color: "#000",
              border: "1px solid #ddd",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              overflow: "hidden",
              margin: "0 auto",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1rem",
              }}
            >
              {/* Company Info with Logo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <img
                  src={Logo || "/placeholder.svg"}
                  alt="Golden Stay Hotel"
                  style={{
                    width: "60px",
                    height: "60px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
                <div>
                  <h1
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      color: "#1f2937",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    Golden Stay Hotel
                  </h1>
                  <p
                    style={{
                      fontSize: "1.125rem",
                      color: "#6b7280",
                      margin: "0",
                      fontWeight: "500",
                    }}
                  >
                    Hotels invoice
                  </p>
                </div>
              </div>
              {/* Company Address */}
              <div
                style={{
                  textAlign: "right",
                  fontSize: "0.875rem",
                  color: "#6b7280",
                  lineHeight: "1.6",
                }}
              >
                <div style={{ fontWeight: "600", color: "#1f2937" }}>Golden Stay</div>
                <div>123 Luxury Avenue</div>
                <div>Jakarta, Indonesia</div>
                <div>12345</div>
                <div>Indonesia</div>
              </div>
            </div>
            {/* Invoice Details Row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "2rem",
                marginBottom: "1rem",
                alignItems: "flex-start",
              }}
            >
              {/* Billed To */}
              <div>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#d09500",
                    marginBottom: "0.75rem",
                    margin: "0 0 0.75rem 0",
                  }}
                >
                  Billed To
                </h3>
                <div
                  style={{
                    fontSize: "0.875rem",
                    lineHeight: "1.6",
                    color: "#374151",
                  }}
                >
                  <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                    {bookingData.fullName || bookingData.fullname}
                  </div>
                  <div style={{ marginBottom: "0.25rem" }}>{bookingData.email}</div>
                  <div style={{ marginBottom: "0.25rem" }}>{bookingData.phone || bookingData.phoneNumber}</div>
                  <div style={{ marginBottom: "0.25rem" }}>{bookingData.address || "Address not provided"}</div>
                  <div>{bookingData.country}</div>
                </div>
              </div>
              {/* Date of Issue */}
              <div>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#d09500",
                    marginBottom: "0.75rem",
                    margin: "0 0 0.75rem 0",
                  }}
                >
                  Date of Issue
                </h3>
                <div style={{ fontSize: "0.875rem", color: "#374151" }}>{currentDate.toLocaleDateString("en-GB")}</div>
              </div>
              {/* Invoice Number */}
              <div>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#d09500",
                    marginBottom: "0.75rem",
                    margin: "0 0 0.75rem 0",
                  }}
                >
                  Invoice Number
                </h3>
                <div style={{ fontSize: "0.875rem", color: "#374151" }}>{invoiceNumber.replace("INV-", "")}</div>
              </div>
              {/* Amount Due */}
              <div>
                <h3
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#d09500",
                    marginBottom: "0.75rem",
                    margin: "0 0 0.75rem 0",
                  }}
                >
                  Amount Due (IDR)
                </h3>
                <div
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    color: "#1f2937",
                  }}
                >
                  Rp{totalAmount.toLocaleString("id-ID")}
                </div>
              </div>
            </div>
            {/* Payment Method */}
            <div style={{ marginBottom: "0.25rem" }}>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#d09500",
                  marginRight: "1rem",
                }}
              >
                Payment Method
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  color: "#374151",
                  backgroundColor: "#fef3c7",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "4px",
                  border: "1px solid #f59e0b",
                }}
              >
                {renderPaymentMethod()}
              </span>
            </div>
            {/* Due Date */}
            <div style={{ marginBottom: "1rem" }}>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  color: "#d09500",
                  marginRight: "1rem",
                }}
              >
                Due Date
              </span>
              <span style={{ fontSize: "0.875rem", color: "#374151" }}>{renderDueDate()}</span>
            </div>
            {/* Blue separator line */}
            <div
              style={{
                height: "2px",
                backgroundColor: "#d09500",
                marginBottom: "0.5rem",
              }}
            ></div>
            {/* Services Table */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "0.75rem 0",
                      textAlign: "left",
                      fontWeight: "600",
                      color: "#d09500",
                      fontSize: "0.875rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 0",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#d09500",
                      fontSize: "0.875rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Rate
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 0",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#d09500",
                      fontSize: "0.875rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Nights
                  </th>
                  <th
                    style={{
                      padding: "0.75rem 0",
                      textAlign: "right",
                      fontWeight: "600",
                      color: "#d09500",
                      fontSize: "0.875rem",
                      borderBottom: "1px solid #e5e7eb",
                    }}
                  >
                    Line Total
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      padding: "1rem 0",
                      color: "#374151",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <div style={{ fontWeight: "600", marginBottom: "0.5rem" }}>{bookingData.roomType}</div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {new Date(bookingData.checkinDate).toLocaleDateString()} -{" "}
                      {new Date(bookingData.checkoutDate).toLocaleDateString()}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#6b7280",
                        marginTop: "0.25rem",
                      }}
                    >
                      Booking ID: {bookingData.bookingId}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "1rem 0",
                      textAlign: "right",
                      color: "#374151",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    Rp{pricePerNight.toLocaleString("id-ID")}
                  </td>
                  <td
                    style={{
                      padding: "1rem 0",
                      textAlign: "right",
                      color: "#374151",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    {nights}
                  </td>
                  <td
                    style={{
                      padding: "1rem 0",
                      textAlign: "right",
                      color: "#374151",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    Rp{totalAmount.toLocaleString("id-ID")}
                  </td>
                </tr>
                {bookingData.specialRequests && (
                  <tr>
                    <td
                      style={{
                        padding: "1rem 0",
                        color: "#374151",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Special Requests</div>
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>{bookingData.specialRequests}</div>
                    </td>
                    <td
                      style={{
                        padding: "1rem 0",
                        textAlign: "right",
                        color: "#374151",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      -
                    </td>
                    <td
                      style={{
                        padding: "1rem 0",
                        textAlign: "right",
                        color: "#374151",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      -
                    </td>
                    <td
                      style={{
                        padding: "1rem 0",
                        textAlign: "right",
                        color: "#374151",
                        borderBottom: "1px solid #f3f4f6",
                      }}
                    >
                      Included
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {/* Summary Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                fontSize: "0.875rem",
                color: "#374151",
              }}
            >
              <span>Amount Paid</span>
              <span>{paymentMethod === "midtransfer" ? `Rp${totalAmount.toLocaleString("id-ID")}` : "Rp0"}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                fontSize: "1rem",
                color: "#d09500",
                fontWeight: "700",
                borderTop: "2px solid #d09500",
              }}
            >
              <span>Amount Due (IDR)</span>
              <span>{paymentMethod === "midtransfer" ? "Rp0" : `Rp${totalAmount.toLocaleString("id-ID")}`}</span>
            </div>
            {/* Thank You Message */}
            <div
              style={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "1.5rem",
                marginBottom: "0.5rem",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#374151",
                  lineHeight: "1.6",
                }}
              >
                <div style={{ marginBottom: "0.5rem", fontWeight: "600" }}>
                  Thank you for choosing Golden Stay Hotel!
                </div>
                <div>For any inquiries, please contact us at +62 21 1234 5678 or email info@goldenstay.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvoicePage