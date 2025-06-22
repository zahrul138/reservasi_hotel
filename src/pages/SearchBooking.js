import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaCheck } from "react-icons/fa"


// Enhanced CSS with proper responsive design
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

  .header {
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border-bottom: 1px solid #e5e7eb;
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background-color: white;
    color: #374151;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .back-button:hover {
    background-color: #f9fafb;
    border-color: #D09500;
  }

  .header-title {
    text-align: center;
    flex: 1;
  }

  .title {
    font-size: 28px;
    font-weight: bold;
    color: #D09500;
    margin: 0 0 4px 0;
  }

  .subtitle {
    color: #6B7280;
    font-size: 14px;
    margin: 0;
  }

  .header-spacer {
    width: 120px;
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
  }

  .summary-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 32px;
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

    .summary-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .summary-card {
      padding: 24px;
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
    .header-content {
      flex-direction: column;
      text-align: center;
    }

    .header-spacer {
      display: none;
    }

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
`

function SearchBooking() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("price-low");
  const navigate = useNavigate();
  const location = useLocation(); // <--- Ini penting buat trigger reload data

  const searchParams = location.state || {
    checkIn: null,
    checkOut: null,
    adults: 1,
    children: 0,
    guests: 1,
  };

  const totalGuests = (searchParams.adults || 0) + (searchParams.children || 0);

  const calculateNights = () => {
    const start = new Date(searchParams.checkIn);
    const end = new Date(searchParams.checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  function formatDate(dateString) {
    if (!dateString) return "Not selected";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadRooms = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://localhost:7298/api/room");
        const data = await res.json();

        // Semua room ditampilkan tanpa filter jumlah guest
        const availableRooms = data.map((room) => ({
          id: room.id,
          title: room.title,
          shortDescription: room.shortDescription,
          longDescription: room.fullDescription,
          price: room.price,
          originalPrice: room.price + 50,
          quantity: room.quantity,
          features: room.features ? room.features.split(",") : [],
          image: room.image1
            ? `https://localhost:7298${room.image1}`
            : "https://via.placeholder.com/400x300?text=No+Image",
          rating: 4.5,
          reviewCount: 120,
          size: room.size,
          bedType: room.bed,
          maxGuests: parseInt(room.occupancy) || 2,
          cancellation: "Free cancellation until 48 hours before check-in",
          breakfast: false,
          discount: 0,
        }));

        setRooms(availableRooms);
      } catch (err) {
        console.error("Failed to load rooms:", err);
        setRooms([]);
      }
      setLoading(false);
    };

    loadRooms();
  }, [location]);



  const sortRooms = (rooms, sortBy) => {
    const sorted = [...rooms];
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "popular":
        return sorted.sort((a, b) => b.reviewCount - a.reviewCount);
      default:
        return sorted;
    }
  };

  const sortedRooms = sortRooms(rooms, sortBy);

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
    };

    console.log("Proceeding to booking:", bookingDetails);
    alert(
      `Booking ${room.title} for ${nights} nights. Total: $${bookingDetails.totalPrice}`
    );
  };

  const goBackToSearch = () => {
    navigate(-1);
  };


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
          {/* Search Summary Card */}
          <div className="summary-card">
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
                  <p className="summary-value">{formatDate(searchParams.checkIn)}</p>
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
                  <p className="summary-value">{formatDate(searchParams.checkOut)}</p>
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
                  <p className="summary-value">
                    {searchParams.adults} Adult{searchParams.adults > 1 ? "s" : ""}
                    {searchParams.children > 0 && `, ${searchParams.children} Child${searchParams.children > 1 ? "ren" : ""}`}
                  </p>
                </div>
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
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
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
                      <img src={room.image} alt={room.title} className="room-image" />
                      <div className="badge-container">
                        <div className="quantity-badge">{room.quantity} units available</div>
                      </div>
                      <div className="rating-badge">
                        <span className="rating-value">{room.rating}</span>
                        <span className="rating-count">({room.reviewCount})</span>
                      </div>
                    </div>
                    <div className="room-content">
                      <div className="room-details">
                        <div className="room-header">
                          <h3 className="room-title">{room.title}</h3>
                          <p className="room-description">{room.shortDescription}</p>
                        </div>
                        <div className="room-info">
                          <div className="room-info-item">{room.size}</div>
                          <div className="room-info-item">{room.bedType}</div>
                          <div className="room-info-item">Max {room.maxGuests} guests</div>
                        </div>
                        <div className="features-section">
                          <h4 className="features-title">Features:</h4>
                          <div className="features-list">
                            {room.features.slice(0, 4).map((feature, i) => (
                              <div key={i} className="feature-badge">
                                <FaCheck /> {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="policy-section">
                          <div className="policy-badge">{room.cancellation}</div>
                        </div>
                      </div>
                      <div className="pricing-section">
                        <div className="price-info">
                          <div className="price-container">
                            <span className="price">${room.price}</span>
                            <span className="per-night">/ night</span>
                          </div>
                          <div className="total-price">
                            <span className="total-value">${room.price * nights}</span> total for {nights} nights
                          </div>
                        </div>
                        <button className="book-button" onClick={() => handleBookRoom(room)}>Book Now</button>
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
