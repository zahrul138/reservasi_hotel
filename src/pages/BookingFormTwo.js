"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/* ─────────────────────────── helpers */
const generateSteps = (currentStep) => {
  const stepDefinitions = [
    { id: 1, name: "Guest Info" },
    { id: 2, name: "Confirmation" },
    { id: 3, name: "Success" },
  ];
  return stepDefinitions.map((step) => ({
    ...step,
    status:
      step.id < currentStep
        ? "complete"
        : step.id === currentStep
          ? "current"
          : "upcoming",
  }));
};

const formatCountryName = (code) => {
  const countries = {
    indonesia: "Indonesia",
    singapore: "Singapore",
    malaysia: "Malaysia",
    thailand: "Thailand",
    philippines: "Philippines",
    other: "Other",
  };
  return countries[code] || code;
};
/* ──────────────────────────────────── */

const BookingFormTwo = () => {
  /* ───────── state */
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [roomData, setRoomData] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({});
  const [formData, setFormData] = useState({});

  // New states for payment flow
  const [paymentFlow, setPaymentFlow] = useState(null);
  const [paymentResult, setPaymentResult] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const steps = generateSteps(2); // Move this line up here

  const location = useLocation();
  const navigate = useNavigate();

  /* ───────── Check for returning from Midtrans */
  useEffect(() => {
    const paymentMethod = localStorage.getItem("currentPaymentMethod");
    if (paymentMethod === "midtransfer") {
      const storedBooking = localStorage.getItem("draftBookingDetails");
      const storedForm = localStorage.getItem("draftFormData");

      if (storedBooking) setBookingDetails(JSON.parse(storedBooking));
      if (storedForm) setFormData(JSON.parse(storedForm));

      setPaymentMethod("midtransfer");
      localStorage.removeItem("currentPaymentMethod");
    }
  }, []);

  /* ───────── load state (draft / navigation state) */
  useEffect(() => {
    /* bookingDetails */
    if (location.state?.bookingDetails) {
      setBookingDetails(location.state.bookingDetails);
      localStorage.setItem(
        "draftBookingDetails",
        JSON.stringify(location.state.bookingDetails),
      );
    } else {
      const stored = localStorage.getItem("draftBookingDetails");
      if (stored) setBookingDetails(JSON.parse(stored));
    }

    /* formData */
    if (location.state?.formData) {
      setFormData(location.state.formData);
      localStorage.setItem(
        "draftFormData",
        JSON.stringify(location.state.formData),
      );
    } else {
      const stored = localStorage.getItem("draftFormData");
      if (stored) setFormData(JSON.parse(stored));
    }
  }, [location.state]);

  /* ───────── ambil data kamar */
  useEffect(() => {
    const fetchRoom = async () => {
      if (!bookingDetails.roomId) return;
      try {
        const res = await fetch(`https://localhost:7298/api/room/${bookingDetails.roomId}`);
        const data = await res.json();
        setRoomData(data);
      } catch (err) {
        console.error("Gagal mengambil data room:", err);
      }
    };
    fetchRoom();
  }, [bookingDetails.roomId]);

  /* ───────── hitung malam & total */
  const calculateNights = () => {
    const checkIn = new Date(bookingDetails.checkinDate);
    const checkOut = new Date(bookingDetails.checkoutDate);
    if (isNaN(checkIn) || isNaN(checkOut)) return 0;
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };
  const nights = calculateNights();
  const pricePerNight = roomData?.price || 0;
  const calculatedTotalPrice = pricePerNight * nights;

  /* ───────── inject script Midtrans Snap sekali saja */
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", "SB-Mid-client-ZrpuCE7yEUyWxexK");
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, []);

  /* ──────── Payment Handlers ──────── */
  const handlePaymentSuccess = async (result) => {
    setPaymentCompleted(true);

    let paymentStatus = "Complete";
    const paymentType = result.payment_type;

    if (paymentType === "bank_transfer") {
      const bank = result?.va_numbers?.[0]?.bank?.toUpperCase();
      paymentStatus = bank ? `Complete via Virtual Account - ${bank}` : "Complete via Bank Transfer";
    } else if (result.permata_va_number) {
      paymentStatus = "Complete via Permata Virtual Account";
    } else if (paymentType === "qris") {
      paymentStatus = "Complete via QRIS";
    } else if (paymentType === "gopay") {
      paymentStatus = "Complete via GoPay";
    } else if (paymentType === "shopeepay") {
      paymentStatus = "Complete via ShopeePay";
    } else if (result.transaction_status === "settlement") {
      paymentStatus = "Complete via " + (paymentType || "Midtrans");
    }

    // Standardize the booking payload structure
    const bookingPayload = {
      bookingId: `BK-${Date.now()}`,
      userId: bookingDetails.userId,
      fullName: formData.fullName, 
      fullname: formData.fullName, 
      email: formData.email,
      phone: formData.phone,
      phoneNumber: formData.phone, 
      country: formData.country,
      region: formData.country, 
      address: formData.address,
      checkinDate: bookingDetails.checkinDate,
      checkoutDate: bookingDetails.checkoutDate,
      roomType: bookingDetails.roomType,
      adultGuests: bookingDetails.adultGuests,
      childGuests: bookingDetails.childGuests,
      specialRequests: formData.specialRequests,
      specialRequest: formData.specialRequests, 
      paymentMethod: `Midtrans (${paymentType})`,
      paymentStatus: paymentStatus,
      pricePerNight: pricePerNight,
      nights: nights,
      totalPrice: calculatedTotalPrice,
      totalAmount: calculatedTotalPrice 
    };

    try {
      const res = await fetch("https://localhost:7298/api/Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });

      const resultBooking = await res.json();

      if (!res.ok) throw new Error(resultBooking.message || "Failed to save booking");

      // Simpan data yang sudah distandardisasi
      const invoiceData = {
        ...bookingPayload,
        bookingId: resultBooking.id || bookingPayload.bookingId
      };

      // Simpan ke localStorage dengan format yang konsisten
      localStorage.setItem("invoiceData", JSON.stringify(invoiceData));
      localStorage.setItem("paymentMethod", "midtransfer");

      // Hapus data draft
      localStorage.removeItem("draftBookingDetails");
      localStorage.removeItem("draftFormData");
      localStorage.removeItem("currentPaymentMethod");

      // Navigate ke halaman sukses
      navigate("/bookingformthree", {
        state: {
          bookingData: invoiceData,
          paymentMethod: "midtransfer"
        },
        replace: true
      });
    } catch (error) {
      console.error("Error saving booking:", error);
      alert("Pembayaran berhasil tetapi gagal menyimpan data booking. Silakan hubungi customer service.");
    }
  };

  const handleMidtransPayment = async () => {
    setIsLoading(true);
    setPaymentFlow('initiated');

    try {
      const snapRes = await fetch(
        "https://localhost:7298/api/payment/create-transaction",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: `ORDER-${bookingDetails.userId}-${Date.now()}`,
            amount: calculatedTotalPrice,
            customerName: formData.fullName,
            customerEmail: formData.email,
          }),
        }
      );
      const { token } = await snapRes.json();
      if (!snapRes.ok || !token) throw new Error("Gagal mendapatkan token");

      if (!window.snap || !window.snap.pay) {
        throw new Error("Midtrans Snap belum siap");
      }

      // Store form data before opening Midtrans popup
      localStorage.setItem("draftBookingDetails", JSON.stringify(bookingDetails));
      localStorage.setItem("draftFormData", JSON.stringify(formData));

      window.snap.pay(token, {
        onSuccess: (result) => {
          handlePaymentSuccess(result);
        },
        onPending: (result) => {
          setPaymentResult(result);
          setPaymentStatus('pending');
          setPaymentFlow('instructions');
          setShowPaymentModal(true);
          setIsLoading(false);
        },
        onError: (error) => {
          console.error("Payment error:", error);
          setPaymentStatus('failed');
          setPaymentFlow(null);
          setIsLoading(false);
          alert("Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.");
        },
        onClose: () => {
          // Hanya reset state, tidak navigate ke halaman lain
          setIsLoading(false);
          setPaymentFlow(null);

          // Hapus currentPaymentMethod dari localStorage karena pembayaran dibatalkan
          localStorage.removeItem("currentPaymentMethod");

          // Tampilkan pesan bahwa pembayaran dibatalkan
          alert("Pembayaran dibatalkan. Anda dapat mencoba lagi nanti.");
        }
      });
    } catch (error) {
      console.error("Error:", error);
      setPaymentStatus('failed');
      setPaymentFlow(null);
      setIsLoading(false);
      alert("Gagal memproses pembayaran. Silakan coba lagi.");
    }
  };

  const handleCashPayment = async () => {
    setIsLoading(true);

    const bookingPayload = {
      userId: bookingDetails.userId,
      fullname: formData.fullName,
      email: formData.email,
      checkinDate: bookingDetails.checkinDate,
      checkoutDate: bookingDetails.checkoutDate,
      roomType: bookingDetails.roomType,
      adultGuests: bookingDetails.adultGuests,
      childGuests: bookingDetails.childGuests,
      specialRequest: formData.specialRequests,
      totalPrice: calculatedTotalPrice,
      phoneNumber: formData.phone,
      region: formData.country,
      address: formData.address,
      paymentMethod: "Cash Payment",
      paymentStatus: "Pending (Pay On Arrive)",
      pricePerNight,
    };

    try {
      const res = await fetch("https://localhost:7298/api/Booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingPayload),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Failed to save booking");

      localStorage.removeItem("draftBookingDetails");
      localStorage.removeItem("draftFormData");

      navigate("/bookingformthree", {
        state: {
          bookingData: {
            ...bookingPayload,
            bookingId: result.id,
            nights,
            totalAmount: calculatedTotalPrice,
          },
          paymentMethod: "cash",
        },
      });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  const checkPaymentStatus = async (orderId) => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://localhost:7298/api/payment/status?orderId=${orderId}`);
      const data = await response.json();

      if (data.status === 'settlement') {
        setPaymentCompleted(true); // Set payment completed
        handlePaymentSuccess(data);
      } else {
        alert('Pembayaran belum terkonfirmasi. Silakan tunggu beberapa saat.');
      }
    } catch (error) {
      console.error('Error checking payment:', error);
      alert('Gagal memeriksa status pembayaran. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ───────── submit / confirm */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsAccepted) {
      alert("Harap setujui syarat dan ketentuan");
      return;
    }

    if (paymentMethod === "cash") {
      await handleCashPayment();
    } else {
      await handleMidtransPayment();
    }
  };

  return (
    <>
      <style jsx>{`
        /* Base Styles */
        :root {
          --primary-color: #d09500;
          --primary-hover: #87723b;
          --text-color: #333;
          --text-muted: #666;
          --border-color: #e2e8f0;
          --bg-color: #f8f5f0;
          --card-bg: #fff;
          --success-color: #2ecc71;
          --error-color: #e74c3c;
          --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        body {
          font-family: var(--font-family);
          color: var(--text-color);
          line-height: 1.5;
        }

        /* Layout */
        .booking-process {
          min-height: 100vh;
          background-color: var(--bg-color);
          padding: 3rem 1rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 2rem;
          text-align: center;
        }

        .title {
          font-size: 2rem;
          font-weight: 700;
          color: var(--primary-hover);
          margin-bottom: 0.5rem;
        }

        .subtitle {
          color: var(--text-muted);
        }

        .centered-grid {
          display: flex;
          justify-content: center;
        }

        .centered-grid .confirmation-wrapper {
          width: 100%;
          max-width: 800px;
        }

        .content-grid.centered {
          display: flex;
          justify-content: center;
        }

        .content-grid.centered .main-content {
          width: 100%;
          max-width: 800px;
        }

        .centered-content {
          width: 100%;
          max-width: 800px;
        }

        /* Progress Bar */
        .progress-bar {
          margin-bottom: 2.5rem;
        }

        .steps {
          display: flex;
          list-style: none;
        }

        .step {
          position: relative;
          flex: 1;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .step-circle {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          z-index: 1;
        }

        .step.complete .step-circle {
          background-color: var(--primary-color);
          color: white;
        }

        .step.current .step-circle {
          border: 2px solid var(--primary-color);
          background-color: white;
        }

        .step.upcoming .step-circle {
          border: 2px solid var(--border-color);
          background-color: white;
        }

        .step-dot {
          width: 0.625rem;
          height: 0.625rem;
          border-radius: 50%;
          background-color: var(--primary-color);
        }

        .step.upcoming .step-dot {
          background-color: transparent;
        }

        .step-line {
          position: absolute;
          top: 1rem;
          left: 50%;
          width: 100%;
          height: 2px;
          background-color: var(--border-color);
          z-index: 0;
        }

        .step-line.complete {
          background-color: var(--primary-color);
        }

        .step-name {
          font-size: 0.875rem;
          font-weight: 500;
          margin-top: 0.25rem;
        }

        .step.complete .step-name {
          color: var(--primary-color);
        }

        .step.current .step-name {
          color: var(--primary-hover);
          font-weight: 600;
        }

        .step.upcoming .step-name {
          color: var(--text-muted);
        }

        /* Cards */
        .card {
          background-color: var(--card-bg);
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .card-header {
          margin-bottom: 1.5rem;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary-hover);
          margin-bottom: 0.5rem;
        }

        .card-subtitle {
          color: var(--text-muted);
          font-size: 0.875rem;
        }

        /* Buttons */
        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 0.25rem;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }

        .btn-primary:hover {
          background-color: var(--primary-hover);
        }

        .btn-outline {
          background-color: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-color);
        }

        .btn-outline:hover {
          background-color: #f1f5f9;
        }

        .btn-block {
          display: block;
          width: 100%;
        }

        .btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Confirmation Details */
        .confirmation-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .confirmation-wrapper .card {
          max-width: 800px;
          width: 100%;
        }

        .confirmation-details {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .detail-section {
          margin-bottom: 1rem;
        }

        .section-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--primary-hover);
          margin-bottom: 1rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .detail-with-icon {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-icon {
          font-size: 1rem;
          color: var(--primary-color);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .detail-item {
          margin-bottom: 1rem;
        }

        .detail-value {
          margin-top: 0.25rem;
          padding-left: 1.5rem;
        }

        .detail-label {
          font-weight: 500;
        }

        /* Payment Methods */
        .payment-methods {
          margin-bottom: 1.5rem;
        }

        .payment-method {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.75rem;
          border-radius: 0.25rem;
          cursor: pointer;
        }

        .payment-method:hover {
          background-color: #f1f5f9;
        }

        .payment-method input {
          margin-right: 0.75rem;
        }

        .payment-method label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0;
          cursor: pointer;
        }

        .payment-icon {
          font-size: 1.25rem;
        }

        .payment-details {
          background-color: #f9fafb;
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
          padding: 1.5rem;
          margin-top: 1.5rem;
        }

        .payment-info {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-bottom: 1rem;
        }

        .payment-note {
          color: var(--text-muted);
          font-size: 0.875rem;
          margin-top: 0.5rem;
        }

        .price-summary {
          background-color: var(--bg-color);
          border-radius: 0.25rem;
          padding: 1rem;
          margin-bottom: 1rem;
        }

        .price-summary .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .price-summary .total {
          font-size: 1rem;
          margin-top: 0.5rem;
        }

        .total {
          font-weight: 700;
          font-size: 1.125rem;
        }

        .total-price {
          color: var(--primary-color);
        }

        .important-info {
          border: 1px solid var(--border-color);
          border-radius: 0.25rem;
          padding: 1rem;
          background-color: #f9fafb;
        }

        .info-item {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .info-icon {
          color: var(--success-color);
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .terms-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          margin: 1.5rem 0;
        }

        .terms-checkbox input {
          margin-top: 0.25rem;
        }

        .terms-checkbox label {
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .link {
          color: var(--primary-color);
          text-decoration: none;
        }

        .link:hover {
          text-decoration: underline;
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .booking-process {
            padding: 2rem 1rem;
          }

          .title {
            font-size: 1.5rem;
          }

          .steps {
            flex-direction: column;
            gap: 1rem;
          }

          .step {
            display: flex;
            align-items: center;
          }

          .step-content {
            flex-direction: row;
            align-items: center;
            gap: 1rem;
          }

          .step-line {
            display: none;
          }

          .detail-grid {
            grid-template-columns: 1fr;
          }
        }

        /* Utility Classes */
        hr {
          border: 0;
          height: 1px;
          background-color: var(--border-color);
          margin: 1rem 0;
        }
      `}</style>

      <div className="booking-process">
        <div className="container">
          <div className="header">
            <h1 className="title">Complete Your Booking</h1>
            <p className="subtitle">
              Please fill in your details to confirm your reservation
            </p>
          </div>

          {/* Booking Progress Bar */}
          <div className="progress-bar">
            <ol className="steps">
              {steps.map((step, stepIdx) => (
                <li key={step.id} className={`step ${step.status}`}>
                  <div className="step-content">
                    <span className="step-circle">
                      {step.status === "complete" ? (
                        <span className="icon">✓</span>
                      ) : (
                        <span className="step-dot"></span>
                      )}
                    </span>
                    {stepIdx !== steps.length - 1 && (
                      <span
                        className={`step-line ${step.status === "complete" ? "complete" : ""
                          }`}
                      ></span>
                    )}
                    <span className="step-name">{step.name}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="content-grid centered">
            {/* Confirmation Details */}
            <div className="confirmation-wrapper">
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Booking Details</h2>
                  <p className="card-subtitle">
                    Booking ID: {bookingDetails.bookingId}
                  </p>
                </div>

                <div className="confirmation-details">
                  {/* Room Details */}
                  <div className="detail-section">
                    <div className="detail-row">
                      <span className="detail-label">Room Type:</span>
                      <span>{bookingDetails.roomType}</span>
                    </div>
                    <hr />
                    <div className="detail-row">
                      <div className="detail-with-icon">
                        <span className="detail-icon">📅</span>
                        <span>Check-in:</span>
                      </div>
                      <span>
                        {bookingDetails.checkinDate
                          ? new Date(
                            bookingDetails.checkinDate
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "-"}
                      </span>
                    </div>
                    <div className="detail-row">
                      <div className="detail-with-icon">
                        <span className="detail-icon">📅</span>
                        <span>Check-out:</span>
                      </div>
                      <span>
                        {bookingDetails.checkoutDate
                          ? new Date(
                            bookingDetails.checkoutDate
                          ).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                          : "-"}
                      </span>
                    </div>
                    <div className="detail-row">
                      <div className="detail-with-icon">
                        <span className="detail-icon">👤</span>
                        <span>Guests:</span>
                      </div>
                      <span>
                        {bookingDetails.adultGuests || 0} Adults,{" "}
                        {bookingDetails.childGuests || 0} Children
                      </span>
                    </div>
                    <hr />
                  </div>

                  {/* Guest Information */}
                  <div className="detail-section">
                    <h3 className="section-title">Guest Information</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <div className="detail-with-icon">
                          <span className="detail-icon">👤</span>
                          <span className="detail-label">Full Name:</span>
                        </div>
                        <p className="detail-value">{formData.fullName}</p>
                      </div>
                      <div className="detail-item">
                        <div className="detail-with-icon">
                          <span className="detail-icon">📧</span>
                          <span className="detail-label">Email:</span>
                        </div>
                        <p className="detail-value">{formData.email}</p>
                      </div>
                      <div className="detail-item">
                        <div className="detail-with-icon">
                          <span className="detail-icon">📱</span>
                          <span className="detail-label">Phone:</span>
                        </div>
                        <p className="detail-value">{formData.phone}</p>
                      </div>
                      <div className="detail-item">
                        <div className="detail-with-icon">
                          <span className="detail-icon">🌐</span>
                          <span className="detail-label">Country:</span>
                        </div>
                        <p className="detail-value">
                          {formatCountryName(formData.country)}
                        </p>
                      </div>
                    </div>

                    <div className="detail-item">
                      <div className="detail-with-icon">
                        <span className="detail-icon">📍</span>
                        <span className="detail-label">Address:</span>
                      </div>
                      <p className="detail-value">
                        {formData.address || "Not provided"}
                      </p>
                    </div>

                    {formData.specialRequests && (
                      <div className="detail-item">
                        <div className="detail-with-icon">
                          <span className="detail-icon">✓</span>
                          <span className="detail-label">
                            Special Requests:
                          </span>
                        </div>
                        <p className="detail-value">
                          {formData.specialRequests}
                        </p>
                      </div>
                    )}

                    <hr />
                  </div>

                  {/* Payment Method */}
                  <div className="detail-section">
                    <h3 className="section-title">Payment Method</h3>

                    <div className="payment-methods">
                      <div className="payment-method">
                        <input
                          type="radio"
                          id="cash"
                          name="paymentMethod"
                          value="cash"
                          checked={paymentMethod === "cash"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="cash">
                          <span className="payment-icon">💵</span>
                          <span>Cash Payment</span>
                        </label>
                      </div>

                      <div className="payment-method">
                        <input
                          type="radio"
                          id="midtransfer"
                          name="paymentMethod"
                          value="midtransfer"
                          checked={paymentMethod === "midtransfer"}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                        <label htmlFor="midtransfer">
                          <span className="payment-icon">💳</span>
                          <span>MidTransfer</span>
                        </label>
                      </div>
                    </div>

                    {paymentMethod === "midtransfer" && (
                      <div className="payment-details">
                        <div className="payment-info">
                          You will be redirected to MidTransfer's secure payment
                          gateway to complete your transaction. Multiple payment
                          methods are available including credit cards, bank
                          transfers, and e-wallets.
                        </div>
                      </div>
                    )}

                    {paymentMethod === "cash" && (
                      <div className="payment-details">
                        <div className="payment-info">
                          You have selected cash payment. Payment will be
                          collected upon check-in at the hotel reception.
                        </div>
                        <div className="payment-note">
                          Please ensure you have the exact amount ready for a
                          smooth check-in process.
                        </div>
                      </div>
                    )}

                    <hr />
                  </div>

                  {/* Price Summary */}
                  <div className="price-summary">
                    <div className="detail-row">
                      <span>Room Rate:</span>
                      <span>
                        Rp {pricePerNight.toLocaleString("id-ID")} × {nights}{" "}
                        nights
                      </span>
                    </div>
                    <hr />
                    <div className="detail-row total">
                      <span>Total Paid:</span>
                      <span className="total-price">
                        <strong>
                          Rp {calculatedTotalPrice.toLocaleString("id-ID")}
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="important-info">
                    <h3 className="section-title">Important Information</h3>
                    <div className="info-item">
                      <span className="info-icon">✓</span>
                      <span>
                        Check-in time starts at 3:00 PM. If you plan to arrive
                        after 6:00 PM, please notify the hotel.
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">✓</span>
                      <span>
                        Check-out time is 12:00 PM. Late check-out may result in
                        an additional charge.
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">✓</span>
                      <span>
                        Please present a valid ID and the credit card used for
                        booking upon check-in.
                      </span>
                    </div>
                    <div className="info-item">
                      <span className="info-icon">✓</span>
                      <span>
                        Free cancellation is available up to 48 hours before
                        check-in.
                      </span>
                    </div>
                  </div>
                </div>

                <div className="terms-checkbox">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  <label htmlFor="terms">
                    I agree to the{" "}
                    <a href="#" className="link">
                      terms and conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="link">
                      privacy policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={!termsAccepted || isLoading}
                  className={`btn btn-primary btn-block ${!termsAccepted || isLoading ? "disabled" : ""
                    }`}
                >
                  {isLoading ? "Processing..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Instructions Modal */}
      {showPaymentModal && paymentResult && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              className="modal-close"
              onClick={() => setShowPaymentModal(false)}
            >
              ×
            </button>
            <h3 className="modal-title">Payment Instructions</h3>

            <div className="payment-instructions">
              {paymentResult.payment_type === "bank_transfer" && (
                <>
                  <p>Please complete your payment via bank transfer using the details below:</p>

                  <div className="va-details">
                    <div className="detail-label">Bank Name:</div>
                    <div className="va-number">
                      {paymentResult.va_numbers?.[0]?.bank?.toUpperCase() || 'Permata'}
                    </div>

                    <div className="detail-label">Virtual Account Number:</div>
                    <div className="va-number">
                      {paymentResult.va_numbers?.[0]?.va_number || paymentResult.permata_va_number}
                    </div>

                    <div className="detail-row">
                      <span>Amount:</span>
                      <span>Rp {calculatedTotalPrice.toLocaleString("id-ID")}</span>
                    </div>

                    <button
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(paymentResult.va_numbers?.[0]?.va_number || paymentResult.permata_va_number);
                        alert('Virtual account number copied to clipboard!');
                      }}
                    >
                      Copy VA Number
                    </button>
                  </div>

                  <div className="instruction-step">
                    <div className="instruction-number">1</div>
                    <div>
                      Open your mobile banking app or visit the nearest ATM
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-number">2</div>
                    <div>
                      Select "Transfer" and choose "{paymentResult.va_numbers?.[0]?.bank || 'Permata'}" as the destination bank
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-number">3</div>
                    <div>
                      Enter the virtual account number above
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-number">4</div>
                    <div>
                      Enter the exact amount: Rp {calculatedTotalPrice.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-number">5</div>
                    <div>
                      Complete the transaction and wait for confirmation
                    </div>
                  </div>
                </>
              )}

              {paymentResult.payment_type === "qris" && (
                <>
                  <p>Please complete your payment by scanning the QR code below:</p>
                  <div style={{ textAlign: 'center', margin: '1.5rem 0' }}>
                    <img
                      src={paymentResult.qr_code_url}
                      alt="QRIS Payment Code"
                      style={{ maxWidth: '200px', margin: '0 auto' }}
                    />
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-number">1</div>
                    <div>
                      Open your mobile banking or e-wallet app with QRIS support
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-number">2</div>
                    <div>
                      Scan the QR code above
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-number">3</div>
                    <div>
                      Confirm the amount: Rp {calculatedTotalPrice.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="instruction-step">
                    <div className="instruction-number">4</div>
                    <div>
                      Complete the payment
                    </div>
                  </div>
                </>
              )}

              <div className="payment-note" style={{ marginTop: '1.5rem' }}>
                Your booking will be confirmed automatically once payment is received.
                This may take a few minutes. You'll receive a confirmation email.
              </div>
            </div>

            <button
              className="btn btn-primary btn-block"
              onClick={() => checkPaymentStatus(paymentResult.order_id)}
            >
              I've Completed Payment
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingFormTwo;