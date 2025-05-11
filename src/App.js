import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import DashboardAdmin from "./admin/DashboardAdmin";
import GuestList from "./admin/GuestList";
import CheckInAdmin from "./admin/CheckInAdmin";

import Homepage from "./pages/HomePage";
import RoomDeluxe from "./pages/RoomDeluxe";
import RoomSuperior from "./pages/RoomSuperior";
import RoomExecutive from "./pages/RoomExecutive";


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

        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
        <Route path="/guestlist" element={<GuestList />} />
        <Route path="/checkinadmin" element={<CheckInAdmin />} />

        {/* Route dengan Navbar */}
        <Route path="/home" element={
          <LayoutWithNavbar>
            <Homepage />
          </LayoutWithNavbar>
        } />
         <Route path="/roomdeluxe" element={
          <LayoutWithNavbar>
            <RoomDeluxe />
          </LayoutWithNavbar>
        } />
        <Route path="/roomsuperior" element={
          <LayoutWithNavbar>
            <RoomSuperior />
          </LayoutWithNavbar>
        } />
         <Route path="/roomexecutive" element={
          <LayoutWithNavbar>
            <RoomExecutive />
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
