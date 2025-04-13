import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import Homepage from "./pages/HomePage";
import RoomDetail from "./pages/RoomDetail";

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
        <Route path="/home" element={
          <LayoutWithNavbar>
            <Homepage />
          </LayoutWithNavbar>
        } />
         <Route path="/roomdetail" element={
          <LayoutWithNavbar>
            <RoomDetail />
          </LayoutWithNavbar>
        } />

        {/* Default route (beranda misalnya) */}
        <Route path="/" element={
          <LayoutWithNavbar>
            <Homepage />
          </LayoutWithNavbar>
        } />

        {/* Catch-all route */}
        <Route path="*" element={
          <LayoutWithNavbar>
            <h2>Halaman tidak ditemukan</h2>
          </LayoutWithNavbar>
        } />
      </Routes>
    </Router>
  );
}

export default App;
