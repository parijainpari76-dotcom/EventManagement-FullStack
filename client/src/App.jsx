import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EventDetail from "./pages/EventDetail";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/events/:id" element={<EventDetail />} />

        <Route path="/dashboard" element={<UserDashboard />} />

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/payment/success" element={<PaymentSuccess />} />

        <Route path="/payment/failed" element={<PaymentFailed />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;