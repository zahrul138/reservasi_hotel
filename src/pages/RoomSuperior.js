import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import SuperiorBG from "../assets/images/SuperiorBG.png";
import SuperiorRT from "../assets/images/SuperiorRT.png";
import SuperiorToilet from "../assets/images/SuperiorToilet.png";

import DeluxeBG from "../assets/images/DeluxeBG.png";
import ExecutiveBG from "../assets/images/ExecutiveBG.png";


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

function RoomSuperior() {
  // Example room data
  const room = {
    id: "superior-room",
    title: "Superior Room",
    shortDescription: "Spacious and elegantly furnished room with city views",
    fullDescription:
      "Our Deluxe Room offers a luxurious retreat with stunning city views. Featuring a plush king-sized bed, a modern bathroom with premium amenities, and a comfortable seating area, this room is perfect for both leisure and business travelers seeking comfort and style. The room is decorated with elegant furnishings and artwork that reflect the local culture and heritage.",
    additionalInfo:
      "Each Deluxe Room includes complimentary access to our fitness center and swimming pool. Guests also enjoy priority reservations at our award-winning restaurant and a welcome drink upon arrival.",
    price: "$180",
    discountedPrice: "$160",
    perNight: "per night",
    size: "450 sq ft",
    occupancy: "Up to 2 guests",
    bed: "1 King Bed",
    view: "City View",
    features: [
      "Complimentary Wi-Fi",
      "48-inch Smart TV",
      "Minibar",
      "Coffee machine",
      "Air conditioning",
      "Room service",
      "Safe",
      "Bathrobe & slippers",
      "Premium toiletries",
      "Work desk",
      "Blackout curtains",
      "Daily housekeeping",
    ],
    amenities: [
      { icon: <FaWifi />, name: "High-speed Wi-Fi" },
      { icon: <FaTv />, name: "Smart TV with streaming" },
      { icon: <FaCoffee />, name: "Coffee machine" },
      { icon: <FaShower />, name: "Rainfall shower" },
      { icon: <FaWineGlassAlt />, name: "Minibar" },
      { icon: <FaDoorOpen />, name: "Room service" },
      { icon: <FaBath />, name: "Luxury bathroom" },
      { icon: <FaBed />, name: "Premium bedding" },
    ],
    policies: [
      "Check-in: 3:00 PM",
      "Check-out: 12:00 PM",
      "Cancellation: Free up to 48 hours before arrival",
      "No smoking",
      "No pets allowed",
      "Extra bed: $30 per night (upon request)",
    ],
    images: [
      SuperiorBG,
      SuperiorRT,
      SuperiorToilet,
    ],
    reviews: [
      {
        id: 1,
        author: "James Wilson",
        rating: 5,
        date: "October 15, 2023",
        comment:
          "Absolutely loved our stay in the Deluxe Room. The bed was extremely comfortable and the city views were spectacular. Will definitely book again!",
      },
      {
        id: 2,
        author: "Emma Thompson",
        rating: 4,
        date: "September 3, 2023",
        comment:
          "Great room with excellent amenities. The coffee machine was a nice touch. Only downside was some noise from the street, but overall a very pleasant stay.",
      },
      {
        id: 3,
        author: "Michael Chen",
        rating: 5,
        date: "August 20, 2023",
        comment:
          "One of the best hotel rooms I've stayed in. Spotlessly clean, modern, and the service was impeccable. Highly recommended!",
      },
      {
        id: 4,
        author: "Sophia Rodriguez",
        rating: 5,
        date: "July 12, 2023",
        comment:
          "Perfect location and beautiful room. The staff was incredibly helpful and the amenities were top-notch. I especially loved the rainfall shower!",
      },
    ],
    similarRooms: [
      {
        id: "deluxe-room",
        title: "Deluxe Room",
        price: "$120",
        image: DeluxeBG,
        description: "Comfortable room with essential amenities",
      },
      {
        id: "executive-suite",
        title: "Executive Suite",
        price: "$250",
        image: ExecutiveBG,
        description: "Luxury suite with separate living area",
      },
    ],
  }

  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("description")
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const navigate = useNavigate();

  const guestDropdownRef = useRef(null)

  const totalGuests = adults + children;

  const toggleGuestDropdown = () => setIsGuestDropdownOpen(!isGuestDropdownOpen);
  const incrementAdults = () => setAdults(adults + 1);
  const decrementAdults = () => setAdults(adults > 1 ? adults - 1 : 1);
  const incrementChildren = () => setChildren(children + 1);
  const decrementChildren = () => setChildren(children > 0 ? children - 1 : 0);

  const calculateTotalPrice = () => {
    const roomPricePerNight = parseFloat(room.discountedPrice.replace('$', '')) || 0;
    const nights =
      checkIn && checkOut
        ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24))
        : 0;
    const subtotal = roomPricePerNight * nights;
    const taxes = 60;
    return subtotal + taxes;
  };

  const handleBookNow = (e) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("You must be logged in to make a booking.");
      return;
    }

    const user = JSON.parse(storedUser);

    const totalPrice = calculateTotalPrice();

    const bookingDetails = {
      userId: user.id,
      fullname: user.fullname,
      email: user.email,
      checkinDate: checkIn,
      checkoutDate: checkOut,
      roomType: room.title,
      adultGuests: adults,
      childGuests: children,
      totalPrice: totalPrice,
    };

    navigate("/bookingform", { state: { bookingDetails } });
  };


  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);


  // Calculate average rating
  const averageRating = room.reviews.reduce((total, review) => total + review.rating, 0) / room.reviews.length

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


  const nextImage = () => {
    setCurrentImage((prev) => (prev === room.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? room.images.length - 1 : prev - 1))
  }

  const selectImage = (index) => {
    setCurrentImage(index)
  }

  const openGallery = (idx = 0) => {
    setCurrentImage(idx);
    setGalleryOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeGallery = () => {
    setGalleryOpen(false)
    document.body.style.overflow = "auto"
  }

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
          max-width: 600px;  /* atau sesuai kebutuhan */
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
        }

        /* Footer - Light Theme */
          .footer-light {
            background-color: #f8f5f0;
            color: #444;
            padding-top: 4rem;
            font-family: inherit;
          }

          .footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem 3rem;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 3rem;
          }

          .footer-logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #d09500;
            margin-bottom: 1rem;
          }

          .footer-title {
            color: #87723b;
            font-size: 1.25rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }

          .footer-text {
            color: #666;
            font-size: 0.95rem;
            margin-bottom: 0.5rem;
          }

          .footer-link {
            color: #666;
            text-decoration: none;
            margin-bottom: 0.5rem;
            display: block;
            font-size: 0.95rem;
          }

          .footer-link:hover {
            color: #d09500;
          }

          .footer-bottom-light {
            background-color: #eee;
            padding: 1.25rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.85rem;
            flex-wrap: wrap;
            gap: 1rem;
          }

          .footer-links {
            display: flex;
            gap: 1.25rem;
          }

          .footer-links a {
            color: #666;
            text-decoration: none;
          }

          .footer-links a:hover {
            color: #d09500;
          }


      `}</style>

      {/* Room Gallery Hero */}
      <section className="room-gallery-hero">
        <div className="gallery-grid">
          {/* Gambar Utama */}
          <div className="gallery-main" onClick={() => openGallery(0)}>
            <img
              src={room.images[0]}
              alt={`${room.title} - Main View`}
            />
            <div className="gallery-overlay">
              <span>View All Photos</span>
            </div>
          </div>

          {/* Dua Gambar Sekunder */}
          <div className="gallery-secondary">
            {room.images.slice(1, 3).map((img, i) => (
              <div
                key={i}
                className="gallery-item"
                onClick={() => openGallery(i + 1)}
              >
                <img
                  src={img}
                  alt={`${room.title} - View ${i + 2}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full-Screen Gallery */}
      {galleryOpen && (
        <div className="full-gallery" onClick={closeGallery}>
          {room.images.map((img, i) => (
            <div key={i} className="full-img-wrapper">
              <img
                src={img}
                alt={`${room.title} - Full ${i + 1}`}
              />
            </div>
          ))}
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
                  <span className="rating-count">({room.reviews.length} reviews)</span>
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
                    <span className="highlight-value">{room.view}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="booking-card">
              <div className="price-container">
                <div className="current-price">
                  <span className="price">{room.discountedPrice}</span>
                  <span className="per-night">{room.perNight}</span>
                </div>
                <div className="original-price">{room.price}</div>
                <div className="price-savings">You save $20 per night</div>
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
                          alert("Anda harus login terlebih dahulu.");
                          return;
                        }
                        setCheckIn(e.target.value);
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
                          alert("Anda harus login terlebih dahulu.");
                          return;
                        }
                        setCheckOut(e.target.value);
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

                <div className="booking-summary">
                  <div className="summary-row">
                    <span>$160 x 3 nights</span>
                    <span>$480</span>
                  </div>
                  <div className="summary-row">
                    <span>Taxes & fees</span>
                    <span>$60</span>
                  </div>
                  <div className="summary-total">
                    <span>Total</span>
                    <span>$540</span>
                  </div>
                </div>

                <button type="submit" className="book-now-btn">Book Now</button>

                <div className="booking-policies">
                  <div className="policy-item">
                    <FaCheck className="policy-icon" />
                    <span>Free cancellation before 48 hours of check-in</span>
                  </div>
                  <div className="policy-item">
                    <FaCreditCard className="policy-icon" />
                    <span>No payment needed today</span>
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
            <button className={activeTab === "amenities" ? "tab-active" : ""} onClick={() => setActiveTab("amenities")}>
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
                <p>{room.additionalInfo}</p>
                <div className="room-features-grid">
                  {room.features.map((feature, index) => (
                    <div key={index} className="feature-item">
                      <FaCheck className="feature-icon" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "amenities" && (
              <div className="amenities-content">
                <div className="amenities-grid">
                  {room.amenities.map((amenity, index) => (
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
                <ul className="policies-list">
                  {room.policies.map((policy, index) => (
                    <li key={index} className="policy-item">
                      <FaCheck className="policy-icon" />
                      <span>{policy}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="reviews-content">
                <div className="reviews-summary">
                  <div className="average-rating">
                    <div className="rating-number">{averageRating.toFixed(1)}</div>
                    <div className="rating-stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className={i < Math.round(averageRating) ? "star-filled" : "star-empty"} />
                      ))}
                    </div>
                    <div className="rating-count">{room.reviews.length} reviews</div>
                  </div>
                </div>

                <div className="reviews-list">
                  {room.reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-name">{review.author}</div>
                        <div className="review-date">{review.date}</div>
                      </div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < review.rating ? "star-filled" : "star-empty"} />
                        ))}
                      </div>
                      <div className="review-comment">{review.comment}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Other Rooms */}
      <section className="similar-rooms">
        <div className="container">
          <div className="section-header">
            <h2>Other Rooms</h2>
            <p>You might also be interested in these accommodations</p>
          </div>
          <div className="similar-rooms-grid">
            {room.similarRooms.map((similarRoom) => (
              <div key={similarRoom.id} className="similar-room-card">
                <div className="similar-room-image">
                  <img src={similarRoom.image || "/placeholder.svg"} alt={similarRoom.title} />
                  <div className="similar-room-price">
                    <span>{similarRoom.price}</span> / night
                  </div>
                </div>
                <div className="similar-room-details">
                  <h3>{similarRoom.title}</h3>
                  <p>{similarRoom.description}</p>
                  {similarRoom.id === "deluxe-room" && (
                    <Link to="/roomdeluxe" className="btn btn-outline">
                      View Details
                    </Link>
                  )}
                  {similarRoom.id === "executive-suite" && (
                    <Link to="/roomexecutive" className="btn btn-outline">
                      View Details
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Screen Gallery */}
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

      <footer className="footer-light">
        <div className="footer-container">
          <div>
            <div className="footer-logo">GoldenStay</div>
            <p className="footer-text">
              Experience luxury, comfort, and convenience at its finest. Your perfect stay starts here.
            </p>
          </div>

          <div>
            <h4 className="footer-title">Quick Links</h4>
            <a href="/about" className="footer-link">About Us</a>
            <a href="/contact" className="footer-link">Contact</a>
            <a href="/faq" className="footer-link">FAQ</a>
            <a href="/terms" className="footer-link">Terms & Conditions</a>
          </div>

          <div>
            <h4 className="footer-title">Contact</h4>
            <p className="footer-text">123 Golden Road, Batam</p>
            <p className="footer-text">Email: info@goldenstay.com</p>
            <p className="footer-text">Phone: +62 812 3456 7890</p>
          </div>
        </div>

        <div className="footer-bottom-light">
          <p className="copyright">
            © {new Date().getFullYear()} GoldenStay. All rights reserved.
          </p>
          <div className="footer-links">
            <a href="/privacy">Privacy</a>
            <a href="/cookies">Cookies</a>
          </div>
        </div>
      </footer>

    </div>

  )
}

export default RoomSuperior
