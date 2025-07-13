"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Latar1 from "../assets/images/FotoLatar1.png"

import {
  FaHotel,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaQuestionCircle,
  FaHeadset,
  FaConciergeBell,
  FaCalendarAlt,
  FaUser,
  FaPaperPlane,
} from "react-icons/fa"

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
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${Latar1})`,
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

  // Contact Info Section
  contactInfoSection: {
    backgroundColor: "#ffffff",
    padding: "5rem 2rem",
  },
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2.5rem",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  contactCard: {
    backgroundColor: "#f8f5f0",
    padding: "2.5rem 2rem",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    transition: "transform 0.3s, box-shadow 0.3s",
    border: "1px solid #f0f0f0",
  },
  contactIcon: {
    fontSize: "2.75rem",
    color: "#D09500",
    marginBottom: "1.25rem",
  },
  contactTitle: {
    fontSize: "1.25rem",
    color: "#87723B",
    marginBottom: "0.75rem",
    fontWeight: 600,
  },
  contactDetails: {
    color: "#666",
    fontSize: "0.95rem",
    lineHeight: "1.6",
  },
  contactLink: {
    color: "#D09500",
    textDecoration: "none",
    fontWeight: 500,
    transition: "color 0.2s",
  },

  // Contact Form Section
  formSection: {
    backgroundColor: "#f8f5f0",
    padding: "5rem 2rem",
  },
  formContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    backgroundColor: "white",
    borderRadius: "15px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
    padding: "3rem",
  },
  formTitle: {
    fontSize: "2rem",
    color: "#87723B",
    textAlign: "center",
    marginBottom: "1rem",
    fontWeight: 600,
  },
  formDescription: {
    textAlign: "center",
    color: "#666",
    marginBottom: "2.5rem",
    fontSize: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  formRow: {
    display: "flex",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  formGroup: {
    flex: 1,
    minWidth: "250px",
  },
  formLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    fontWeight: 500,
    color: "#87723B",
    fontSize: "0.95rem",
  },
  formInput: {
    width: "100%",
    padding: "0.875rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.2s",
    boxSizing: "border-box",
  },
  formTextarea: {
    width: "100%",
    padding: "0.875rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.2s",
    resize: "vertical",
    minHeight: "120px",
    boxSizing: "border-box",
  },
  formSelect: {
    width: "100%",
    padding: "0.875rem",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "all 0.2s",
    backgroundColor: "white",
    boxSizing: "border-box",
  },
  submitButton: {
    padding: "1rem 2rem",
    backgroundColor: "#D09500",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    transition: "all 0.2s",
    fontSize: "1.1rem",
    boxShadow: "0 4px 6px rgba(208, 149, 0, 0.2)",
    alignSelf: "center",
    minWidth: "200px",
  },

  // Location Section
  locationSection: {
    backgroundColor: "#ffffff",
    padding: "5rem 2rem",
  },
  locationGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "4rem",
    alignItems: "center",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  locationContent: {
    padding: "2rem 0",
  },
  locationTitle: {
    fontSize: "2rem",
    color: "#87723B",
    marginBottom: "1.5rem",
    fontWeight: 600,
  },
  locationText: {
    color: "#666",
    fontSize: "1rem",
    lineHeight: "1.8",
    marginBottom: "1.5rem",
  },
  locationDetails: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  locationItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
  },
  locationIcon: {
    color: "#D09500",
    fontSize: "1.1rem",
    marginTop: "0.2rem",
  },
  mapPlaceholder: {
    width: "100%",
    height: "400px",
    backgroundColor: "#f0f0f0",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
    fontSize: "1.1rem",
    border: "2px dashed #ddd",
  },

  // Hours Section
  hoursSection: {
    backgroundColor: "#f8f5f0",
    padding: "5rem 2rem",
  },
  hoursGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "2rem",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  hoursCard: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    border: "1px solid #f0f0f0",
  },
  hoursTitle: {
    fontSize: "1.25rem",
    color: "#87723B",
    marginBottom: "1rem",
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  hoursItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.5rem 0",
    borderBottom: "1px solid #f0f0f0",
  },
  hoursDay: {
    color: "#666",
    fontWeight: 500,
  },
  hoursTime: {
    color: "#87723B",
    fontWeight: 600,
  },

  // FAQ Section
  faqSection: {
    backgroundColor: "#ffffff",
    padding: "5rem 2rem",
  },
  faqGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "1.5rem",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  faqCard: {
    backgroundColor: "#f8f5f0",
    padding: "1.5rem",
    borderRadius: "8px",
    border: "1px solid #f0f0f0",
  },
  faqQuestion: {
    fontSize: "1rem",
    color: "#87723B",
    marginBottom: "0.75rem",
    fontWeight: 600,
  },
  faqAnswer: {
    color: "#666",
    fontSize: "0.9rem",
    lineHeight: "1.6",
  },

  // Social Section
  socialSection: {
    backgroundColor: "#87723B",
    color: "white",
    padding: "4rem 2rem",
    textAlign: "center",
  },
  socialTitle: {
    fontSize: "2rem",
    marginBottom: "1rem",
    color: "white",
  },
  socialDescription: {
    fontSize: "1.1rem",
    marginBottom: "2rem",
    opacity: "0.9",
  },
  socialLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  socialLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "50px",
    height: "50px",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
    color: "white",
    fontSize: "1.5rem",
    transition: "all 0.3s",
    textDecoration: "none",
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
  primaryButton: {
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
    border: "1px solid #D09500",
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
}

function ContactPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    inquiryType: "",
    message: "",
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    alert("Thank you for your message! We'll get back to you soon.")
    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      inquiryType: "",
      message: "",
    })
  }

  const faqItems = [
    {
      question: "What are your check-in and check-out times?",
      answer:
        "Check-in is at 3:00 PM and check-out is at 11:00 AM. Early check-in and late check-out may be available upon request.",
    },
    {
      question: "Do you offer airport transportation?",
      answer:
        "Yes, we provide complimentary airport shuttle service. Please contact us 24 hours in advance to arrange pickup.",
    },
    {
      question: "Is parking available at the hotel?",
      answer:
        "We offer free on-site parking for all guests. Valet parking service is also available for an additional fee.",
    },
    {
      question: "What dining options are available?",
      answer:
        "Our hotel features a fine dining restaurant, casual café, and 24-hour room service for your convenience.",
    },
    {
      question: "Do you have facilities for events and meetings?",
      answer:
        "Yes, we have multiple event spaces and meeting rooms equipped with modern audiovisual equipment and catering services.",
    },
    {
      question: "What safety measures do you have in place?",
      answer:
        "We maintain the highest safety standards with 24/7 security, CCTV monitoring, and enhanced cleaning protocols.",
    },
  ]

  return (
    <div style={styles.page}>
      
      {/* Contact Information Section */}
      <section style={styles.contactInfoSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>How to Reach Us</h2>
          <p style={styles.sectionDescription}>Multiple ways to connect with our hospitality team</p>

          <div style={styles.contactGrid}>
            <div
              style={styles.contactCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none"
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)"
              }}
            >
              <div style={styles.contactIcon}>
                <FaPhone />
              </div>
              <h3 style={styles.contactTitle}>Phone & WhatsApp</h3>
              <div style={styles.contactDetails}>
                <p>
                  <a href="tel:+6277812345678" style={styles.contactLink}>
                    +62 778 123-4567
                  </a>
                </p>
                <p>
                  <a href="https://wa.me/6277812345678" style={styles.contactLink}>
                    WhatsApp: +62 778 123-4567
                  </a>
                </p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>Available 24/7 for reservations</p>
              </div>
            </div>

            <div
              style={styles.contactCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none"
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)"
              }}
            >
              <div style={styles.contactIcon}>
                <FaEnvelope />
              </div>
              <h3 style={styles.contactTitle}>Email</h3>
              <div style={styles.contactDetails}>
                <p>
                  <a href="mailto:info@goldenstays.com" style={styles.contactLink}>
                    info@goldenstays.com
                  </a>
                </p>
                <p>
                  <a href="mailto:reservations@goldenstays.com" style={styles.contactLink}>
                    reservations@goldenstays.com
                  </a>
                </p>
                <p style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>We respond within 2 hours</p>
              </div>
            </div>

            <div
              style={styles.contactCard}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)"
                e.currentTarget.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.1)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "none"
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.08)"
              }}
            >
              <div style={styles.contactIcon}>
                <FaMapMarkerAlt />
              </div>
              <h3 style={styles.contactTitle}>Address</h3>
              <div style={styles.contactDetails}>
                <p>Jl. Hang Tuah No. 123</p>
                <p>Nagoya, Batam Center</p>
                <p>Batam, Kepulauan Riau 29432</p>
                <p>Indonesia</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={styles.formSection}>
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Send Us a Message</h2>
          <p style={styles.formDescription}>
            Have a question or special request? Fill out the form below and we'll get back to you promptly.
          </p>

          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaUser />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={styles.formInput}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#D09500"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(208, 149, 0, 0.15)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaEnvelope />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  style={styles.formInput}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#D09500"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(208, 149, 0, 0.15)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaPhone />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={styles.formInput}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#D09500"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(208, 149, 0, 0.15)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>
                  <FaQuestionCircle />
                  Inquiry Type
                </label>
                <select
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  style={styles.formSelect}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#D09500"
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(208, 149, 0, 0.15)"
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  <option value="">Select inquiry type</option>
                  <option value="reservation">Room Reservation</option>
                  <option value="event">Event & Meetings</option>
                  <option value="dining">Dining Reservations</option>
                  <option value="spa">Spa Services</option>
                  <option value="general">General Information</option>
                  <option value="feedback">Feedback & Complaints</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                <FaCalendarAlt />
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                style={styles.formInput}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#D09500"
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(208, 149, 0, 0.15)"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0"
                  e.currentTarget.style.boxShadow = "none"
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                <FaPaperPlane />
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                placeholder="Please provide details about your inquiry..."
                style={styles.formTextarea}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#D09500"
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(208, 149, 0, 0.15)"
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0"
                  e.currentTarget.style.boxShadow = "none"
                }}
              />
            </div>

            <button
              type="submit"
              style={styles.submitButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#87723B"
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = "0 6px 8px rgba(208, 149, 0, 0.25)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "#D09500"
                e.currentTarget.style.transform = "none"
                e.currentTarget.style.boxShadow = "0 4px 6px rgba(208, 149, 0, 0.2)"
              }}
            >
              <FaPaperPlane />
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Location Section */}
      <section style={styles.locationSection}>
        <div
          style={isMobile ? { ...styles.locationGrid, gridTemplateColumns: "1fr", gap: "2rem" } : styles.locationGrid}
        >
          <div style={styles.locationContent}>
            <h2 style={styles.locationTitle}>Find Us in Batam</h2>
            <p style={styles.locationText}>
              Strategically located in the heart of Batam's business district, Royal Gold Batam Hotel offers easy access
              to shopping centers, restaurants, and major attractions.
            </p>

            <div style={styles.locationDetails}>
              <div style={styles.locationItem}>
                <FaMapMarkerAlt style={styles.locationIcon} />
                <div>
                  <strong>Address:</strong>
                  <br />
                  Jl. Hang Tuah No. 123, Nagoya
                  <br />
                  Batam Center, Batam 29432
                  <br />
                  Kepulauan Riau, Indonesia
                </div>
              </div>

              <div style={styles.locationItem}>
                <FaClock style={styles.locationIcon} />
                <div>
                  <strong>Distance from Airport:</strong>
                  <br />
                  15 minutes drive from Hang Nadim Airport
                  <br />
                  Complimentary shuttle service available
                </div>
              </div>

              <div style={styles.locationItem}>
                <FaMapMarkerAlt style={styles.locationIcon} />
                <div>
                  <strong>Nearby Attractions:</strong>
                  <br />
                  Nagoya Hill Shopping Mall (5 min)
                  <br />
                  Batam Center Ferry Terminal (10 min)
                  <br />
                  Maha Vihara Duta Maitreya Temple (15 min)
                </div>
              </div>
            </div>
          </div>

          <div style={styles.mapPlaceholder}>
            <div style={{ textAlign: "center" }}>
              <FaMapMarkerAlt style={{ fontSize: "3rem", color: "#D09500", marginBottom: "1rem" }} />
              <p>Interactive Map</p>
              <p style={{ fontSize: "0.9rem", opacity: "0.7" }}>Click to view detailed location and directions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hours & Services Section */}
      <section style={styles.hoursSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Hours & Services</h2>
          <p style={styles.sectionDescription}>Our team is here to serve you around the clock</p>

          <div style={styles.hoursGrid}>
            <div style={styles.hoursCard}>
              <h3 style={styles.hoursTitle}>
                <FaHeadset />
                Front Desk & Reception
              </h3>
              <div style={styles.hoursItem}>
                <span style={styles.hoursDay}>Available</span>
                <span style={styles.hoursTime}>24/7</span>
              </div>
              <div style={styles.hoursItem}>
                <span style={styles.hoursDay}>Check-in</span>
                <span style={styles.hoursTime}>3:00 PM</span>
              </div>
              <div style={styles.hoursItem}>
                <span style={styles.hoursDay}>Check-out</span>
                <span style={styles.hoursTime}>11:00 AM</span>
              </div>
            </div>

            <div style={styles.hoursCard}>
              <h3 style={styles.hoursTitle}>
                <FaConciergeBell />
                Concierge Services
              </h3>
              <div style={styles.hoursItem}>
                <span style={styles.hoursDay}>Monday - Sunday</span>
                <span style={styles.hoursTime}>6:00 AM - 10:00 PM</span>
              </div>
              <div style={styles.hoursItem}>
                <span style={styles.hoursDay}>Tour Bookings</span>
                <span style={styles.hoursTime}>8:00 AM - 8:00 PM</span>
              </div>
              <div style={styles.hoursItem}>
                <span style={styles.hoursDay}>Transportation</span>
                <span style={styles.hoursTime}>24/7</span>
              </div>
            </div>

            <div style={styles.hoursCard}>
              <h3 style={styles.hoursTitle}>
                <FaPhone />
                Reservations
              </h3>
              <div style={styles.hoursItem}>
                <span style={styles.hoursDay}>Phone Reservations</span>
                <span style={styles.hoursTime}>24/7</span>
              </div>
              <div style={styles.hoursItem}>
                <span style={styles.hoursDay}>Online Booking</span>
                <span style={styles.hoursTime}>Always Available</span>
              </div>
              <div style={styles.hoursItem}>
                <span style={styles.hoursDay}>Group Bookings</span>
                <span style={styles.hoursTime}>9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={styles.faqSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          <p style={styles.sectionDescription}>Quick answers to common inquiries</p>

          <div style={styles.faqGrid}>
            {faqItems.map((faq, index) => (
              <div key={index} style={styles.faqCard}>
                <h3 style={styles.faqQuestion}>{faq.question}</h3>
                <p style={styles.faqAnswer}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section style={styles.socialSection}>
        <div style={styles.container}>
          <h2 style={styles.socialTitle}>Connect With Us</h2>
          <p style={styles.socialDescription}>
            Follow us on social media for updates, offers, and behind-the-scenes content
          </p>

          <div style={styles.socialLinks}>
            <a
              href="#"
              style={styles.socialLink}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#D09500"
                e.currentTarget.style.transform = "translateY(-3px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                e.currentTarget.style.transform = "none"
              }}
            >
              <FaFacebook />
            </a>
            <a
              href="#"
              style={styles.socialLink}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#D09500"
                e.currentTarget.style.transform = "translateY(-3px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                e.currentTarget.style.transform = "none"
              }}
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              style={styles.socialLink}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#D09500"
                e.currentTarget.style.transform = "translateY(-3px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                e.currentTarget.style.transform = "none"
              }}
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              style={styles.socialLink}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#D09500"
                e.currentTarget.style.transform = "translateY(-3px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                e.currentTarget.style.transform = "none"
              }}
            >
              <FaLinkedin />
            </a>
            <a
              href="#"
              style={styles.socialLink}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#D09500"
                e.currentTarget.style.transform = "translateY(-3px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"
                e.currentTarget.style.transform = "none"
              }}
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContainer}>
          <h2 style={styles.ctaTitle}>Ready to Experience Luxury?</h2>
          <p style={styles.ctaDescription}>
            Book your stay today or contact us for personalized assistance with your reservation
          </p>
          <div style={styles.ctaButtons}>
            <Link
              to="/"
              style={styles.primaryButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "white"
                e.currentTarget.style.transform = "none"
              }}
            >
              Book Now
            </Link>
            <a
              href="tel:+6277812345678"
              style={styles.primaryButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.9)"
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "white"
                e.currentTarget.style.transform = "none"
              }}
            >
              Call Us Now
            </a>
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
            <Link to="/rooms" style={styles.footerLink}>
              Rooms & Suites
            </Link>
            <Link to="/amenities" style={styles.footerLink}>
              Amenities
            </Link>
            <Link to="/about" style={styles.footerLink}>
              About Us
            </Link>
            <Link to="/contact" style={styles.footerLink}>
              Contact Us
            </Link>
          </div>

          <div>
            <h3 style={styles.footerTitle}>Contact</h3>
            <p style={styles.footerText}>Jl. Hang Tuah No. 123</p>
            <p style={styles.footerText}>Batam, Indonesia 29432</p>
            <p style={styles.footerText}>Phone: +62 778 123-4567</p>
            <p style={styles.footerText}>Email: info@goldenstays.com</p>
          </div>
        </div>

        <div style={styles.footerBottom}>
          <p style={styles.copyright}>&copy; 2023 Golden Stays. All rights reserved.</p>
          <div style={styles.footerLinks}>
            <Link to="/privacy" style={{ ...styles.footerLink, marginBottom: 0 }}>
              Privacy Policy
            </Link>
            <Link to="/terms" style={{ ...styles.footerLink, marginBottom: 0 }}>
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ContactPage
