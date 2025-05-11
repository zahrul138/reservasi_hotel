// src/pages/booking.js
import { width } from '@mui/system';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuperiorBG from "../assets/images/SuperiorBG.png";

// This is a complete booking component with styles included
function Booking() {
  // CSS Styles 
  const styles = {
    
    bookingPage: {
      padding:  '80px 0 40px',
      backgroundColor: '#f8f7e7',
      minHeight: '100vh',
      marginTop: '80px', 
    },

    container: {
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
    },
    pageTitle: {
      textAlign: 'center',
      marginBottom: '30px',
      marginTop: '40px', 
      fontSize: '45px',
      fontWeight: '500',
    },
    bookingContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      '@media (min-width: 992px)': {
        flexDirection: 'row',
      },
    },
    bookingFormContainer: {
      flex: '2',
    },
    bookingSidebar: {
      flex: '1',
    },
    formSection: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    sectionTitle: {
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '10px',
    },
    sectionDescription: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '20px',
    },
    formRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '15px',
      marginBottom: '15px',
    },
    formGroup: {
      flex: '1',
      minWidth: '200px',
      marginBottom: '15px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      marginBottom: '5px',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    inputError: {
      width: '100%',
      padding: '10px',
      border: '1px solid #e74c3c',
      borderRadius: '4px',
      fontSize: '14px',
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      resize: 'vertical',
    },
    formCheck: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    checkbox: {
      marginRight: '10px',
    },
    termsText: {
      fontSize: '12px',
      color: '#666',
      marginBottom: '15px',
    },
    note: {
      fontSize: '12px',
      color: '#999',
      marginTop: '5px',
    },
    roomOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '20px',
    },
    roomOption: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s',
    },
    roomOptionSelected: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      border: '1px solid #000',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: '#f9f9f9',
    },
    roomOptionRadio: {
      marginRight: '15px',
    },
    roomOptionName: {
      fontWeight: '500',
    },
    roomOptionPrice: {
      fontSize: '14px',
      color: '#666',
    },
    paymentOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '20px',
    },
    paymentOption: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    paymentOptionRadio: {
      marginRight: '15px',
    },
    paymentIcon: {
      marginRight: '10px',
      fontSize: '18px',
    },
    creditCardFields: {
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #eee',
    },
    preferencesContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '30px',
      marginBottom: '20px',
    },
    preferencesColumn: {
      flex: '1',
      minWidth: '200px',
    },
    preferencesTitle: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '10px',
    },
    preferenceOption: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    preferenceCheckbox: {
      marginRight: '10px',
    },
    stayPeriod: {
      marginTop: '20px',
      marginBottom: '20px',
    },
    roomPreview: {
      display: 'flex',
      backgroundColor: 'white',
      borderRadius: '12px', // biar lebih lembut
      padding: '20px', // ini penting biar kontennya ga mepet pinggir
      gap: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      marginBottom: '20px',
      alignItems: 'center',
    },
    roomImage: {
      width: '200px',
      height: '150px',
      objectFit: 'cover',
      borderRadius: '8px',
    },
    roomImageLarge: {
      width: '100%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '8px',
    },
    roomCardContainer: {
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'white', // ⬅️ penting ini biar putih!
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      gap: '20px', // kasih jarak antara gambar dan teks
    },
    roomContent: {
      padding: '20px', // ⬅️ padding sekarang di sini
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    },
    roomDetails: {
      padding: '15px',
      width: '50%'
    },
    roomDetailsTitle: {
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '5px',
    },
    roomDescription: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '10px',
    },
    roomInfo: {
      fontSize: '12px',
      color: '#888',
    },
    bookingSummary: {
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    summaryTitle: {
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '15px',
    },
    summaryItem: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      fontSize: '14px',
    },
    summaryDivider: {
      height: '1px',
      backgroundColor: '#eee',
      margin: '15px 0',
    },
    summaryTotal: {
      display: 'flex',
      justifyContent: 'space-between',
      fontWeight: '500',
      fontSize: '16px',
    },
    bookNowButton: {
      display: 'block',
      width: '100%',
      padding: '15px',
      backgroundColor: '#000',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontWeight: '500',
      cursor: 'pointer',
      marginTop: '20px',
    },
    errorMessage: {
      color: '#e74c3c',
      fontSize: '12px',
      marginTop: '5px',
    },
    termsCheck: {
      marginTop: '10px',
    },
    termsLink: {
      color: '#000',
      textDecoration: 'underline',
    },
  };

  const navigate = useNavigate();
  
  // Room data - in a real app, you might fetch this from an API
  const roomTypes = [
    { id: 'superior', name: 'Superior Room', price: 1117256, maxOccupancy: 2 },
    { id: 'deluxe', name: 'Deluxe Room', price: 150, maxOccupancy: 2 },
    { id: 'executive', name: 'Executive Room', price: 200, maxOccupancy: 3 }
  ];

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    roomType: 'superior',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    specialRequests: '',
    paymentMethod: 'credit',
    agreeToTerms: false
  });

  // Room preferences state
  const [roomPreferences, setRoomPreferences] = useState({
    nonSmoking: false,
    highFloor: false,
    quietRoom: false,
    babyCrib: false,
    bathtub: false,
    shower: true,
    earlyCheckin: false
  });

  // Validation state
  const [errors, setErrors] = useState({});
  
  // Selected room state
  const [selectedRoom, setSelectedRoom] = useState(roomTypes[0]);
  
  // Booking summary state
  const [summary, setSummary] = useState({
    nights: 0,
    roomPrice: 0,
    taxesAndFees: 0,
    totalPrice: 0
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle room preference changes
  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setRoomPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  // Update selected room when roomType changes
  useEffect(() => {
    const room = roomTypes.find(room => room.id === formData.roomType);
    setSelectedRoom(room);
  }, [formData.roomType]);

  // Calculate booking summary when relevant fields change
  useEffect(() => {
    if (formData.checkIn && formData.checkOut && selectedRoom) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      
      // Calculate number of nights
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      if (nights > 1175000) {
        const roomPrice = selectedRoom.price * nights;
        const taxesAndFees = roomPrice * 0.1; // Assuming 10% tax
        const totalPrice = roomPrice + taxesAndFees;
        
        setSummary({
          nights,
          roomPrice,
          taxesAndFees,
          totalPrice
        });
      }
    }
  }, [formData.checkIn, formData.checkOut, selectedRoom]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    // Email format
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    // Check-in and check-out dates
    if (!formData.checkIn) newErrors.checkIn = 'Check-in date is required';
    if (!formData.checkOut) newErrors.checkOut = 'Check-out date is required';
    
    // Check if check-out is after check-in
    if (formData.checkIn && formData.checkOut) {
      const checkInDate = new Date(formData.checkIn);
      const checkOutDate = new Date(formData.checkOut);
      
      if (checkOutDate <= checkInDate) {
        newErrors.checkOut = 'Check-out date must be after check-in date';
      }
    }
    
    // Terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Combine all booking data
      const bookingData = {
        ...formData,
        roomPreferences,
        bookingSummary: summary,
        bookingDate: new Date().toISOString(),
        bookingId: generateBookingId(),
        status: 'confirmed'
      };
      
      // In a real app, you would send this data to your backend
      console.log('Booking data:', bookingData);
      
      // Store booking data in localStorage (for demo purposes)
      localStorage.setItem('bookingData', JSON.stringify(bookingData));
      
      // Navigate to confirmation page
      navigate('/confirm');
    } else {
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Generate a random booking ID
  const generateBookingId = () => {
    return 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
  };

  // Get today's date in YYYY-MM-DD format for date inputs
  const today = new Date().toISOString().split('T')[0];

  // Apply media query for responsive layout
  const applyResponsiveStyles = () => {
    if (window.innerWidth >= 992) {
      return {
        display: 'flex',
        flexDirection: 'row',
        gap: '20px'
      };
    } else {
      return {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      };
    }
  };

  return (
    <div style={styles.bookingPage}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>Complete Your Order</h1>
        
        <div style={applyResponsiveStyles()}>
          {/* Left side - Booking form */}
          <div style={styles.bookingFormContainer}>
            <form onSubmit={handleSubmit}>
              {/* Guest Information */}
              <div style={styles.formSection}>
                <h2 style={styles.sectionTitle}>Guest Information</h2>
                <p style={styles.sectionDescription}>All fields are required to book a room</p>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="firstName">First Name</label>
                    <input
                      style={errors.firstName ? styles.inputError : styles.input}
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && <div style={styles.errorMessage}>{errors.firstName}</div>}
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="lastName">Last Name</label>
                    <input
                      style={errors.lastName ? styles.inputError : styles.input}
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && <div style={styles.errorMessage}>{errors.lastName}</div>}
                  </div>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="email">Email</label>
                  <input
                    style={errors.email ? styles.inputError : styles.input}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <div style={styles.errorMessage}>{errors.email}</div>}
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="phone">Mobile Number</label>
                  <input
                    style={errors.phone ? styles.inputError : styles.input}
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {errors.phone && <div style={styles.errorMessage}>{errors.phone}</div>}
                </div>
                
                <p style={styles.termsText}>
                  By signing up, I agree to the terms and conditions and confirm that the information provided is my own.
                </p>
                
                <div style={styles.formCheck}>
                  <input
                    style={styles.checkbox}
                    type="checkbox"
                    id="promotionalEmails"
                    name="promotionalEmails"
                    checked={formData.promotionalEmails}
                    onChange={handleChange}
                  />
                  <label htmlFor="promotionalEmails">I agree to receive promotional emails</label>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="country">Country of Origin</label>
                    <select
                      style={styles.select}
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                      <option value="ID">Indonesia</option>
                      <option value="SG">Singapore</option>
                      <option value="MY">Malaysia</option>
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="address">Address Line 1</label>
                    <input
                      style={styles.input}
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="city">City</label>
                    <input
                      style={styles.input}
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="zipCode">Zip/Postal Code</label>
                    <input
                      style={styles.input}
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Room Selection */}
              <div style={styles.formSection}>
                <h2 style={styles.sectionTitle}>Room Selection</h2>
                
                <div style={styles.roomOptions}>
                  {roomTypes.map(room => (
                    <div 
                      key={room.id} 
                      style={formData.roomType === room.id ? styles.roomOptionSelected : styles.roomOption}
                      onClick={() => setFormData({...formData, roomType: room.id})}
                    >
                      <input
                        style={styles.roomOptionRadio}
                        type="radio"
                        id={room.id}
                        name="roomType"
                        value={room.id}
                        checked={formData.roomType === room.id}
                        onChange={handleChange}
                      />
                      <label htmlFor={room.id}>
                        <div style={styles.roomOptionName}>{room.name}</div>
                        <div style={styles.roomOptionPrice}>${room.price}/night</div>
                      </label>
                    </div>
                  ))}
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="checkIn">Check-in Date</label>
                    <input
                      style={errors.checkIn ? styles.inputError : styles.input}
                      type="date"
                      id="checkIn"
                      name="checkIn"
                      value={formData.checkIn}
                      onChange={handleChange}
                      min={today}
                    />
                    {errors.checkIn && <div style={styles.errorMessage}>{errors.checkIn}</div>}
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="checkOut">Check-out Date</label>
                    <input
                      style={errors.checkOut ? styles.inputError : styles.input}
                      type="date"
                      id="checkOut"
                      name="checkOut"
                      value={formData.checkOut}
                      onChange={handleChange}
                      min={formData.checkIn || today}
                    />
                    {errors.checkOut && <div style={styles.errorMessage}>{errors.checkOut}</div>}
                  </div>
                </div>
                
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="adults">Adults</label>
                    <select
                      style={styles.select}
                      id="adults"
                      name="adults"
                      value={formData.adults}
                      onChange={handleChange}
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="children">Children</label>
                    <select
                      style={styles.select}
                      id="children"
                      name="children"
                      value={formData.children}
                      onChange={handleChange}
                    >
                      {[0, 1, 2, 3].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Payment Method */}
              <div style={styles.formSection}>
                <h2 style={styles.sectionTitle}>Payment Method</h2>
                
                <div style={styles.paymentOptions}>
                  <div style={styles.paymentOption}>
                    <input
                      style={styles.paymentOptionRadio}
                      type="radio"
                      id="credit"
                      name="paymentMethod"
                      value="credit"
                      checked={formData.paymentMethod === 'credit'}
                      onChange={handleChange}
                    />
                    <label htmlFor="credit">
                      <span style={styles.paymentIcon}>💳</span>
                      Credit/Debit Card
                    </label>
                  </div>
                  
                  <div style={styles.paymentOption}>
                    <input
                      style={styles.paymentOptionRadio}
                      type="radio"
                      id="banking"
                      name="paymentMethod"
                      value="banking"
                      checked={formData.paymentMethod === 'banking'}
                      onChange={handleChange}
                    />
                    <label htmlFor="banking">
                      <span style={styles.paymentIcon}>🏦</span>
                      M-Banking
                    </label>
                  </div>
                  
                  <div style={styles.paymentOption}>
                    <input
                      style={styles.paymentOptionRadio}
                      type="radio"
                      id="wallet"
                      name="paymentMethod"
                      value="wallet"
                      checked={formData.paymentMethod === 'wallet'}
                      onChange={handleChange}
                    />
                    <label htmlFor="wallet">
                      <span style={styles.paymentIcon}>👛</span>
                      E-Wallet
                    </label>
                  </div>
                </div>
                
                {/* Credit Card Fields (show only if credit is selected) */}
                {formData.paymentMethod === 'credit' && (
                  <div style={styles.creditCardFields}>
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="cardNumber">Card Number</label>
                      <input
                        style={styles.input}
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div style={styles.formRow}>
                      <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="expiryDate">Expiry Date</label>
                        <input
                          style={styles.input}
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          placeholder="MM/YY"
                          maxLength="5"
                          onChange={handleChange}
                        />
                      </div>
                      
                      <div style={styles.formGroup}>
                        <label style={styles.label} htmlFor="cvv">CVV</label>
                        <input
                          style={styles.input}
                          type="text"
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          maxLength="3"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="cardholderName">Cardholder Name</label>
                      <input
                        style={styles.input}
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        placeholder="John Doe"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Room Request and Accessibility */}
              <div style={styles.formSection}>
                <h2 style={styles.sectionTitle}>Room Request and Accessibility</h2>
                
                <div style={styles.preferencesContainer}>
                  <div style={styles.preferencesColumn}>
                    <h3 style={styles.preferencesTitle}>Room Features</h3>
                    
                    <div style={styles.preferenceOption}>
                      <input
                        style={styles.preferenceCheckbox}
                        type="checkbox"
                        id="nonSmoking"
                        name="nonSmoking"
                        checked={roomPreferences.nonSmoking}
                        onChange={handlePreferenceChange}
                      />
                      <label htmlFor="nonSmoking">Non-smoking room</label>
                    </div>
                    
                    <div style={styles.preferenceOption}>
                      <input
                        style={styles.preferenceCheckbox}
                        type="checkbox"
                        id="highFloor"
                        name="highFloor"
                        checked={roomPreferences.highFloor}
                        onChange={handlePreferenceChange}
                      />
                      <label htmlFor="highFloor">High floor room</label>
                    </div>
                    
                    <div style={styles.preferenceOption}>
                      <input
                        style={styles.preferenceCheckbox}
                        type="checkbox"
                        id="quietRoom"
                        name="quietRoom"
                        checked={roomPreferences.quietRoom}
                        onChange={handlePreferenceChange}
                      />
                      <label htmlFor="quietRoom">Quiet room</label>
                    </div>
                    
                    <div style={styles.preferenceOption}>
                      <input
                        style={styles.preferenceCheckbox}
                        type="checkbox"
                        id="babyCrib"
                        name="babyCrib"
                        checked={roomPreferences.babyCrib}
                        onChange={handlePreferenceChange}
                      />
                      <label htmlFor="babyCrib">Baby crib/cot</label>
                    </div>
                  </div>
                  
                  <div style={styles.preferencesColumn}>
                    <h3 style={styles.preferencesTitle}>Bathroom</h3>
                    
                    <div style={styles.preferenceOption}>
                      <input
                        style={styles.preferenceCheckbox}
                        type="checkbox"
                        id="bathtub"
                        name="bathtub"
                        checked={roomPreferences.bathtub}
                        onChange={handlePreferenceChange}
                      />
                      <label htmlFor="bathtub">Bathtub</label>
                    </div>
                    
                    <div style={styles.preferenceOption}>
                      <input
                        style={styles.preferenceCheckbox}
                        type="checkbox"
                        id="shower"
                        name="shower"
                        checked={roomPreferences.shower}
                        onChange={handlePreferenceChange}
                      />
                      <label htmlFor="shower">Shower room</label>
                    </div>
                  </div>
                </div>
                
                <div style={styles.stayPeriod}>
                  <h3 style={styles.preferencesTitle}>Stay Period</h3>
                  
                  <div style={styles.preferenceOption}>
                    <input
                      style={styles.preferenceCheckbox}
                      type="checkbox"
                      id="earlyCheckin"
                      name="earlyCheckin"
                      checked={roomPreferences.earlyCheckin}
                      onChange={handlePreferenceChange}
                    />
                    <label htmlFor="earlyCheckin">Early check-in</label>
                  </div>
                </div>
                
                <div style={styles.formGroup}>
                  <label style={styles.label} htmlFor="specialRequests">Additional Requests</label>
                  <textarea
                    style={styles.textarea}
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    placeholder="If you have any special requests, please let us know"
                    rows="4"
                  ></textarea>
                  <p style={styles.note}>*Subject to availability</p>
                </div>
              </div>
              
              {/* Terms and Conditions */}
              <div style={styles.formSection}>
                <div style={{...styles.formCheck, ...styles.termsCheck}}>
                  <input
                    style={styles.checkbox}
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  <label htmlFor="agreeToTerms">
                    I agree to the <a style={styles.termsLink} href="/terms" target="_blank">Terms and Conditions</a> and <a style={styles.termsLink} href="/privacy" target="_blank">Privacy Policy</a>
                  </label>
                </div>
                {errors.agreeToTerms && <div style={styles.errorMessage}>{errors.agreeToTerms}</div>}
              </div>
              
              {/* Submit Button */}
              <button type="submit" style={styles.bookNowButton}>BOOK NOW</button>
            </form>
          </div>
          
          {/* Right side - Room preview and booking summary */}
          <div style={styles.bookingSidebar}>

            {/* Room Preview */}
            <div style={styles.roomCardContainer}>
  <img 
    src={
      formData.roomType === 'superior'
        ? SuperiorBG
        : '/placeholder.svg?height=300&width=600'
    }
    alt={selectedRoom.name}
    style={styles.roomImageLarge}
  />

  <div style={styles.roomContent}>
    <h3 style={styles.roomDetailsTitle}><b>{selectedRoom.name}</b></h3>
    
    <p style={styles.roomDetailsLink}>Room details</p>
    
    <p>{formData.checkInDate} – {formData.checkOutDate}</p>
    <p>{formData.roomCount} Room, {formData.guestCount} Adult</p>

    <hr />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div></div>
      <div>
        <p style={{ margin: 0, fontWeight: 'bold' }}>
          {Number(selectedRoom.price).toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          })}
        </p>
      
      </div>
    </div>
  </div>
</div>

            
            {/* Booking Summary */}
            {summary.nights > 0 && (
              <div style={styles.bookingSummary}>
                <h3 style={styles.summaryTitle}>Booking Summary</h3>
                <div style={styles.summaryItem}>
                  <span>Room Type:</span>
                  <span>{selectedRoom.name}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span>Check-in:</span>
                  <span>{formData.checkIn}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span>Check-out:</span>
                  <span>{formData.checkOut}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span>Nights:</span>
                  <span>{summary.nights}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span>Room Price:</span>
                  <span>${summary.roomPrice.toFixed(2)}</span>
                </div>
                <div style={styles.summaryItem}>
                  <span>Taxes & Fees:</span>
                  <span>${summary.taxesAndFees.toFixed(2)}</span>
                </div>
                <div style={styles.summaryDivider}></div>
                <div style={styles.summaryTotal}>
                  <span>Total:</span>
                  <span>${summary.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;