import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";


// Layout dengan Navbar
const LayoutWithNavbar = ({ children }) => (
  <>
    <Navbar />
    <div className="container mt-3">
      {children}
    </div>
  </>
);

function App() {
    return (
        <Router>
            <Routes>
                {/* Route tanpa Navbar */}
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                
                {/* Route dengan Navbar */}
                <Route path="/" element={
                  <LayoutWithNavbar>
                    <Navbar />
                  </LayoutWithNavbar>
                } />
                
                {/* Route lainnya dengan Navbar */}
                <Route path="*" element={
                  <LayoutWithNavbar>
                    {/* Konten halaman lainnya */}
                  </LayoutWithNavbar>
                } />
            </Routes>
        </Router>
    );
}

export default App;
