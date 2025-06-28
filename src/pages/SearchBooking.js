import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import {
  FaCheck,
  FaUserFriends,
  FaChild,
  FaChevronDown,
  FaEdit,
  FaBed,
  FaUsers,
  FaRulerCombined,
  FaClock,
  FaSmokingBan,
  FaDog,
  FaShieldAlt,
} from "react-icons/fa"

const parseSafe = (value) => {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return typeof value === "string" ? [value.replace(/[[\]"]/g, "")] : [value];
  }
};






function SearchBooking() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState("price-low")

  // Edit functionality state
  const [isEditing, setIsEditing] = useState(false)
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [adults, setAdults] = useState(0)
  const [children, setChildren] = useState(0)
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false)

  // Add image carousel state
  const [currentImageIndex, setCurrentImageIndex] = useState({})

  const location = useLocation()
  const navigate = useNavigate()
  const guestDropdownRef = useRef(null)

  const searchParams = location.state || {
    checkIn: null,
    checkOut: null,
    adults: 1,
    children: 0,
    guests: 1,
  }

  // Initialize editable state with search params
  useEffect(() => {
    setCheckIn(searchParams.checkIn || "")
    setCheckOut(searchParams.checkOut || "")
    setAdults(searchParams.adults || 0)
    setChildren(searchParams.children || 0)
  }, [searchParams])

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

  const totalGuests = (searchParams.adults || 0) + (searchParams.children || 0)
  const editTotalGuests = adults + children

  const calculateNights = () => {
    const start = new Date(searchParams.checkIn)
    const end = new Date(searchParams.checkOut)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const nights = calculateNights()

  function formatDate(dateString) {
    if (!dateString) return "Not selected"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB")
  }

  // Guest counter functions
  const incrementAdults = () => {
    if (adults < 10) setAdults(adults + 1)
  }

  const decrementAdults = () => {
    if (adults > 0) setAdults(adults - 1)
  }

  const incrementChildren = () => {
    if (children < 6) setChildren(children + 1)
  }

  const decrementChildren = () => {
    if (children > 0) setChildren(children - 1)
  }

  const toggleGuestDropdown = () => {
    setIsGuestDropdownOpen(!isGuestDropdownOpen)
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleUpdate = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.")
      return
    }

    if (adults + children === 0) {
      alert("Please select at least 1 guest.")
      return
    }

    // Update search params and reload page with new data
    const newSearchParams = {
      checkIn,
      checkOut,
      adults,
      children,
      guests: adults + children,
    }

    navigate("/searchbooking", {
      state: newSearchParams,
      replace: true,
    })

    setIsEditing(false)
  }

  const loadRooms = async () => {
    setLoading(true)
    try {
      const res = await fetch("https://localhost:7298/api/room")
      const data = await res.json()

      // Semua room ditampilkan tanpa filter jumlah guest
      const availableRooms = data.map((room) => ({
        id: room.id,
        title: room.title,
        shortDescription: room.shortDescription,
        longDescription: room.fullDescription,
        price: room.price,
        originalPrice: room.price + 50,
        quantity: room.quantity,
        features: parseSafe(room.features),
        policies: parseSafe(room.policies),
        image: room.image1
          ? `https://localhost:7298${room.image1}`
          : "https://via.placeholder.com/400x300?text=No+Image",
        // Add all three images for carousel
        image1: room.image1 ? `https://localhost:7298${room.image1}` : null,
        image2: room.image2 ? `https://localhost:7298${room.image2}` : null,
        image3: room.image3 ? `https://localhost:7298${room.image3}` : null,
        rating: 4.5,
        reviewCount: 120,
        size: room.size,
        bedType: room.bed,
        maxGuests: Number.parseInt(room.occupancy) || 2,
        cancellation: "Free cancellation until 48 hours before check-in",
        breakfast: false,
        discount: 0,
      }))

      setRooms(availableRooms)
    } catch (err) {
      console.error("Failed to load rooms:", err)
      setRooms([])
    }
    setLoading(false)
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    loadRooms()
  }, [location])

  const sortRooms = (rooms, sortBy) => {
    const sorted = [...rooms]
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price)
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "popular":
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount)
      default:
        return sorted
    }
  }

  const sortedRooms = sortRooms(rooms, sortBy)

  const handleBookRoom = (room) => {
    const bookingDetails = {
      roomId: room.id,
      roomType: room.title,
      checkinDate: searchParams.checkIn,
      checkoutDate: searchParams.checkOut,
      adultGuests: searchParams.adults,
      childGuests: searchParams.children,
      nights: nights,
      pricePerNight: room.price,
      totalPrice: room.price * nights,
      bookingId: "GS-" + Math.floor(100000 + Math.random() * 900000),
    }

    navigate("/bookingform", { state: { bookingDetails } })
  }

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number)
  }

  // Image carousel functions
  const nextImage = (roomId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: ((prev[roomId] || 0) + 1) % totalImages,
    }))
  }

  const prevImage = (roomId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [roomId]: prev[roomId] > 0 ? prev[roomId] - 1 : totalImages - 1,
    }))
  }

  const getAvailableImages = (room) => {
    const images = []
    if (room.image1) images.push(room.image1)
    if (room.image2) images.push(room.image2)
    if (room.image3) images.push(room.image3)
    return images.length > 0 ? images : [room.image || "/placeholder.svg"]
  }

  const getPolicyIcon = (policyName) => {
    const lowerPolicy = policyName.toLowerCase()
    if (lowerPolicy.includes("check-in") || lowerPolicy.includes("check-out") || lowerPolicy.includes("cancellation")) {
      return <FaClock />
    } else if (lowerPolicy.includes("smoking")) {
      return <FaSmokingBan />
    } else if (lowerPolicy.includes("pet") || lowerPolicy.includes("dog")) {
      return <FaDog />
    } else if (lowerPolicy.includes("bed") || lowerPolicy.includes("extra")) {
      return <FaBed />
    } else {
      return <FaShieldAlt />
    }
  }

  // Enhanced CSS with edit functionality styles
  const cssStyles = `
  * {
    box-sizing: border-box;
  }

  .container {
    min-height: 100vh;
    padding-top: 70px;
    background: linear-gradient(135deg, rgba(208, 149, 0, 0.05), rgba(208, 149, 0, 0.1));
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  .loading-container {
    min-height: 100vh;
    background: linear-gradient(135deg, rgba(208, 149, 0, 0.05), rgba(208, 149, 0, 0.1));
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-content {
    text-align: center;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 3px solid #D09500;
    border-top: 3px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 16px;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .loading-text {
    color: #666;
    font-size: 18px;
    font-weight: 500;
    margin: 0 0 8px 0;
  }

  .loading-subtext {
    color: #999;
    font-size: 14px;
    margin: 0;
  }

  .main-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 16px;
  }

  .summary-card {
    background: white;
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(208, 149, 0, 0.1);
    position: relative;
  }

  .summary-content {
    display: flex;
    align-items: center;
    gap: 32px;
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 32px;
    flex: 1;
  }

  .summary-item {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .summary-icon {
    padding: 12px;
    background: linear-gradient(135deg, rgba(208, 149, 0, 0.1), rgba(208, 149, 0, 0.05));
    border-radius: 12px;
    color: #D09500;
    flex-shrink: 0;
  }

  .summary-text {
    text-align: left;
    flex: 1;
  }

  .summary-label {
    font-size: 14px;
    color: #6B7280;
    margin: 0 0 4px 0;
    font-weight: 500;
  }

  .summary-value {
    font-weight: 600;
    margin: 0;
    color: #1F2937;
    font-size: 16px;
  }

  .edit-controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-width: 120px;
  }

  .edit-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background-color: #D09500;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .edit-button:hover {
    background-color: #B8860B;
  }

  .update-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background-color: #D09500;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .update-button:hover {
    background-color: #B8860B;
  }

  /* Inline Edit Styles */
  .editable-value {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .inline-input {
    padding: 0;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
    background-color: transparent;
    min-width: 120px;
    transition: all 0.3s ease;
    outline: none;
  }

  .inline-input:hover {
    border-bottom-color: rgba(208, 149, 0, 0.3);
  }

  .inline-input:focus {
    border-bottom-color: #D09500;
    background-color: rgba(208, 149, 0, 0.05);
    padding: 2px 4px;
    border-radius: 4px;
  }

  .guest-selector {
    position: relative;
    min-width: 200px;
  }

  .guest-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0;
    border: none;
    border-bottom: 2px solid transparent;
    font-size: 16px;
    cursor: pointer;
    background-color: transparent;
    transition: all 0.3s ease;
    box-sizing: border-box;
    font-weight: 600;
    color: #1F2937;
    outline: none;
  }

  .guest-display:hover {
    border-bottom-color: rgba(208, 149, 0, 0.3);
  }

  .guest-display:focus,
  .guest-display.active {
    border-bottom-color: #D09500;
    background-color: rgba(208, 149, 0, 0.05);
    padding: 2px 4px;
    border-radius: 4px;
  }

  .guest-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    padding: 20px;
    margin-top: 8px;
    z-index: 10;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
  }

  .guest-type-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 12px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .guest-type-row:last-of-type {
    border-bottom: none;
    margin-bottom: 16px;
  }

  .guest-counter {
    display: flex;
    align-items: center;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    background-color: #f8fafc;
  }

  .counter-button {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: none;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #64748b;
  }

  .counter-button:hover {
    background-color: #f1f5f9;
    color: #334155;
  }

  .counter-button:active {
    background-color: #e2e8f0;
  }

  .counter-value {
    width: 48px;
    text-align: center;
    padding: 8px 4px;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    background-color: white;
  }

  .apply-button {
    width: 100%;
    padding: 12px;
    background-color: #D09500;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .apply-button:hover {
    background-color: #87723B;
  }

  /* Smooth transition for summary values */
  .summary-value {
    transition: all 0.3s ease;
  }

  .summary-card {
    transition: all 0.3s ease;
  }

  /* Edit mode indicator */
  .summary-item.editing {
    background-color: rgba(208, 149, 0, 0.02);
    border-radius: 8px;
    padding: 8px;
    margin: -8px;
    transition: all 0.3s ease;
  }

  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 20px;
  }

  .results-title {
    font-size: 24px;
    font-weight: 700;
    color: #1F2937;
    margin: 0 0 4px 0;
  }

  .results-subtitle {
    color: #6B7280;
    font-size: 14px;
    margin: 0;
  }

  .sort-container {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sort-label {
    font-size: 14px;
    color: #6B7280;
    font-weight: 500;
  }

  .sort-select {
    padding: 10px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    background-color: white;
    min-width: 180px;
    cursor: pointer;
  }

  .sort-select:focus {
    outline: none;
    border-color: #D09500;
    box-shadow: 0 0 0 3px rgba(208, 149, 0, 0.1);
  }

  .rooms-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .room-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(208, 149, 0, 0.1);
    transition: all 0.3s ease;
  }

  .room-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  }

  .room-layout {
    display: flex;
    flex-direction: column;
  }

  .room-image-section {
    position: relative;
    height: 280px;
    overflow: hidden;
  }

  .image-carousel {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease-in-out;
  }

  .carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 18px;
    font-weight: bold;
    transition: all 0.3s ease;
    z-index: 2;
    opacity: 0;
    visibility: hidden;
  }

  .image-carousel:hover .carousel-nav {
    opacity: 1;
    visibility: visible;
  }

  .carousel-nav:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-50%) scale(1.1);
  }

  .carousel-nav.prev {
    left: 10px;
  }

  .carousel-nav.next {
    right: 10px;
  }

  .image-indicators {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    z-index: 2;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .image-carousel:hover .image-indicators {
    opacity: 1;
    visibility: visible;
  }

  .indicator-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .indicator-dot.active {
    background: rgba(255, 255, 255, 0.9);
    transform: scale(1.2);
  }

  .room-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .room-card:hover .room-image {
    transform: scale(1.05);
  }

  .badge-container {
    position: absolute;
    top: 16px;
    left: 16px;
  }

  .quantity-badge {
    background: rgba(208, 149, 0, 0.9);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    backdrop-filter: blur(4px);
  }

  .rating-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(8px);
    border-radius: 12px;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .rating-value {
    font-size: 14px;
    font-weight: 700;
    color: #1F2937;
  }

  .rating-count {
    font-size: 12px;
    color: #6B7280;
  }

  .room-content {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .room-details {
    flex: 1;
  }

  .room-header {
    margin-bottom: 20px;
  }

  .room-title {
    font-size: 24px;
    font-weight: 700;
    color: #D09500;
    margin: 0 0 12px 0;
  }

  .room-description {
    color: #6B7280;
    line-height: 1.6;
    margin: 0;
    font-size: 15px;
  }

  .room-info {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
    padding: 16px 0;
    border-top: 1px solid #f3f4f6;
    border-bottom: 1px solid #f3f4f6;
  }

  .room-info-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #6B7280;
    font-weight: 500;
  }

  .room-info-item svg {
    color: #D09500;
    flex-shrink: 0;
  }

  .features-section {
    margin-bottom: 20px;
  }

  .features-title {
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
    margin: 0 0 12px 0;
  }

  .features-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .feature-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(208, 149, 0, 0.1);
    color: #D09500;
    border: 1px solid rgba(208, 149, 0, 0.3);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }

  .more-features {
    font-size: 12px;
    color: #6B7280;
    align-self: center;
    font-style: italic;
  }

  .amenities-section {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-bottom: 20px;
  }

  .amenity-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #6B7280;
    font-size: 13px;
    font-weight: 500;
  }

  .policies-section {
    margin-bottom: 20px;
  }

  .policies-title {
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
    margin: 0 0 12px 0;
  }

  .policies-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .policy-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: rgba(34, 197, 94, 0.1);
    color: #059669;
    border: 1px solid rgba(34, 197, 94, 0.3);
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
  }

  .policy-section {
    margin-bottom: 24px;
  }

  .policy-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: rgba(34, 197, 94, 0.1);
    color: #059669;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    border: 1px solid rgba(34, 197, 94, 0.2);
  }

  .pricing-section {
    border-top: 2px solid #f3f4f6;
    padding-top: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 20px;
  }

  .price-info {
    flex: 1;
  }

  .price-container {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 8px;
  }

  .price {
    font-size: 32px;
    font-weight: 800;
    color: #D09500;
  }

  .per-night {
    color: #6B7280;
    font-size: 16px;
  }

  .total-price {
    font-size: 14px;
    color: #6B7280;
  }

  .total-value {
    font-weight: 600;
    color: #1F2937;
  }

  .book-button {
    background: linear-gradient(135deg, #D09500, #B8860B);
    color: white;
    border: none;
    padding: 16px 32px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(208, 149, 0, 0.3);
  }

  .book-button:hover {
    background: linear-gradient(135deg, #B8860B, #D09500);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(208, 149, 0, 0.4);
  }

  .no-rooms-card {
    background: white;
    padding: 64px 32px;
    text-align: center;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .no-rooms-text {
    color: #6B7280;
    font-size: 20px;
    margin: 0 0 16px 0;
    font-weight: 600;
  }

  .no-rooms-subtext {
    color: #9CA3AF;
    font-size: 14px;
    margin: 0 0 32px 0;
  }

  .modify-button {
    background: linear-gradient(135deg, #D09500, #B8860B);
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .modify-button:hover {
    background: linear-gradient(135deg, #B8860B, #D09500);
    transform: translateY(-2px);
  }

  /* Desktop Layout - Side by Side */
  @media (min-width: 1024px) {
    .room-layout {
      flex-direction: row;
    }

    .room-image-section {
      width: 400px;
      height: auto;
      min-height: 350px;
      flex-shrink: 0;
    }

    .room-content {
      flex: 1;
    }

    .pricing-section {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  /* Tablet Responsive */
  @media (max-width: 768px) {
    .main-content {
      padding: 24px 16px;
    }

    .summary-content {
      flex-direction: column;
      gap: 20px;
    }

    .summary-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .summary-card {
      padding: 24px;
    }

    .edit-controls {
      flex-direction: row;
      min-width: auto;
    }

    .results-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .room-content {
      padding: 24px;
    }

    .room-title {
      font-size: 20px;
    }

    .price {
      font-size: 28px;
    }

    .pricing-section {
      flex-direction: column;
      align-items: flex-start;
      gap: 16px;
    }

    .book-button {
      width: 100%;
    }
  }

  /* Mobile Responsive */
  @media (max-width: 480px) {
    .summary-grid {
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .summary-item {
      justify-content: flex-start;
    }

    .room-info {
      flex-direction: column;
      gap: 12px;
    }

    .amenities-section {
      justify-content: space-between;
    }

    .features-list {
      justify-content: flex-start;
    }
  }

  .summary-value.editable {
    border-bottom: 1px dashed rgba(208, 149, 0, 0.5);
    cursor: pointer;
  }

  .summary-value.editable:hover {
    background-color: rgba(208, 149, 0, 0.05);
    padding: 2px 4px;
    border-radius: 4px;
  }

  .date-input-styled {
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
    z-index: 2;
  }

  .date-display {
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
    padding: 0;
    border: none;
    border-bottom: 2px solid transparent;
    background-color: transparent;
    transition: all 0.3s ease;
    min-width: 120px;
  }

  .date-input-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input-styled {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 2;
}

.date-display {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  padding: 0;
  border: none;
  border-bottom: 2px solid transparent;
  background-color: transparent;
  transition: all 0.3s ease;
  min-width: 120px;
}

.date-input-container:hover .date-display {
  border-bottom-color: rgba(208, 149, 0, 0.3);
}

.date-input-container:focus-within .date-display {
  border-bottom-color: #D09500;
  background-color: rgba(208, 149, 0, 0.05);
  padding: 2px 4px;
  border-radius: 4px;
}

.calendar-icon {
  color: #000000;
  flex-shrink: 0;
  stroke-width: 3;
  font-weight: bold;
}

.date-input-container:hover .calendar-icon {
  color: #333333;
}

  .summary-label {
    font-size: 14px;
    color: #6B7280;
    margin: 0 0 4px 0;
    font-weight: 500;
  }

  .summary-label::after {
    content: none;
  }
`

  return (
    <div className="container">
      <style>{cssStyles}</style>

      {loading ? (
        <div className="loading-container">
          <div className="loading-content">
            <div className="spinner" />
            <p className="loading-text">Searching for available rooms...</p>
            <p className="loading-subtext">
              {formatDate(searchParams.checkIn)} - {formatDate(searchParams.checkOut)} • {totalGuests} guests
            </p>
          </div>
        </div>
      ) : (
        <div className="main-content">
          {/* Enhanced Search Summary Card with Inline Edit */}
          <div className="summary-card">
            <div className="summary-content">
              <div className="summary-grid">
                <div className="summary-item">
                  <div className="summary-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="summary-text">
                    <p className="summary-label">Check-in</p>
                    <div className="editable-value">
                      {isEditing ? (
                        <div className="date-input-container">
                          <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            className="date-input-styled"
                          />
                          <div className="date-display">
                            {checkIn ? new Date(checkIn).toLocaleDateString("en-GB") : "Select date"}
                          </div>
                          <svg
                            className="calendar-icon"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                      ) : (
                        <p className="summary-value">{formatDate(searchParams.checkIn)}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </div>
                  <div className="summary-text">
                    <p className="summary-label">Check-out</p>
                    <div className="editable-value">
                      {isEditing ? (
                        <div className="date-input-container">
                          <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={checkIn}
                            className="date-input-styled"
                          />
                          <div className="date-display">
                            {checkOut ? new Date(checkOut).toLocaleDateString("en-GB") : "Select date"}
                          </div>
                          <svg
                            className="calendar-icon"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </div>
                      ) : (
                        <p className="summary-value">{formatDate(searchParams.checkOut)}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="summary-item">
                  <div className="summary-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div className="summary-text">
                    <p className="summary-label">Guests</p>
                    <div className="editable-value">
                      {isEditing ? (
                        <div className="guest-selector" ref={guestDropdownRef}>
                          <div
                            className="guest-display"
                            onClick={toggleGuestDropdown}
                            style={{
                              borderBottomColor: isGuestDropdownOpen ? "#D09500" : "transparent",
                              backgroundColor: isGuestDropdownOpen ? "rgba(208, 149, 0, 0.05)" : "transparent",
                              padding: isGuestDropdownOpen ? "2px 4px" : "0",
                              borderRadius: isGuestDropdownOpen ? "4px" : "0",
                            }}
                          >
                            <span>
                              {adults} {adults === 1 ? "Adult" : "Adults"}
                              {children > 0 && `, ${children} ${children === 1 ? "Children" : "Children"}`}
                            </span>
                            <FaChevronDown
                              style={{
                                transform: isGuestDropdownOpen ? "rotate(180deg)" : "rotate(0)",
                                transition: "transform 0.2s",
                                color: "#87723B",
                              }}
                            />
                          </div>

                          {isGuestDropdownOpen && (
                            <div className="guest-dropdown">
                              <div className="guest-type-row">
                                <div className="guest-type-label">
                                  <FaUserFriends />
                                  <span>Adults</span>
                                </div>
                                <div className="guest-counter">
                                  <button type="button" onClick={decrementAdults} className="counter-button">
                                    -
                                  </button>
                                  <div className="counter-value">{adults}</div>
                                  <button type="button" onClick={incrementAdults} className="counter-button">
                                    +
                                  </button>
                                </div>
                              </div>

                              <div className="guest-type-row">
                                <div className="guest-type-label">
                                  <FaChild />
                                  <span>Children (&lt;13)</span>
                                </div>
                                <div className="guest-counter">
                                  <button type="button" onClick={decrementChildren} className="counter-button">
                                    -
                                  </button>
                                  <div className="counter-value">{children}</div>
                                  <button type="button" onClick={incrementChildren} className="counter-button">
                                    +
                                  </button>
                                </div>
                              </div>

                              <button
                                type="button"
                                className="apply-button"
                                onClick={() => setIsGuestDropdownOpen(false)}
                              >
                                Apply
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="summary-value">
                          {searchParams.adults} Adult{searchParams.adults > 1 ? "s" : ""}
                          {searchParams.children > 0 &&
                            `, ${searchParams.children} Children${searchParams.children > 1 ? "ren" : ""}`}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="edit-controls">
                {isEditing ? (
                  <button className="update-button" onClick={handleUpdate}>
                    Update
                  </button>
                ) : (
                  <button className="edit-button" onClick={handleEdit}>
                    <FaEdit /> Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Results Header & Sort */}
          <div className="results-header">
            <div>
              <h2 className="results-title">{sortedRooms.length} room types found</h2>
              <p className="results-subtitle">Sorted by: {sortBy.replace("-", " ")}</p>
            </div>
            <div className="sort-container">
              <label className="sort-label">Sort by:</label>
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

          {sortedRooms.length === 0 ? (
            <div className="no-rooms-card">
              <p className="no-rooms-text">No rooms available at the moment</p>
              <p className="no-rooms-subtext">Please check back later or contact the hotel for more information.</p>
            </div>
          ) : (
            <div className="rooms-list">
              {sortedRooms.map((room) => (
                <div key={room.id} className="room-card">
                  <div className="room-layout">
                    <div className="room-image-section">
                      {(() => {
                        const availableImages = getAvailableImages(room)
                        const currentIndex = currentImageIndex[room.id] || 0
                        const showNavigation = availableImages.length > 1

                        return (
                          <div className="image-carousel">
                            <img
                              src={availableImages[currentIndex] || "/placeholder.svg"}
                              alt={`${room.title} - Image ${currentIndex + 1}`}
                              className="carousel-image room-image"
                            />

                            {showNavigation && (
                              <>
                                <button
                                  className="carousel-nav prev"
                                  onClick={() => prevImage(room.id, availableImages.length)}
                                  aria-label="Previous image"
                                >
                                  ‹
                                </button>
                                <button
                                  className="carousel-nav next"
                                  onClick={() => nextImage(room.id, availableImages.length)}
                                  aria-label="Next image"
                                >
                                  ›
                                </button>

                                <div className="image-indicators">
                                  {availableImages.map((_, index) => (
                                    <div
                                      key={index}
                                      className={`indicator-dot ${index === currentIndex ? "active" : ""}`}
                                      onClick={() => setCurrentImageIndex((prev) => ({ ...prev, [room.id]: index }))}
                                    />
                                  ))}
                                </div>
                              </>
                            )}

                            <div className="badge-container">
                              <div className="quantity-badge">{room.quantity} units available</div>
                            </div>
                            <div className="rating-badge">
                              <span className="rating-value">{room.rating}</span>
                              <span className="rating-count">({room.reviewCount})</span>
                            </div>
                          </div>
                        )
                      })()}
                    </div>
                    <div className="room-content">
                      <div className="room-details">
                        <div className="room-header">
                          <h3 className="room-title">{room.title}</h3>
                          <p className="room-description">{room.shortDescription}</p>
                        </div>
                        <div className="room-info">
                          <div className="room-info-item">
                            <FaRulerCombined />
                            {room.size}
                          </div>
                          <div className="room-info-item">
                            <FaBed />
                            {room.bedType}
                          </div>
                          <div className="room-info-item">
                            <FaUsers />
                            Max {room.maxGuests} guests
                          </div>
                        </div>
                        <div className="features-section">
                          <h4 className="features-title">Features:</h4>
                          <div className="features-list">
                            {room.features
                              .flatMap(parseSafe)
                              .slice(0, 4)
                              .map((feature, i) => (
                                <div key={i} className="feature-badge">
                                  <FaCheck /> {feature}
                                </div>
                              ))}
                          </div>
                        </div>

                        {room.policies && room.policies.length > 0 && (
                          <div className="policies-section">
                            <h4 className="policies-title">Policies:</h4>
                            <div className="policies-list">
                              {room.policies.flatMap(parseSafe).map((policy, i) => (
                                <div key={i} className="policy-badge">
                                  {getPolicyIcon(policy)} {policy}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </div>
                      <div className="pricing-section">
                        <div className="price-info">
                          <div className="price-container">
                            <span className="price">{formatRupiah(room.price)}</span>
                            <span className="per-night">/ night</span>
                          </div>
                          <div className="total-price">
                            <span className="total-value">{formatRupiah(room.price * nights)}</span> for {nights} night
                          </div>
                        </div>
                        <button className="book-button" onClick={() => handleBookRoom(room)}>
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBooking
