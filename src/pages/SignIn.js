import { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FaLock, FaEnvelope, FaEyeSlash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/LogoRG3.png";

const Container = styled.div`
  min-height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  font-family: "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 2rem;
`;

const GlobalStyle = createGlobalStyle`
  .form-field {
    margin-bottom: 1.25rem;
    text-align: left;
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

  .signin-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85rem;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
  }

  .signin-options label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .signin-options input {
    margin-right: 0.5rem;
  }

  .forgot-password {
    color: #d09500;
    text-decoration: none;
    font-weight: 600;
  }

  .forgot-password:hover {
    color: #87723b;
    text-decoration: underline;
  }

  .signin-button {
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
  }

  .signin-button:hover {
    background-color: #87723b;
  }

  .signin-link {
    margin-top: 1.5rem;
    font-size: 0.95rem;
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
`;

function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
  
    try {
      const response = await fetch("https://localhost:7298/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        const user = result.user; // ambil data dari result.user
  
        localStorage.setItem("fullname", user.fullname);
        localStorage.setItem("email", user.email);
        localStorage.setItem("role", user.role);
  
        // trigger update navbar (opsional tapi disarankan)
        window.dispatchEvent(new Event("storage"));
  
        navigate("/home");
      } else {
        setErrorMessage(result.message || "Email atau password salah");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };
  


  return (
    <Container>
      <GlobalStyle />
      <Card>
        <img src={Logo} alt="Logo" style={{ width: "70px", height: "70px", marginBottom: "1rem" }} />
        <Title>Welcome Back</Title>
        <Subtitle>Sign in to your account</Subtitle>
        <form onSubmit={handleSubmit}>
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
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="field-icon">
                <FaLock />
              </span>
              <input
                id="password"
                name="password"
                type={passwordVisible ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
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
                  }}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              )}
            </div>
          </div>

          {/* <div className="signin-options">
            <label>
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
            <a href="/forgot-password" className="forgot-password">
              Forgot password?
            </a>
          </div> */}

          {errorMessage && (
            <div style={{ color: "red", marginBottom: "1rem", fontSize: "0.9rem" }}>
              {errorMessage}
            </div>
          )}

          <button type="submit" disabled={isLoading} className="signin-button">
            {isLoading ? "Login..." : "Login"}
          </button>
        </form>

        <div className="signin-link">
          <span>Don't have an account?</span> <a href="/signup">Create a new account</a>
        </div>
      </Card>
    </Container>
  );
}

export default SignIn;
