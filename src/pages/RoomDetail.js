"use client"

// pages/RoomDetail.js
import { useState, useRef, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  FaArrowLeft,
  FaArrowRight,
  FaBath,
  FaBed,
  FaCalendarAlt,
  FaCheck,
  FaChevronDown,
  FaCoffee,
  FaCreditCard,
  FaDoorOpen,
  FaHotel,
  FaMapMarkerAlt,
  FaShower,
  FaStar,
  FaTv,
  FaUserFriends,
  FaWifi,
  FaWineGlassAlt,
} from "react-icons/fa"

function RoomDetail() {
  // Untuk memastikan data yang tampil adalah teks bersih
  const parseSafe = (value) => {
    if (Array.isArray(value)) return value
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value)
        if (Array.isArray(parsed)) return parsed
        return value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      } catch {
        return value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean)
      }
    }
    return []
  }

  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const guestDropdownRef = useRef(null)
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate()

  // Fetch room data from API
  useEffect(() => {
    fetch(`https://localhost:7298/api/room/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRoom({
          ...data,
          images: [data.image1, data.image2, data.image3]
            .filter(Boolean)
            .map((img) => (img.startsWith("http") ? img : `https://localhost:7298${img}`)),
          features: parseSafe(data.features),
          amenities: parseSafe(data.amenities).map((name) => {
            const iconObj = {
              "High-speed Wi-Fi": <FaWifi />,
              "Smart TV with streaming": <FaTv />,
              "Coffee machine": <FaCoffee />,
              "Rainfall shower": <FaShower />,
              Minibar: <FaWineGlassAlt />,
              "Room service": <FaDoorOpen />,
              "Luxury bathroom": <FaBath />,
              "Premium bedding": <FaBed />,
            }
            return { icon: iconObj[name] || <FaCheck />, name }
          }),
          policies: parseSafe(data.policies),
          reviews: [],
          similarRooms: [],
        })
      })
    const user = localStorage.getItem("user")
    if (user) setIsLoggedIn(true)
  }, [id])

  useEffect(() => {
    const fetchRoomReviews = async () => {
      try {
        const response = await fetch(`https://localhost:7298/api/Review/room/${id}/approved`);
        if (!response.ok) throw new Error('Failed to fetch reviews');
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error('Error fetching room reviews:', error);
      }
    };

    if (id) {
      fetchRoomReviews();
    }
  }, [id]);

  // --- Booking Logic ---
  const totalGuests = adults + children
  const toggleGuestDropdown = () => setIsGuestDropdownOpen(!isGuestDropdownOpen)
  const incrementAdults = () => setAdults(adults + 1)
  const decrementAdults = () => setAdults(adults > 1 ? adults - 1 : 1)
  const incrementChildren = () => setChildren(children + 1)
  const decrementChildren = () => setChildren(children > 0 ? children - 1 : 0)

  const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number)

  const calculateTotalPrice = () => {
    if (!room) return 0
    const roomPricePerNight = Number.parseFloat(room.price) || 0
    const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0
    return roomPricePerNight * nights
  }

  const handleBookNow = (e) => {
    e.preventDefault()
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      alert("You must be logged in to make a booking.")
      return
    }
    if (!checkIn || !checkOut) {
      alert("Isi tanggal check-in dan check-out!")
      return
    }
    const user = JSON.parse(storedUser)
    const totalPrice = calculateTotalPrice()
    const bookingDetails = {
      userId: user.id,
      fullname: user.fullname,
      email: user.email,
      checkinDate: checkIn,
      checkoutDate: checkOut,
      roomType: room.title,
      roomId: room.id,
      adultGuests: adults,
      childGuests: children,
      totalPrice: totalPrice,
    }
    navigate("/bookingformone", { state: { bookingDetails } })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setIsGuestDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [guestDropdownRef])

  // Gallery Navigation
  const nextImage = () => setCurrentImage((prev) => (prev === (room?.images?.length || 1) - 1 ? 0 : prev + 1))
  const prevImage = () => setCurrentImage((prev) => (prev === 0 ? (room?.images?.length || 1) - 1 : prev - 1))
  const selectImage = (index) => setCurrentImage(index)
  const openGallery = (idx = 0) => {
    setCurrentImage(idx)
    setGalleryOpen(true)
    document.body.style.overflow = "hidden"
  }
  const closeGallery = () => {
    setGalleryOpen(false)
    document.body.style.overflow = "auto"
  }

  if (!room) return <div style={{ color: "#D09500", textAlign: "center", marginTop: 100 }}>Loading...</div>

  // Calculate average rating
  const averageRating = reviews.reduce((total, review) => total + review.rating, 0) / reviews.length

  return (
    <div className="room-detail-page">
      <style>{`
        /* Room Detail Page Styles */
        .room-detail-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* Room Gallery Hero */
        .room-gallery-hero {
          width: 100%;
          height: 500px;
          overflow: hidden;
          margin-top: 150px;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 0.5rem;
          height: 100%;
        }
        .gallery-main,
        .gallery-item {
          height: 100%;
          width: 100%;
          position: relative;
          cursor: pointer;
          overflow: hidden;
          aspect-ratio: 4/1; 
          overflow: hidden;
        }
        .gallery-secondary {
          display: grid;
          grid-template-rows: repeat(2, 1fr);
          gap: 0.5rem;
          height: 100%;
        }
        .gallery-main img,
        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .gallery-main:hover img,
        .gallery-item:hover img {
          transform: scale(1.05);
        }
        .gallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 1rem;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
          color: white;
          opacity: 0;
          transition: opacity 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .gallery-overlay span {
          background-color: rgba(0, 0, 0, 0.5);
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          font-weight: 500;
        }
        .gallery-main:hover .gallery-overlay,
        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        /* Room Overview */
        .room-overview {
          padding: 2rem 0;
          background-color: white;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2.5rem;
        }

        .room-title-section {
          margin-bottom: 2rem;
        }

        .room-title-section h1 {
          font-size: 2.5rem;
          color: #87723b;
          margin-bottom: 1rem;
        }

        .room-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .star-filled {
          color: #d09500;
        }

        .star-empty {
          color: #ccc;
        }

        .rating-count {
          color: #666;
          font-size: 0.9rem;
        }

        .room-short-desc {
          font-size: 1.1rem;
          color: #666;
          line-height: 1.6;
        }

        .room-highlights {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
          background-color: #f8f5f0;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .highlight-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .highlight-icon {
          font-size: 1.5rem;
          color: #d09500;
        }

        .highlight-text {
          display: flex;
          flex-direction: column;
        }

        .highlight-label {
          font-size: 0.85rem;
          color: #666;
        }

        .highlight-value {
          font-weight: 600;
          color: #333;
        }

        /* Booking Card */
        .booking-card {
          background-color: #f8f5f0;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 2rem;
        }

        .price-container {
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .current-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .price {
          font-size: 2.5rem;
          font-weight: 700;
          color: #d09500;
        }

        .per-night {
          font-size: 1rem;
          color: #666;
        }

        .original-price {
          font-size: 1.2rem;
          color: #999;
          text-decoration: line-through;
          margin-bottom: 0.5rem;
        }

        .price-savings {
          font-size: 0.9rem;
          color: #2ecc71;
          font-weight: 500;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #87723b;
          font-size: 0.9rem;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
          background-color: white;
        }

        .form-group input:focus {
          outline: none;
          border-color: #d09500;
          box-shadow: 0 0 0 3px rgba(208, 149, 0, 0.15);
        }

        .booking-summary {
          background-color: white;
          padding: 1.5rem;
          border-radius: 4px;
          margin-top: 1rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          color: #666;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          padding-top: 0.75rem;
          border-top: 1px solid #e2e8f0;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .book-now-btn {
          width: 100%;
          padding: 1rem;
          background-color: #d09500;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .book-now-btn:hover {
          background-color: #87723b;
        }

        .booking-policies {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .policy-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          color: #666;
        }

        .policy-icon {
          color: #2ecc71;
          font-size: 0.8rem;
        }

        /* Guest Selector */
        .guest-selector {
          position: relative;
          width: 100%;
        }

        .guest-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          background-color: white;
        }

        .guest-display .rotate {
          transform: rotate(180deg);
          transition: transform 0.3s;
        }

        .guest-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          background-color: white;
          border-radius: 4px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          padding: 1rem;
          margin-top: 0.5rem;
          z-index: 10;
          border: 1px solid #e2e8f0;
        }

        .guest-type-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.5rem 0;
        }

        .guest-type-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
        }

        .guest-counter {
          display: flex;
          align-items: center;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .guest-counter button {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f8f5f0;
          border: none;
          font-size: 1rem;
          cursor: pointer;
        }

        .counter-value {
          width: 40px;
          text-align: center;
          padding: 0.25rem;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .apply-btn {
          width: 100%;
          padding: 0.75rem;
          background-color: #d09500;
          color: white;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          cursor: pointer;
        }

        /* Room Details Tabs */
        .room-details {
          padding: 4rem 0;
          background-color: #f8f5f0;
        }

        .details-tabs {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 1rem;
        }

        .details-tabs button {
          padding: 0.75rem 1.5rem;
          background-color: transparent;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          color: #666;
          transition: all 0.3s;
        }

        .details-tabs button.tab-active {
          background-color: #d09500;
          color: white;
        }

        .details-content {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .description-content p {
          color: #666;
          line-height: 1.8;
          margin-bottom: 1.5rem;
        }

        .room-features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-top: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .feature-icon {
          color: #d09500;
          font-size: 0.8rem;
        }

        /* Amenities Content */
        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .amenity-card {
          background-color: #f8f5f0;
          padding: 1.5rem;
          border-radius: 8px;
          text-align: center;
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .amenity-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }

        .amenity-icon {
          font-size: 2rem;
          color: #d09500;
          margin-bottom: 1rem;
        }

        .amenity-card h3 {
          font-size: 1rem;
          color: #87723b;
        }

        /* Policies Content */
        .policies-list {
          list-style: none;
          padding: 0;
        }

        .policies-list .policy-item {
          padding: 1rem 0;
          border-bottom: 1px solid #e2e8f0;
          font-size: 1rem;
        }

        .policies-list .policy-item:last-child {
          border-bottom: none;
        }

        /* Reviews Content */
        .reviews-summary {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }

        .average-rating {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .rating-number {
          font-size: 3rem;
          font-weight: 700;
          color: #d09500;
        }

        .rating-stars {
          display: flex;
          gap: 0.25rem;
          font-size: 1.2rem;
        }

        .rating-count {
          color: #666;
          font-size: 0.9rem;
        }

        .reviews-list {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }

        .review-card {
          background-color: #f8f5f0;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .reviewer-name {
          font-weight: 600;
          color: #87723b;
        }

        .review-date {
          font-size: 0.875rem;
          color: #666;
        }

        .review-rating {
          margin-bottom: 1rem;
          display: flex;
          gap: 0.25rem;
        }

        .review-comment {
          color: #666;
          line-height: 1.7;
        }

        /* Similar Rooms */
        .similar-rooms {
          padding: 2rem 0;
          background-color: white;
          width: 95%;            
          max-width: 1200px;     
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.25rem;
          color: #87723b;
          margin-bottom: 1rem;
        }

        .section-header p {
          max-width: 700px;
          margin: 0 auto;
          color: #666;
          font-size: 1.1rem;
        }

        .similar-rooms .container {
          max-width: 600px;
          margin: 0 auto;
        }

        .similar-rooms-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(300px, 1fr));
          gap: 2rem;
          justify-content: center;
        }

        .similar-room-card {
          max-width: 300px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s, box-shadow 0.3s;
        }

        .similar-room-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .similar-room-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .similar-room-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .similar-room-card:hover .similar-room-image img {
          transform: scale(1.05);
        }

        .similar-room-price {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background-color: #d09500;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          font-weight: 600;
        }

        .similar-room-details {
          padding: 1.5rem;
        }

        .similar-room-details h3 {
          font-size: 1.3rem;
          color: #87723b;
          margin-bottom: 0.75rem;
        }

        .similar-room-details p {
          color: #666;
          margin-bottom: 1.25rem;
          font-size: 0.95rem;
        }

        .similar-room-details .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .similar-room-details .btn-outline {
          background-color: transparent;
          color: #d09500;
          border: 1px solid #d09500;
        }

        .similar-room-details .btn-outline:hover {
          background-color: #d09500;
          color: white;
        }

        /* Call to Action Section */
        .cta-section {
          background: linear-gradient(135deg, #87723b, #d09500);
          color: white;
          padding: 5rem 0;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1.25rem;
          color: white;
        }

        .cta-content p {
          font-size: 1.25rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .btn-primary {
          background-color: white;
          color: #d09500;
          border: none;
          padding: 1rem 2rem;
          border-radius: 4px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-primary:hover {
          background-color: rgba(255, 255, 255, 0.9);
          transform: translateY(-3px);
        }

        .btn-secondary {
          background-color: transparent;
          color: white;
          border: 2px solid white;
          padding: 1rem 2rem;
          border-radius: 4px;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-3px);
        }

        /* Gallery Modal */
        .gallery-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          overflow-y: auto;
          padding:  60px 0 200px 0; 
        }

        .modal-content {
          position: relative;
          max-width: 90%;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 150px;
        }

        .modal-image {
          width: 800px; 
          height: 500px;
          object-fit: cover;
          border-radius: 4px;
        }

        .modal-close {
          position: absolute;
          top: -40px;
          right: 0;
          color: white;
          font-size: 2rem;
          background: none;
          border: none;
          cursor: pointer;
        }

        .modal-caption {
          margin-top: 1rem;
          color: white;
          font-size: 1.1rem;
        }

        .modal-nav {
          position: absolute;
          top: 40%;
          width: 110%;
          display: flex;
          justify-content: space-between;
          padding: 0 20px;
          transform: translateY(-50%);
        }

        .modal-nav-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-nav-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .modal-thumbnails {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          overflow-x: auto;
          max-width: 100%;
          padding: 0.5rem;
        }

        .modal-thumbnail {
          width: 120px;
          height: 80px;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.6;
          transition: opacity 0.3s;
          flex-shrink: 0;
        }

        .modal-thumbnail.active {
          opacity: 1;
          border: 2px solid #d09500;
        }

        .modal-thumbnail:hover {
          opacity: 1;
        }

        .modal-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Responsive Styles */
        @media (max-width: 1024px) {
          .overview-grid {
            grid-template-columns: 1fr;
          }

          .booking-card {
            position: static;
            margin-top: 2rem;
          }

          .amenities-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .reviews-list {
            grid-template-columns: 1fr;
          }

          .similar-rooms-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .room-features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .gallery-grid {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr;
            height: auto;
          }

          .gallery-main {
            grid-column: 1 / 2;
            grid-row: 1 / 2;
            height: 300px;
          }

          .gallery-secondary {
            grid-column: 1 / 2;
            grid-row: 2 / 3;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: 1fr;
            height: 100px;
          }

          .room-highlights {
            grid-template-columns: 1fr;
          }

          .amenities-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .cta-buttons {
            flex-direction: column;
            max-width: 300px;
            margin: 0 auto;
          }

          .details-tabs {
            flex-wrap: wrap;
          }

          .details-tabs button {
            flex: 1 0 40%;
          }
        }

        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .amenities-grid {
            grid-template-columns: 1fr;
          }

          .similar-rooms-grid {
            grid-template-columns: 1fr;
          }

          .gallery-secondary {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);
            height: 150px;
          }

          .room-title-section h1 {
            font-size: 2rem;
          }

          .details-tabs button {
            flex: 1 0 100%;
          }

          .review-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
          }

          .review-card {
            background-color: #f8f5f0;
            padding: 1.5rem;
            border-radius: 8px;
            margin-bottom: 1rem;
          }

          .review-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
          }
        }
      `}</style>
      <div className="room-detail-page">
        {/* Gallery Hero */}
        <section className="room-gallery-hero">
          <div className="gallery-grid">
            <div className="gallery-main" onClick={() => openGallery(0)}>
              <img src={room.images[0] || "/placeholder.svg"} alt={`${room.title} - Main View`} />
              <div className="gallery-overlay">
                <span>View All Photos</span>
              </div>
            </div>
            <div className="gallery-secondary">
              {room.images.slice(1, 3).map((img, i) => (
                <div key={i} className="gallery-item" onClick={() => openGallery(i + 1)}>
                  <img src={img || "/placeholder.svg"} alt={`${room.title} - View ${i + 2}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Fullscreen Gallery */}
        {galleryOpen && (
          <div className="gallery-modal" onClick={closeGallery}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={room.images[currentImage] || "/placeholder.svg"}
                alt={`${room.title} - View ${currentImage + 1}`}
                className="modal-image"
              />
              <button className="modal-close" onClick={closeGallery}>
                ×
              </button>
              <div className="modal-caption">{`${room.title} - Image ${currentImage + 1} of ${room.images.length}`}</div>
              <div className="modal-nav">
                <button className="modal-nav-button" onClick={prevImage}>
                  <FaArrowLeft />
                </button>
                <button className="modal-nav-button" onClick={nextImage}>
                  <FaArrowRight />
                </button>
              </div>
              <div className="modal-thumbnails">
                {room.images.map((image, index) => (
                  <div
                    key={index}
                    className={`modal-thumbnail ${currentImage === index ? "active" : ""}`}
                    onClick={() => selectImage(index)}
                  >
                    <img src={image || "/placeholder.svg"} alt={`${room.title} - Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Room Overview */}
        <section className="room-overview">
          <div className="container">
            <div className="overview-grid">
              <div className="room-info">
                <div className="room-title-section">
                  <h1>{room.title}</h1>
                  <div className="room-rating">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.round(averageRating) ? "star-filled" : "star-empty"} />
                    ))}
                    <span className="rating-count">({reviews.length} reviews)</span>
                  </div>
                  <p className="room-short-desc">{room.shortDescription}</p>
                </div>

                <div className="room-highlights">
                  <div className="highlight-item">
                    <FaUserFriends className="highlight-icon" />
                    <div className="highlight-text">
                      <span className="highlight-label">Occupancy</span>
                      <span className="highlight-value">{room.occupancy}</span>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <FaBed className="highlight-icon" />
                    <div className="highlight-text">
                      <span className="highlight-label">Bed Type</span>
                      <span className="highlight-value">{room.bed}</span>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <FaHotel className="highlight-icon" />
                    <div className="highlight-text">
                      <span className="highlight-label">Room Size</span>
                      <span className="highlight-value">{room.size}</span>
                    </div>
                  </div>
                  <div className="highlight-item">
                    <FaMapMarkerAlt className="highlight-icon" />
                    <div className="highlight-text">
                      <span className="highlight-label">View</span>
                      <span className="highlight-value">{room.roomView}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Card */}
              <div className="booking-card">
                <div className="price-container">
                  <div className="current-price">
                    <span className="price">{formatRupiah(room.price)}</span>
                    <span className="per-night">/ night</span>
                  </div>
                </div>

                <form onSubmit={handleBookNow} className="booking-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        <FaCalendarAlt /> Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => {
                          if (!isLoggedIn) {
                            alert("Anda harus login terlebih dahulu.")
                            return
                          }
                          setCheckIn(e.target.value)
                        }}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>
                        <FaCalendarAlt /> Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => {
                          if (!isLoggedIn) {
                            alert("Anda harus login terlebih dahulu.")
                            return
                          }
                          setCheckOut(e.target.value)
                        }}
                        required
                        min={checkIn}
                      />
                    </div>
                  </div>

                  <div className="form-group" ref={guestDropdownRef}>
                    <label>
                      <FaUserFriends /> Guests
                    </label>
                    <div className="guest-selector">
                      <div className="guest-display" onClick={toggleGuestDropdown}>
                        <span>
                          {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"}
                        </span>
                        <FaChevronDown className={isGuestDropdownOpen ? "rotate" : ""} />
                      </div>
                      {isGuestDropdownOpen && (
                        <div className="guest-dropdown">
                          <div className="guest-type-row">
                            <div className="guest-type-label">
                              <FaUserFriends />
                              <span>Adults</span>
                            </div>
                            <div className="guest-counter">
                              <button type="button" onClick={decrementAdults}>
                                -
                              </button>
                              <div className="counter-value">{adults}</div>
                              <button type="button" onClick={incrementAdults}>
                                +
                              </button>
                            </div>
                          </div>
                          <div className="guest-type-row">
                            <div className="guest-type-label">
                              <FaUserFriends />
                              <span>Children</span>
                            </div>
                            <div className="guest-counter">
                              <button type="button" onClick={decrementChildren}>
                                -
                              </button>
                              <div className="counter-value">{children}</div>
                              <button type="button" onClick={incrementChildren}>
                                +
                              </button>
                            </div>
                          </div>
                          <button type="button" className="apply-btn" onClick={() => setIsGuestDropdownOpen(false)}>
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="booking-summary">
                    <div className="summary-row">
                      <span>
                        {formatRupiah(room.price)} x{" "}
                        {checkIn && checkOut
                          ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
                          : 0}
                        / night
                      </span>
                      <span>
                        {formatRupiah(
                          room.price *
                          (checkIn && checkOut
                            ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
                            : 0),
                        )}
                      </span>
                    </div>

                    <div className="summary-total">
                      <span>Total</span>
                      <span>{formatRupiah(calculateTotalPrice())}</span>
                    </div>
                  </div>

                  <button type="submit" className="book-now-btn">
                    Book Now
                  </button>

                  <div className="booking-policies">
                    <div className="policy-item">
                      <FaCheck className="policy-icon" />
                      <span>Pembatalan gratis sebelum 48 jam dari check-in</span>
                    </div>
                    <div className="policy-item">
                      <FaCreditCard className="policy-icon" />
                      <span>Tidak perlu pembayaran sekarang</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Room Details Tabs */}
        <section className="room-details">
          <div className="container">
            <div className="details-tabs">
              <button
                className={activeTab === "description" ? "tab-active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Description
              </button>
              <button
                className={activeTab === "amenities" ? "tab-active" : ""}
                onClick={() => setActiveTab("amenities")}
              >
                Amenities
              </button>
              <button className={activeTab === "policies" ? "tab-active" : ""} onClick={() => setActiveTab("policies")}>
                Policies
              </button>
              <button className={activeTab === "reviews" ? "tab-active" : ""} onClick={() => setActiveTab("reviews")}>
                Reviews
              </button>
            </div>

            <div className="details-content">
              {activeTab === "description" && (
                <div className="description-content">
                  <p>{room.fullDescription}</p>

                  {room.features?.length > 0 && (
                    <>
                      <h4 style={{ marginTop: "1rem", marginBottom: "0.5rem", fontSize: "16px" }}>Features:</h4>
                      <div className="room-features-grid">
                        {room.features.map((feature, index) => (
                          <div key={index} className="feature-item">
                            <FaCheck className="feature-icon" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}

              {activeTab === "amenities" && (
                <div className="amenities-content">
                  <div className="amenities-grid">
                    {room.amenities?.map((amenity, index) => (
                      <div key={index} className="amenity-card">
                        <div className="amenity-icon">{amenity.icon}</div>
                        <h3>{amenity.name}</h3>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "policies" && (
                <div className="policies-content">
                  {room.policies?.length > 0 && (
                    <>
                      <h4 style={{ marginBottom: "0.5rem", fontSize: "16px" }}>Policies:</h4>
                      <ul className="policies-list">
                        {room.policies.map((policy, index) => (
                          <li key={index} className="policy-item">
                            <FaCheck className="policy-icon" />
                            <span>{policy}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="reviews-content">
                  <div className="reviews-summary">
                    <div className="average-rating">
                      <div className="rating-number">
                        {reviews.length > 0 ? (reviews.reduce((total, review) => total + review.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                      </div>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.round(averageRating) ? "star-filled" : "star-empty"} />
                        ))}
                      </div>
                      <div className="rating-count">{reviews.length} reviews</div>
                    </div>
                  </div>

                  <div className="reviews-list">
                    {reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-name">
                            {review.user?.fullName || review.fullname}
                          </div>
                          <div className="review-date">
                            {new Date(review.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? "star-filled" : "star-empty"} />
                          ))}
                        </div>
                        <h4 className="review-title">{review.title}</h4>
                        <div className="review-comment">{review.comment}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default RoomDetail