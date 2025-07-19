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
import FeedbackAdmin from "./admin/FeedbackAdmin";

import Homepage from "./pages/HomePage";
import RoomDetail from "./pages/RoomDetail";
import SearchBooking from "./pages/SearchBooking";
import InvoicePage from "./pages/InvoicePage";
import BookingFormOne from "./pages/BookingFormOne";
import BookingFormTwo from "./pages/BookingFormTwo";
import BookingFormThree from "./pages/BookingFormThree";
import HistoryBooking from "./pages/HistoryBooking";
import AboutPage from "./pages/AboutPages";
import ContactPage from "./pages/ContactPage";

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
        <Route path="/bookingformone" element={<BookingFormOne />} />
        <Route path="/bookingformtwo" element={<BookingFormTwo />} />
        <Route path="/bookingformthree" element={<BookingFormThree />} />
        <Route path="/invoice" element={<InvoicePage />} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/roomManage" element={<RoomManage />} />
        <Route path="/admin/guestList" element={<GuestList />} />
        <Route path="/admin/checkIn" element={<CheckInAdmin />} />
        <Route path="/admin/checkOut" element={<CheckOutAdmin />} />
        <Route path="/admin/history" element={<HistoryAdmin />} />
        <Route path="/admin/feedback" element={<FeedbackAdmin />} />

        {/* Routes dengan Navbar */}
        <Route path="/home" element={<LayoutWithNavbar><Homepage /></LayoutWithNavbar>} />
        <Route path="/room/:id" element={<LayoutWithNavbar><RoomDetail /></LayoutWithNavbar>} />
        <Route path="/searchbooking" element={<LayoutWithNavbar><SearchBooking /></LayoutWithNavbar>} />
        <Route path="/historybooking" element={<LayoutWithNavbar><HistoryBooking /></LayoutWithNavbar>} />
        <Route path="/about" element={<LayoutWithNavbar><AboutPage /></LayoutWithNavbar>} />
        <Route path="/contact" element={<LayoutWithNavbar><ContactPage /></LayoutWithNavbar>} />

        {/* Default route */}
        <Route path="/" element={<LayoutWithNavbar><Homepage /></LayoutWithNavbar>} />

        {/* Catch-all route */}
        <Route path="*" element={<LayoutWithNavbar><h2>Halaman tidak ditemukan</h2></LayoutWithNavbar>} />
      </Routes>
    </Router>
  );
}

export default App;
