import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Latar1 from "../assets/images/FotoLatar1.png";
import DeluxeBG from "../assets/images/DeluxeBG.png";
import HotelLobby from "../assets/images/HotelLobbyBG.png";
import Pool from "../assets/images/PoolBG.png";
import Restaurant from "../assets/images/RestaurantBG.png";
import Spa from "../assets/images/SpaBG.png";

import {
  FaHotel,
  FaSearch,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaUtensils,
  FaCalendarAlt,
  FaUserFriends,
  FaChild,
  FaCheck,
  FaChevronDown,
  FaQuoteLeft,
  FaArrowLeft,
  FaArrowRight,
  FaStar,
  FaCamera,
} from "react-icons/fa";

const styles = {
  page: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    color: "#333",
    lineHeight: 1.6,
    margin: 0,
    padding: 0,
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "4rem 2rem",
  },
  sectionTitle: {
    fontSize: "2.25rem",
    color: "#87723B",
    textAlign: "center",
    marginBottom: "1rem",
  },
  sectionDescription: {
    textAlign: "center",
    maxWidth: "700px",
    margin: "0 auto 3rem",
    color: "#666",
    fontSize: "1.1rem",
  },

  // Hero section
  hero: {
    height: "80vh",
    minHeight: "600px",
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${Latar1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    padding: "2rem",
    position: "relative",
  },
  heroContent: {
    padding: "2rem",
    borderRadius: "10px",
    maxWidth: "800px",
    color: "#1a1a1a",
  },
  smallHeading: {
    fontSize: "0.75rem",
    letterSpacing: "1.5px",
    color: "#fff",
    marginBottom: "0.5rem",
    textTransform: "uppercase",
  },
  underline: {
    width: "80px",
    height: "3px",
    backgroundColor: "#B4881B",
    margin: "0 auto 1.5rem auto",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
    color: "#fff",
  },
  heroDescription: {
    fontSize: "1rem",
    marginBottom: "1rem",
    lineHeight: "1.6",
    color: "#fff",
  },

  // Booking section
  bookingSection: {
    backgroundColor: "#f8f5f0",
    padding: "1rem 1rem",
  },
  bookingContainer: {
    maxWidth: "970px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    padding: "1.7rem",
    marginTop: "-95px",
    zIndex: 2,
    position: "relative",
  },
  bookingTitle: {
    marginBottom: "2rem",
    textAlign: "center",
    fontSize: "1.75rem",
    color: "#87723B",
  },
  bookingForm: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
  },
  bookingRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "1.5rem",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  formGroup: {
    minWidth: "200px",
  },
  formLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.30rem",
    fontWeight: 500,
    color: "#87723B",
    fontSize: "0.95rem",
  },
  formInput: {
    width: "97%",
    height: "1.70rem",
    padding: "0.875rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.2s",
  },
  guestSelector: {
    position: "relative",
    width: "95%",
  },
  guestDisplay: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "0.875rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "white",
    transition: "all 0.2s",
  },
  guestDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    width: "100%",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
    padding: "1rem",
    marginTop: "0.5rem",
    zIndex: 10,
    border: "1px solid #e2e8f0",
  },
  guestTypeRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
    padding: "0.5rem 0",
  },
  guestTypeLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: 500,
  },
  guestCounter: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    overflow: "hidden",
  },
  counterButton: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f5f0",
    border: "none",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  counterValue: {
    width: "40px",
    textAlign: "center",
    padding: "0.25rem",
    fontSize: "0.95rem",
    fontWeight: 500,
  },
  applyButton: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#D09500",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  searchButton: {
    width: "90%",
    marginTop: "2px",
    padding: "1rem",
    backgroundColor: "#D09500",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 200,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "all 0.2s",
    fontSize: "1.1rem",
    boxShadow: "0 4px 6px rgba(208, 149, 0, 0.2)",
    height: "57px",
  },

  // Rooms section
  roomsSection: {
    backgroundColor: "#f8f5f0",
  },
  roomsGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "2.5rem",
    marginBottom: "3rem",
    justifyContent: "center",
  },
  roomCard: {
    position: "relative",
    backgroundColor: "white",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.3s, box-shadow 0.3s",
    border: "1px solid #f0f0f0",
    width: "350px",
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
  },
  roomImage: {
    borderRadius: "5px",
    height: "200px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  roomDetails: {
    padding: "1.75rem",
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
  },
  roomTitle: {
    fontSize: "1.4rem",
    color: "#87723B",
    marginBottom: "0.75rem",
    fontWeight: 600,
  },
  roomDescription: {
    color: "#666",
    marginBottom: "1.25rem",
    fontSize: "0.95rem",
    height: "40px", // Ganti dari minHeight
    overflow: "hidden",
  },
  roomFeatures: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.75rem",
    marginBottom: "1.25rem",
    height: "80px", // Ganti dari minHeight
    overflow: "hidden",
  },
  roomFeature: {
    fontSize: "0.875rem",
    color: "#666",
    backgroundColor: "#f8f5f0",
    padding: "0.35rem 0.75rem",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
  },
  roomPrice: {
    marginBottom: "1.5rem",
    fontSize: "0.95rem",
    color: "#666",
    display: "flex",
    alignItems: "baseline",
    gap: "0.25rem",
  },
  price: {
    fontSize: "1.75rem",
    fontWeight: 700,
    color: "#D09500",
  },
  viewDetailsButton: {
    display: "block",
    textAlign: "center",
    padding: "0.875rem",
    backgroundColor: "transparent",
    border: "1px solid #D09500",
    color: "#D09500",
    borderRadius: "8px",
    fontWeight: 500,
    transition: "all 0.2s",
    cursor: "pointer",
    textDecoration: "none",
    marginTop: "auto",
  },

  // Amenities section
  amenitiesSection: {
    backgroundColor: "#ffffff",
  },
  amenitiesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "2.5rem",
  },
  amenityCard: {
    textAlign: "center",
    padding: "2.5rem 2rem",
    borderRadius: "12px",
    backgroundColor: "#f8f5f0",
    transition: "transform 0.3s, box-shadow 0.3s",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
  },
  amenityIcon: {
    fontSize: "2.75rem",
    color: "#D09500",
    marginBottom: "1.25rem",
  },
  amenityTitle: {
    fontSize: "1.25rem",
    color: "#87723B",
    marginBottom: "0.75rem",
    fontWeight: 600,
  },
  amenityDescription: {
    color: "#666",
    fontSize: "0.95rem",
  },

  // CTA section
  ctaSection: {
    background: "linear-gradient(135deg, #87723B, #D09500)",
    color: "white",
    padding: "5rem 2rem",
    textAlign: "center",
  },
  ctaContainer: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  ctaTitle: {
    color: "white",
    marginBottom: "1.25rem",
    fontSize: "2.5rem",
  },
  ctaDescription: {
    marginBottom: "2.5rem",
    fontSize: "1.25rem",
    opacity: "0.9",
  },
  ctaButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  secondaryButton: {
    display: "inline-block",
    padding: "0.875rem 2rem",
    backgroundColor: "white",
    color: "#D09500",
    fontWeight: 600,
    fontSize: "1.125rem",
    borderRadius: "6px",
    transition: "all 0.2s",
    cursor: "pointer",
    textDecoration: "none",
    border: "1px solid #D09500", // << tambahin ini yaa
  },
  testimonialsSection: {
    backgroundColor: "#f8f5f0",
    padding: "5rem 2rem",
  },
  testimonialSlider: {
    position: "relative",
    maxWidth: "900px",
    margin: "0 auto",
    overflow: "hidden",
  },
  testimonialSlide: {
    padding: "2rem",
    textAlign: "center",
  },
  testimonialQuote: {
    fontSize: "1.5rem",
    color: "#666",
    fontStyle: "italic",
    marginBottom: "1.5rem",
    position: "relative",
    paddingTop: "2rem",
  },
  quoteIcon: {
    color: "#D09500",
    fontSize: "2rem",
    position: "absolute",
    top: "0",
    left: "50%",
    transform: "translateX(-50%)",
    opacity: "0.5",
  },
  testimonialAuthor: {
    fontWeight: "600",
    color: "#87723B",
    fontSize: "1.1rem",
  },
  testimonialLocation: {
    color: "#666",
    fontSize: "0.9rem",
  },
  testimonialRating: {
    display: "flex",
    justifyContent: "center",
    gap: "0.25rem",
    margin: "1rem 0",
  },
  sliderControls: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
    marginTop: "2rem",
  },
  sliderButton: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f5f0",
    border: "none",
    color: "#87723B",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  sliderDots: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
    marginTop: "1rem",
  },
  sliderDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: "#e2e8f0",
    border: "none",
    padding: "0",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  gallerySection: {
    backgroundColor: "#ffffff",
    padding: "5rem 2rem",
  },
  galleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  galleryItem: {
    position: "relative",
    height: "200px",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "all 0.3s",
  },
  galleryOverlay: {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: "0",
    transition: "opacity 0.3s",
  },
  galleryIcon: {
    color: "white",
    fontSize: "2rem",
  },
  galleryModal: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "1000",
  },
  modalContent: {
    position: "relative",
    width: "90vw",
    maxWidth: "800px",
    height: "50vh",
    maxHeight: "500px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    borderRadius: "8px",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "4px",
  },
  modalClose: {
    position: "absolute",
    top: "-40px",
    right: "0",
    color: "white",
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    cursor: "pointer",
  },
  modalNav: {
    position: "absolute",
    top: "50%",
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
    transform: "translateY(-50%)",
  },
  modalNavButton: {
    background: "rgba(255, 255, 255, 0.2)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  offersSection: {
    backgroundColor: "#f8f5f0",
    padding: "5rem 2rem",
  },
  offersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  offerCard: {
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.3s, box-shadow 0.3s",
    backgroundColor: "white",
    border: "1px solid #f0f0f0",
  },
  offerImage: {
    height: "200px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
  },
  offerBadge: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    backgroundColor: "#D09500",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontWeight: "600",
    fontSize: "0.875rem",
  },
  offerContent: {
    padding: "1.75rem",
  },
  offerTitle: {
    fontSize: "1.4rem",
    color: "#87723B",
    marginBottom: "0.75rem",
    fontWeight: "600",
  },
  offerDescription: {
    color: "#666",
    marginBottom: "1.25rem",
    fontSize: "0.95rem",
  },
  offerDetails: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.25rem",
  },
  offerPrice: {
    fontSize: "1.5rem",
    fontWeight: "700",
    color: "#D09500",
  },
  offerPriceStrike: {
    textDecoration: "line-through",
    color: "#999",
    fontSize: "1rem",
    marginRight: "0.5rem",
  },
  offerButton: {
    display: "block",
    width: "100%",
    textAlign: "center",
    padding: "0.875rem",
    backgroundColor: "#D09500",
    color: "white",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "all 0.2s",
    cursor: "pointer",
    border: "none",
    textDecoration: "none",
  },

  // Footer
  footer: {
    backgroundColor: "#222",
    color: "#f8f5f0",
    paddingTop: "4rem",
  },
  footerContainer: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem 3rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "3rem",
  },
  footerLogo: {
    display: "flex",
    alignItems: "center",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#D09500",
    marginBottom: "1rem",
  },
  footerText: {
    color: "#ccc",
    marginBottom: "0.5rem",
    fontSize: "0.95rem",
  },
  footerTitle: {
    color: "#D09500",
    marginBottom: "1.25rem",
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  footerLink: {
    color: "#ccc",
    transition: "color 0.2s",
    display: "block",
    marginBottom: "0.75rem",
    textDecoration: "none",
  },
  footerBottom: {
    backgroundColor: "#111",
    padding: "1.5rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
  },
  copyright: {
    color: "#999",
    fontSize: "0.9rem",
  },
  footerLinks: {
    display: "flex",
    gap: "1.5rem",
  },
};

const API_URL = "https://localhost:7298";

function Homepage() {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const featuredRef = useRef(null);
  const guestDropdownRef = useRef(null);

  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/room`)
      .then(res => res.json())
      .then(data => setRooms(data));
  }, []);

  const testimonials = [
    {
      quote:
        "Our stay at Golden Stays was absolutely perfect. The staff went above and beyond to make our anniversary special.",
      author: "Sarah & Michael Johnson",
      location: "New York, USA",
      rating: 5,
    },
    {
      quote:
        "The rooms are spacious and beautifully designed. The location is perfect for exploring the city. Will definitely return!",
      author: "David Williams",
      location: "London, UK",
      rating: 5,
    },
    {
      quote:
        "Exceptional service and amenities. The restaurant serves delicious food and the spa treatments were amazing.",
      author: "Emma Rodriguez",
      location: "Toronto, Canada",
      rating: 4,
    },
  ];

  const galleryImages = [
    { id: 1, url: HotelLobby, alt: "Hotel Lobby" },
    { id: 2, url: DeluxeBG, alt: "Deluxe Room" },
    { id: 3, url: Pool, alt: "Swimming Pool" },
    { id: 4, url: Restaurant, alt: "Restaurant" },
    { id: 5, url: Spa, alt: "Spa" },
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        guestDropdownRef.current &&
        !guestDropdownRef.current.contains(event.target)
      ) {
        setIsGuestDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [guestDropdownRef]);

  const handleSearch = (e) => {
    e.preventDefault(); // wajib biar nggak error “form not connected”

    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    if (adults + children === 0) {
      alert("Please select at least 1 guest.");
      return;
    }

    navigate("/searchbooking", {
      state: {
        checkIn,
        checkOut,
        adults,
        children,
        guests: adults + children,
      },
    });
  };


  const incrementAdults = () => {
    if (adults < 10) setAdults(adults + 1);
  };

  const decrementAdults = () => {
    if (adults > 0) setAdults(adults - 1);
  };

  const incrementChildren = () => {
    if (children < 6) setChildren(children + 1);
  };

  const decrementChildren = () => {
    if (children > 0) setChildren(children - 1);
  };

  const toggleGuestDropdown = () => {
    setIsGuestDropdownOpen(!isGuestDropdownOpen);
  };

  const totalGuests = adults + children;

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  const openGallery = (index) => {
    setSelectedImage(index);
    setGalleryOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeGallery = () => {
    setGalleryOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = () => {
    setSelectedImage((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImage((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleScrollToFeatured = () => {
    if (featuredRef.current) {
      const yOffset = -80;
      const y =
        featuredRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };



  return (
    <div style={styles.page}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.smallHeading}>
            WELCOME TO ROYAL GOLD BATAM HOTEL
          </div>
          <div style={styles.underline}></div>
          <h1 style={styles.heroTitle}>
            Explore Indonesia from our 5-star hotel in Batam
          </h1>
          <p style={styles.heroDescription}>
            Batam Royal Gold invites you to experience the best of Batam Island, Indonesia — where 5-star luxury, exceptional service, and premium high-tech amenities come together in the exclusive Royal Gold area.
          </p>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" style={styles.bookingSection}>
        <div style={styles.bookingContainer}>
          <form onSubmit={handleSearch} style={styles.bookingForm}>
            <div style={styles.bookingRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaCalendarAlt />
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  style={styles.formInput}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#D09500";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(208, 149, 0, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaCalendarAlt />
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  min={checkIn}
                  required
                  style={styles.formInput}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#D09500";
                    e.currentTarget.style.boxShadow =
                      "0 0 0 3px rgba(208, 149, 0, 0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaUserFriends />
                  Guests
                </label>
                <div style={styles.guestSelector} ref={guestDropdownRef}>
                  <div
                    style={{
                      ...styles.guestDisplay,
                      borderColor: isGuestDropdownOpen ? "#D09500" : "#e2e8f0",
                      boxShadow: isGuestDropdownOpen
                        ? "0 0 0 3px rgba(208, 149, 0, 0.15)"
                        : "none",
                    }}
                    onClick={toggleGuestDropdown}
                  >
                    <span>
                      {totalGuests} {totalGuests === 1 ? "Guest" : "Guests"} (
                      {adults} Adults, {children} Children)
                    </span>
                    <FaChevronDown
                      style={{
                        transform: isGuestDropdownOpen
                          ? "rotate(180deg)"
                          : "rotate(0)",
                        transition: "transform 0.2s",
                        color: "#87723B",
                      }}
                    />
                  </div>

                  {isGuestDropdownOpen && (
                    <div style={styles.guestDropdown}>
                      <div style={styles.guestTypeRow}>
                        <div style={styles.guestTypeLabel}>
                          <FaUserFriends />
                          <span>Adults</span>
                        </div>
                        <div style={styles.guestCounter}>
                          <button
                            type="button"
                            onClick={decrementAdults}
                            style={styles.counterButton}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#e2e8f0";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#f8f5f0";
                            }}
                          >
                            -
                          </button>
                          <div style={styles.counterValue}>{adults}</div>
                          <button
                            type="button"
                            onClick={incrementAdults}
                            style={styles.counterButton}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#e2e8f0";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#f8f5f0";
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={styles.guestTypeRow}>
                        <div style={styles.guestTypeLabel}>
                          <FaChild />
                          <span>Children (&lt;13)</span>
                        </div>
                        <div style={styles.guestCounter}>
                          <button
                            type="button"
                            onClick={decrementChildren}
                            style={styles.counterButton}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#e2e8f0";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#f8f5f0";
                            }}
                          >
                            -
                          </button>
                          <div style={styles.counterValue}>{children}</div>
                          <button
                            type="button"
                            onClick={incrementChildren}
                            style={styles.counterButton}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = "#e2e8f0";
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = "#f8f5f0";
                            }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        style={styles.applyButton}
                        onClick={() => setIsGuestDropdownOpen(false)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#87723B";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#D09500";
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={styles.formGroup}>
                <label
                  style={{ visibility: "hidden", marginBottom: "0.75rem" }}
                >
                  Search
                </label>
                <button
                  type="submit" // ← Ubah dari "submit" ke "button"
                  style={styles.searchButton}
                  onClick={handleSearch} // ← Pindahkan ke sini
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#87723B";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 8px rgba(208, 149, 0, 0.25)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#D09500";
                    e.currentTarget.style.transform = "none";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(208, 149, 0, 0.2)";
                  }}
                >
                  <FaSearch /> Search
                </button>

              </div>
            </div>
          </form>
        </div>
      </section>

      {/* DYNAMIC FEATURED ROOMS */}
      <section id="rooms" ref={featuredRef} style={styles.roomsSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Our Accommodations</h2>
          <p style={styles.sectionDescription}>
            Choose from our selection of comfortable and elegant rooms
          </p>
          <div style={styles.roomsGrid}>
            {rooms.length === 0 && (
              <div style={{ color: "#D09500", fontWeight: 500, textAlign: "center" }}>
                No rooms available.
              </div>
            )}
            {rooms.map((room) => (
              <div
                key={room.id}
                style={styles.roomCard}
                onMouseOver={e => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)";
                }}
                onMouseOut={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)";
                }}
              >
                <div
                  style={{
                    ...styles.roomImage,
                    backgroundImage: (() => {
                      if (room.image1) {
                        if (room.image1.startsWith("/uploads/")) {
                          return `url(${API_URL}${room.image1})`;
                        }
                        if (room.image1.startsWith("http")) {
                          return `url(${room.image1})`;
                        }
                      }
                      return 'url("https://via.placeholder.com/350x200")';
                    })(),
                  }}
                ></div>
                <div style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  backgroundColor: "#ffffff",
                  color: "#D09500",
                  border: "1px solid #D09500",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "12px",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  zIndex: 2
                }}>
                  {room.quantity} room left
                </div>
                <div style={styles.roomDetails}>
                  <h3 style={styles.roomTitle}>{room.title}</h3>
                  <p style={styles.roomDescription}>{room.shortDescription}</p>
                  <div style={styles.roomFeatures}>
                    {(room.features?.split(",").slice(0, 3) || []).map((feat, i) => (
                      <span key={i} style={styles.roomFeature}>
                        <FaCheck size={12} /> {feat}
                      </span>
                    ))}
                  </div>
                  <div style={styles.roomPrice}>
                    <span style={styles.price}>Rp {room.price.toLocaleString("id-ID")}</span>/ night
                  </div>
                  <Link
                    to={`/room/${room.id}`}
                    style={styles.viewDetailsButton}
                    onMouseOver={e => {
                      e.currentTarget.style.backgroundColor = "#D09500";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseOut={e => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#D09500";
                    }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Amenities */}
      <section id="amenities" style={styles.amenitiesSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Hotel Amenities</h2>
          <p style={styles.sectionDescription}>
            Enjoy our premium facilities during your stay
          </p>

          <div
            style={
              isMobile
                ? { ...styles.amenitiesGrid, gridTemplateColumns: "1fr" }
                : styles.amenitiesGrid
            }
          >
            <div
              style={styles.amenityCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 15px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div style={styles.amenityIcon}>
                <FaWifi />
              </div>
              <h3 style={styles.amenityTitle}>Free Wi-Fi</h3>
              <p style={styles.amenityDescription}>
                High-speed internet throughout the property
              </p>
            </div>

            <div
              style={styles.amenityCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 15px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div style={styles.amenityIcon}>
                <FaParking />
              </div>
              <h3 style={styles.amenityTitle}>Parking</h3>
              <p style={styles.amenityDescription}>
                Secure on-site parking for guests
              </p>
            </div>

            <div
              style={styles.amenityCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 15px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div style={styles.amenityIcon}>
                <FaSwimmingPool />
              </div>
              <h3 style={styles.amenityTitle}>Swimming Pool</h3>
              <p style={styles.amenityDescription}>
                Indoor heated pool open year-round
              </p>
            </div>

            <div
              style={styles.amenityCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow =
                  "0 10px 15px rgba(0, 0, 0, 0.1)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow =
                  "0 4px 6px rgba(0, 0, 0, 0.05)";
              }}
            >
              <div style={styles.amenityIcon}>
                <FaUtensils />
              </div>
              <h3 style={styles.amenityTitle}>Restaurant</h3>
              <p style={styles.amenityDescription}>
                On-site dining with room service available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={styles.testimonialsSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>What Our Guests Say</h2>
          <p style={styles.sectionDescription}>
            Read testimonials from guests who have experienced our hospitality
          </p>

          <div style={styles.testimonialSlider}>
            <div style={styles.testimonialSlide}>
              <div style={styles.testimonialQuote}>
                <FaQuoteLeft style={styles.quoteIcon} />
                {testimonials[currentTestimonial].quote}
              </div>
              <div style={styles.testimonialRating}>
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <FaStar key={i} style={{ color: "#D09500" }} />
                  )
                )}
              </div>
              <div style={styles.testimonialAuthor}>
                {testimonials[currentTestimonial].author}
              </div>
              <div style={styles.testimonialLocation}>
                {testimonials[currentTestimonial].location}
              </div>
            </div>

            <div style={styles.sliderControls}>
              <button
                style={styles.sliderButton}
                onClick={prevTestimonial}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#e2e8f0";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f5f0";
                }}
              >
                <FaArrowLeft />
              </button>
              <button
                style={styles.sliderButton}
                onClick={nextTestimonial}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#e2e8f0";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#f8f5f0";
                }}
              >
                <FaArrowRight />
              </button>
            </div>

            <div style={styles.sliderDots}>
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  style={{
                    ...styles.sliderDot,
                    backgroundColor:
                      currentTestimonial === index ? "#D09500" : "#e2e8f0",
                    width: currentTestimonial === index ? "12px" : "10px",
                    height: currentTestimonial === index ? "12px" : "10px",
                  }}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section style={styles.gallerySection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Photo Gallery</h2>
          <p style={styles.sectionDescription}>
            Take a visual tour of our hotel and facilities
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
              gridTemplateRows: isMobile ? "repeat(3, 200px)" : "200px 200px",
              gap: "1rem",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {/* Gambar utama (besar) */}
            <div
              style={{
                gridColumn: isMobile ? "span 2" : "span 2",
                gridRow: "span 2",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => openGallery(0)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.querySelector(".overlay").style.opacity = "1";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.querySelector(".overlay").style.opacity = "0";
              }}
            >
              <img
                src={HotelLobby}
                alt={galleryImages[0].alt}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="overlay" style={styles.galleryOverlay}>
                <FaCamera style={styles.galleryIcon} />
              </div>
            </div>

            {/* Spa */}
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => openGallery(1)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.querySelector(".overlay").style.opacity = "1";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.querySelector(".overlay").style.opacity = "0";
              }}
            >
              <img
                src={Spa}
                alt="Spa Facility"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="overlay" style={styles.galleryOverlay}>
                <FaCamera style={styles.galleryIcon} />
              </div>
            </div>

            {/* Restaurant */}
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => openGallery(2)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.querySelector(".overlay").style.opacity = "1";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.querySelector(".overlay").style.opacity = "0";
              }}
            >
              <img
                src={Restaurant}
                alt="Restaurant"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="overlay" style={styles.galleryOverlay}>
                <FaCamera style={styles.galleryIcon} />
              </div>
            </div>

            {/* Pool */}
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => openGallery(3)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.querySelector(".overlay").style.opacity = "1";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.querySelector(".overlay").style.opacity = "0";
              }}
            >
              <img
                src={Pool}
                alt="Swimming Pool"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="overlay" style={styles.galleryOverlay}>
                <FaCamera style={styles.galleryIcon} />
              </div>
            </div>

            {/* Deluxe Room */}
            <div
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                cursor: "pointer",
              }}
              onClick={() => openGallery(4)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.querySelector(".overlay").style.opacity = "1";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.querySelector(".overlay").style.opacity = "0";
              }}
            >
              <img
                src={DeluxeBG}
                alt="Deluxe Room"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div className="overlay" style={styles.galleryOverlay}>
                <FaCamera style={styles.galleryIcon} />
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <button
              onClick={() => openGallery(0)}
              style={{
                display: "inline-block",
                padding: "0.75rem 1.5rem",
                backgroundColor: "transparent",
                border: "3px solid #87723B",
                color: "#87723B",
                borderRadius: "6px",
                fontWeight: "650",
                transition: "all 0.2s",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#87723B";
                e.currentTarget.style.color = "white";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#87723B";
              }}
            >
              View All Photos
            </button>

          </div>

          {galleryOpen && (
            <div style={styles.galleryModal} onClick={closeGallery}>
              <div
                style={styles.modalContent}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={galleryImages[selectedImage].url || "/placeholder.svg"}
                  alt={galleryImages[selectedImage].alt}
                  style={styles.modalImage}
                />
                <button style={styles.modalClose} onClick={closeGallery}>
                  ×
                </button>
                <div style={styles.modalNav}>
                  <button
                    style={styles.modalNavButton}
                    onClick={prevImage}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.2)";
                    }}
                  >
                    <FaArrowLeft />
                  </button>
                  <button
                    style={styles.modalNavButton}
                    onClick={nextImage}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.3)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255, 255, 255, 0.2)";
                    }}
                  >
                    <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Special Offers Section
      <section style={styles.offersSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Special Offers</h2>
          <p style={styles.sectionDescription}>Take advantage of our exclusive deals and packages</p>

          <div style={styles.offersGrid}>
            {specialOffers.map((offer, index) => (
              <div
                key={index}
                style={styles.offerCard}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)"
                  e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)"
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "none"
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)"
                }}
              >
                <div style={{ ...styles.offerImage, backgroundImage: `url(${offer.image})` }}>
                  <div style={styles.offerBadge}>{offer.badge}</div>
                </div>
                <div style={styles.offerContent}>
                  <h3 style={styles.offerTitle}>{offer.title}</h3>
                  <p style={styles.offerDescription}>{offer.description}</p>
                  <div style={styles.offerDetails}>
                    <div>
                      <span style={styles.offerPriceStrike}>{offer.regularPrice}</span>
                      <span style={styles.offerPrice}>{offer.discountPrice}</span>
                    </div>
                    <div style={{ fontSize: "0.875rem", color: "#666" }}>{offer.validUntil}</div>
                  </div>
                  <a
                    href="#booking"
                    style={styles.offerButton}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "#87723B"
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#D09500"
                    }}
                  >
                    Book This Offer
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Ready to Experience Our Hospitality?</h2>
          <p style={styles.ctaDescription}>
            Book directly with us for the best rates and personalized service
          </p>
          <div style={styles.ctaButtons}>
            <button
              onClick={handleScrollToFeatured}
              style={styles.secondaryButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "white";
                e.currentTarget.style.transform = "none";
              }}
            >
              Book Now
            </button>

            {!localStorage.getItem("user") && (
              <Link
                to="/signup"
                style={styles.secondaryButton}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.transform = "none";
                }}
              >
                Create Account
              </Link>
            )}


          </div>
        </div>
      </section>



      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContainer}>
          <div>
            <div style={styles.footerLogo}>
              <FaHotel style={{ marginRight: "0.5rem" }} />
              <span>Golden Stays</span>
            </div>
            <p style={styles.footerText}>
              Experience luxury, comfort, and convenience at its finest. Your perfect stay starts here.
            </p>
          </div>

          <div>
            <h3 style={styles.footerTitle}>Quick Links</h3>
            <a href="#rooms" style={styles.footerLink}>
              Rooms & Suites
            </a>
            <a href="#amenities" style={styles.footerLink}>
              Amenities
            </a>
            <a href="#" style={styles.footerLink}>
              Location
            </a>
            <a href="#" style={styles.footerLink}>
              Contact Us
            </a>
          </div>

          <div>
            <h3 style={styles.footerTitle}>Contact</h3>
            <p style={styles.footerText}>123 Hotel Street</p>
            <p style={styles.footerText}>City, State 12345</p>
            <p style={styles.footerText}>Phone: (123) 456-7890</p>
            <p style={styles.footerText}>Email: info@goldenstays.com</p>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.copyright}>
            &copy; 2023 Golden Stays. All rights reserved.
          </p>
          <div style={styles.footerLinks}>
            <a href="#" style={{ ...styles.footerLink, marginBottom: 0 }}>
              Privacy Policy
            </a>
            <a href="#" style={{ ...styles.footerLink, marginBottom: 0 }}>
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
