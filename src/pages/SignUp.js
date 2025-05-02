import { useState, useEffect } from "react"
import styled, { createGlobalStyle } from "styled-components";
import { FaLock, FaEnvelope, FaUser, FaEyeSlash, FaEye } from "react-icons/fa"
import Logo from "../assets/images/LogoRG3.png";

const Container = styled.div`
    min-height: 95vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
`

const Card = styled.div`
  width: 100%;
  max-width: 1000px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
    height: auto;

    .signup-form,
    .benefits-panel {
      width: 50%;
    }
  }
`;

const Title = styled.h1`
  font-size: 1.70rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.90rem;
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
`;

const PromoBox = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 20px;
   flex: 1;
`;

const GlobalStyle = createGlobalStyle`
  
  .signup-form {
    padding: 2.5rem;
    background-color: white;
  }
  
  .name-fields {
    display: flex;
    gap: 1rem;
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
    box-sizing: border-box;
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
  
  .consent-checkbox {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
  }
  
  .consent-checkbox.required label::after {
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
`

function SignUp() {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showError, setShowError] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "confirmPassword") {
      setShowError(false);
    }
  };

  useEffect(() => {
    if (formData.confirmPassword === "") {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(formData.password === formData.confirmPassword);
    }
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setPasswordMatch(false)
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      console.log("Registration data:", formData)
    }, 1500)
  }

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <div className="signup-form">
          <img src={Logo} alt="Logo" style={{ width: "70px", height: "70px", display: "block", margin: "0 auto" }} />
          <Title>Create Your Account</Title>
          <Subtitle>Sign up for a better booking experience</Subtitle>
          <form onSubmit={handleSubmit}>
            <div className="name-fields">
              <div className="form-field">
                <label htmlFor="firstName">Full Name</label>
                <div className="input-wrapper">
                  <div className="field-icon">
                    <FaUser />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.fullname}
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
                <span className="field-icon">
                  <FaLock />
                </span>
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ paddingRight: "2.5rem" }}
                />
                {formData.password && (
                  <span
                    className="toggle-password"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#b8860b",
                      zIndex: 5,
                    }}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <span className="field-icon">
                  <FaLock />
                </span>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={confirmPasswordVisible ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={() => setShowError(true)} 
                  className={!passwordMatch && showError ? "input-error" : ""}
                  style={{ paddingRight: "2.5rem" }}
                />
                {formData.confirmPassword && (
                  <span
                    className="toggle-password"
                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    style={{
                      position: "absolute",
                      right: "0.75rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#b8860b",
                      zIndex: 5,
                    }}
                  >
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                )}
              </div>
              {!passwordMatch && showError && (
                <p className="error-text" style={{ color: "red", fontSize: "14px" }}>
                  Passwords do not match
                </p>
              )}
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

        <div className="benefits-panel">
          <h2>Why Create an Account ?</h2>
            <PromoBox>
              <h4><i className="bi bi-wifi" style={{ marginRight: "8px" }}></i>Free WiFi</h4>
              <p>Get a free Wifi, and stay connected anytime, anywhere with our internet access.</p>
            </PromoBox>
            <PromoBox>
              <h4><i class="bi bi-brightness-alt-high-fill" style={{ marginRight: "8px" }}></i>Complimentary Breakfast</h4>
              <p>Start your day with a free delicious breakfast, freshly prepared in morning.</p>
            </PromoBox>
            <PromoBox>
              <h4><i class="bi bi-gift" style={{ marginRight: "8px" }}></i>Exclusive Offer</h4>
              <p>Get more exclusive offers and exciting features in our hotel website </p>
            </PromoBox>
        </div>
      </Card>
    </Container>
  )
}

export default SignUp