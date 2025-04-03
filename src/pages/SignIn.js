import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { FaLock, FaEnvelope, FaEyeSlash, FaEye } from "react-icons/fa";
import Logo from "../assets/images/LogoRG3.png";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f8f8;
`;

const Card = styled.div`
  display: flex;
  width: 80%;
  max-width: 900px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const Left = styled.div`
  width: 50%;
  padding: 40px;
  background-color: white;
  text-align: center;
`;

const Right = styled.div`
  width: 50%;
  padding: 40px;
  background: linear-gradient(135deg, #87723b, #d09500);
  color: white;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
`;

const Form = styled.form`
  margin-top: 20px;
  text-align: left;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  margin-bottom: 5px;
  color: #333;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  background: #f0f0f0;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const IconWrapper = styled.span`
  color: #b8860b;
  font-size: 18px;
  margin-right: 10px;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  background: none;
  outline: none;
  font-size: 16px;
`;

const TogglePassword = styled.span`
  cursor: pointer;
  margin-left: 10px;
  color: #b8860b;
`;

const Options = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 15px;
`;

const Forgot = styled.a`
  color: #b8860b;
  text-decoration: none;
`;

const SignInBtn = styled.button`
  width: 100%;
  background: #b8860b;
  color: white;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Register = styled.p`
  font-size: 14px;
  margin-top: 15px;
  a {
    color: #b8860b;
    text-decoration: none;
  }
`;

const PromoTitle = styled.h3`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const PromoBox = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 15px;
`;

const GlobalStyle = createGlobalStyle`
  .input-wrapper {
    position: relative;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
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
    .field-icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: #d09500;
    font-size: 0.875rem;
  }
    .form-field label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #87723b;
  }
`

const SignIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  return (
    <Container>
      <GlobalStyle />
      <Card>
        <Left>
          <img src={Logo} alt="Logo" style={{ width: "70px", height: "70px" }} />
          <Title>Welcome Back</Title>
          <Subtitle>Sign in to your account</Subtitle>
          <Form>
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
                />
              </div>
            </div>
            <div className="form-field" style={{ marginTop: "7px" }}>
              <label htmlFor="password-icon">Password</label>
              <div className="input-wrapper" style={{ position: "relative" }}>
                <div className="field-icon">
                  <FaLock />
                </div>
                <input
                  id="password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                  required
                />
                {passwordValue && ( 
                  <div
                    className="toggle-password"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#b8860b"
                    }}
                  >
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </div>
                )}
              </div>
            </div>

            <Options>
              <label>
                <input type="checkbox" style={{ marginTop: "12px" }} /> Remember me
              </label>
              <Forgot href="/" style={{ marginTop: "12px" }}>Forgot password?</Forgot>
            </Options>
            <SignInBtn type="submit">Sign in</SignInBtn>
          </Form>
          <Register>
            Don't have an account? <a href="/signup">Create new account</a>
          </Register>
        </Left>
        <Right>
          <PromoTitle>Exclusive Benefits for Our Guests</PromoTitle>
          <PromoBox>
            <h4><i className="bi bi-wifi" style={{ marginRight: "8px" }}></i>Free WiFi</h4>
            <p>Stay connected anytime, anywhere with our complimentary internet access.</p>
          </PromoBox>
          <PromoBox>
            <h4><i class="bi bi-brightness-alt-high-fill" style={{ marginRight: "8px" }}></i>Complimentary Breakfast</h4>
            <p>Start your day with a delicious breakfast, freshly prepared in morning.</p>
          </PromoBox>
        </Right>


      </Card>
    </Container>
  );
};

export default SignIn;
