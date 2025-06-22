import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./pages/Navbar";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

import DashboardAdmin from "./admin/DashboardAdmin";
import RoomManage from "./admin/RoomManage";
import GuestList from "./admin/GuestList";
import CheckInAdmin from "./admin/CheckInAdmin";
import CheckOutAdmin from "./admin/CheckOutAdmin";
import HistoryAdmin from "./admin/HistoryAdmin";

import Homepage from "./pages/HomePage";
import RoomDeluxe from "./pages/RoomDeluxe";
import RoomSuperior from "./pages/RoomSuperior";
import RoomExecutive from "./pages/RoomExecutive";
import BookingForm from "./pages/BookingForm";
import RoomDetail from "./pages/RoomDetail";
import SearchBooking from "./pages/SearchBooking";

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
      {/* Toast global biar muncul di semua halaman */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      <Routes>
        {/* Route tanpa Navbar */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/bookingform" element={<BookingForm />} />
        

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/roomManage" element={<RoomManage />} />
        <Route path="/admin/guestList" element={<GuestList />} />
        <Route path="/admin/checkIn" element={<CheckInAdmin />} />
        <Route path="/admin/checkOut" element={<CheckOutAdmin />} />
        <Route path="/admin/history" element={<HistoryAdmin />} />

        {/* Routes dengan Navbar */}
        <Route path="/home" element={<LayoutWithNavbar><Homepage /></LayoutWithNavbar>} />
        <Route path="/roomdeluxe" element={<LayoutWithNavbar><RoomDeluxe /></LayoutWithNavbar>} />
        <Route path="/roomsuperior" element={<LayoutWithNavbar><RoomSuperior /></LayoutWithNavbar>} />
        <Route path="/roomexecutive" element={<LayoutWithNavbar><RoomExecutive /></LayoutWithNavbar>} />
        <Route path="/room/:id" element={<LayoutWithNavbar><RoomDetail /></LayoutWithNavbar>} />
        <Route path="/searchbooking" element={<LayoutWithNavbar><SearchBooking /></LayoutWithNavbar>} />

        {/* Default route */}
        <Route path="/" element={<LayoutWithNavbar><Homepage /></LayoutWithNavbar>} />

        {/* Catch-all route */}
        <Route path="*" element={<LayoutWithNavbar><h2>Halaman tidak ditemukan</h2></LayoutWithNavbar>} />
      </Routes>
    </Router>
  );
}

export default App;
