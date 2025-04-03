import { useState } from "react"
import { createGlobalStyle } from "styled-components";
import { FaLock, FaEnvelope, FaUser, FaCheck, FaHistory } from "react-icons/fa"
import { MdNotifications, MdPayment } from "react-icons/md"
import Logo from "../assets/images/LogoRG3.png";

const GlobalStyle = createGlobalStyle`
  .signup-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8f5f0;
    padding: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans",
      "Helvetica Neue", sans-serif;
  }

  /* Main container */

  
  /* Card container */
  .signup-card {
    width: 100%;
    max-width: 1000px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  /* Media query for desktop */
  @media (min-width: 768px) {
    .signup-card {
      flex-direction: row;
      height: auto;
    }
  
    .signup-form,
    .benefits-panel {
      width: 50%;
    }
  }
  
  /* Sign up form section */
  .signup-form {
    padding: 2.5rem;
    background-color: white;
  }
  
  .signup-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .brand-logo {
    display: flex;
    justify-content: center;
    font-size: 2.5rem;
    color: #d09500;
    margin-bottom: 1rem;
  }
  
  .signup-header h1 {
    font-size: 1.75rem;
    font-weight: 700;
    // color: #87723b;
    margin-bottom: 0.5rem;
  }
  
  .signup-header p {
    font-size: 0.95rem;
    color: #666;
  }
  
  /* Form elements */
  .name-fields {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .name-fields .form-field {
    flex: 1;
  }
  
  .form-field {
    margin-bottom: 1.25rem;
  }
  
  .form-field label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #87723b;
  }
  
  .input-wrapper {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .field-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #d09500;
    font-size: 0.875rem;
  }
  
  .input-wrapper input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 0.95rem;
    outline: none;
    transition: all 0.2s;
  }
  
  .input-wrapper input:focus {
    border-color: #d09500;
    box-shadow: 0 0 0 3px rgba(208, 149, 0, 0.15);
  }
  
  .input-wrapper input.input-error {
    border-color: #e53e3e;
    box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.15);
  }
  
  .error-text {
    color: #e53e3e;
    font-size: 0.75rem;
    margin-top: 0.5rem;
  }
  
  /* Consent checkboxes */
  .consent-checkbox {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  .consent-checkbox.required label::after {
    content: "*";
    color: #e53e3e;
    margin-left: 2px;
  }
  
  .consent-checkbox input {
    margin-right: 0.75rem;
    margin-top: 0.25rem;
  }
  
  .consent-checkbox label {
    font-size: 0.875rem;
    color: #4a5568;
    line-height: 1.4;
  }
  
  .consent-checkbox a {
    color: #d09500;
    text-decoration: none;
    font-weight: 600;
  }
  
  .consent-checkbox a:hover {
    text-decoration: underline;
    color: #87723b;
  }
  
  /* Sign up button */
  .signup-button {
    width: 100%;
    padding: 0.875rem 1rem;
    background-color: #d09500;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px rgba(208, 149, 0, 0.2);
    margin-top: 1rem;
  }
  
  .signup-button:hover {
    background-color: #87723b;
    transform: translateY(-1px);
    box-shadow: 0 6px 8px rgba(135, 114, 59, 0.25);
  }
  
  .signup-button:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(135, 114, 59, 0.25);
  }
  
  .signup-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  /* Loading spinner */
  .button-loading {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .loading-icon {
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
    height: 1.25rem;
    width: 1.25rem;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  .loading-circle {
    opacity: 0.25;
  }
  
  .loading-path {
    opacity: 0.75;
  }
  
  /* Sign in link section */
  .signin-link {
    margin-top: 1.5rem;
    text-align: center;
    font-size: 0.95rem;
  }
  
  .signin-link span {
    color: #4a5568;
  }
  
  .signin-link a {
    color: #d09500;
    font-weight: 600;
    text-decoration: none;
    margin-left: 0.25rem;
  }
  
  .signin-link a:hover {
    color: #87723b;
    text-decoration: underline;
  }
  
  /* Benefits panel */
  .benefits-panel {
    background: linear-gradient(135deg, #87723b, #d09500);
    padding: 2.5rem;
    color: white;
    display: flex;
    flex-direction: column;
  }
  
  .benefits-panel h2 {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 2rem;
    position: relative;
    padding-bottom: 0.75rem;
  }
  
  .benefits-panel h2::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 3px;
    background-color: white;
    border-radius: 3px;
  }
  
  .benefits-wrapper {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 2rem;
  }
  
  .benefit-item {
    display: flex;
    align-items: flex-start;
  }
  
  .benefit-check {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    margin-top: 0.25rem;
    flex-shrink: 0;
  }
  
  .benefit-item h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .benefit-item p {
    font-size: 0.875rem;
    opacity: 0.9;
    line-height: 1.4;
  }
  
  /* Upcoming promotion */
  .upcoming-promo {
    margin-top: auto;
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    padding: 1.25rem;
    display: flex;
    align-items: flex-start;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }
  
  .promo-icon {
    background-color: white;
    color: #d09500;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  .promo-content h3 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  
  .promo-content p {
    font-size: 0.95rem;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }
  
  .promo-dates {
    font-size: 0.75rem;
    opacity: 0.8;
    font-style: italic;
  }
`

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))

    // Check password match when either password field changes
    if (name === "password" || name === "confirmPassword") {
      if (name === "password") {
        setPasswordMatch(value === formData.confirmPassword || formData.confirmPassword === "")
      } else {
        setPasswordMatch(value === formData.password)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false)
      return
    }

    setIsLoading(true)

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      // Handle registration logic here
      console.log("Registration data:", formData)
    }, 1500)
  }

  return (
    <div className="signup-container">
      <GlobalStyle />
      <div className="signup-card">
        {/* Sign Up Form - Left Side */}
        <div className="signup-form">
          <div className="signup-header">
            <img src={Logo} alt="Logo" style={{ width: "70px", height: "70px" }} />
            <h1>Create Your Account</h1>
            <p>Sign up for a better booking experience</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="name-fields">
              <div className="form-field">
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                  <div className="field-icon">
                    <FaUser />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                  <div className="field-icon">
                    <FaUser />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <div className="field-icon">
                  <FaEnvelope />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password">Create Password</label>
              <div className="input-wrapper">
                <div className="field-icon">
                  <FaLock />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <div className="field-icon">
                  <FaLock />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={!passwordMatch ? "input-error" : ""}
                />
              </div>
              {!passwordMatch && <p className="error-text">Passwords do not match</p>}
            </div>

            <div className="consent-checkbox">
              <input id="marketing" name="marketing" type="checkbox" />
              <label htmlFor="marketing">I'd like to receive booking confirmations and updates via email</label>
            </div>

            <div className="consent-checkbox required">
              <input id="terms" name="terms" type="checkbox" required />
              <label htmlFor="terms">
                I agree to the <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>
              </label>
            </div>

            <button type="submit" disabled={isLoading || !passwordMatch} className="signup-button">
              {isLoading ? (
                <span className="button-loading">
                  <svg className="loading-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle
                      className="loading-circle"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="loading-path"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating your account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="signin-link">
              <span>Already have an account?</span> <a href="/signin">Sign in to your account</a>
            </div>
          </form>
        </div>

        {/* Benefits - Right Side */}
        <div className="benefits-panel">
          <h2>Why Create an Account?</h2>

          <div className="benefits-wrapper">
            <div className="benefit-item">
              <div className="benefit-check">
                <FaCheck />
              </div>
              <div>
                <h3>Faster Booking</h3>
                <p>Save your information for a quicker reservation process</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-check">
                <MdPayment />
              </div>
              <div>
                <h3>Secure Payment</h3>
                <p>Safely store your payment methods for future bookings</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-check">
                <FaHistory />
              </div>
              <div>
                <h3>Booking History</h3>
                <p>Access your past and upcoming reservations anytime</p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-check">
                <MdNotifications />
              </div>
              <div>
                <h3>Reservation Updates</h3>
                <p>Receive important notifications about your stay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp