import { Route, Routes, Outlet } from "react-router-dom";

// Layouts & Protection
import Navbar from "./components/NavBar.jsx";
import PageTransition from "./components/PageTransition.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Pages
import Landing from "./components/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Contact from "./components/Contact/Contact.jsx";
import About from "./components/About.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import FoodListing from "./pages/FoodListing.jsx";
import CartPage from "./pages/Cart.jsx";
import CheckoutPage from "./pages/Checkout.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";
import MapView from "./components/MapView.jsx";
import ProfilePage from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import AIMatching from "./pages/AIMatching.jsx";
import DonateFood from "./pages/DonateFood.jsx";
import Analytics from "./pages/Analytics.jsx";
import SmartAlerts from "./pages/SmartAlerts.jsx";
import PostIn60Seconds from "./pages/PostIn60Seconds.jsx";
import VolunteerPickup from "./pages/VolunteerPickup.jsx";
import ImpactDelivered from "./pages/ImpactDelivered.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import ResQBot from "./components/Chat/ResQBot";

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

function App() {
  return (
    <>
      <Routes>
        {/* ── DASHBOARD (Protected Routes) ── */}
        <Route element={<PageTransition />}>
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="search" element={<FoodListing />} />
            <Route path="orders" element={<OrderTracking />} />
            <Route path="track" element={<OrderTracking />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<Settings />} />
            <Route path="ai-matching" element={<AIMatching />} />
            <Route path="donate" element={<DonateFood />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="smart-alerts" element={<SmartAlerts />} />
            <Route path="post-60" element={<PostIn60Seconds />} />
            
            {/* Volunteer Route Aliases */}
            <Route path="volunteer" element={<VolunteerPickup />} />
            <Route path="volunteer-pickups" element={<VolunteerPickup />} />
            
            <Route path="impact-delivered" element={<ImpactDelivered />} />
            
            {/* Leaderboard Route Aliases */}
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="leader-board" element={<Leaderboard />} />
          </Route>
        </Route>

        {/* ── PUBLIC (Marketing & Auth) ── */}
        <Route element={<PageTransition />}>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Route>

        {/* ── STANDALONE UTILITIES ── */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/tracking/:orderId" element={<OrderTracking />} />
        <Route path="/map" element={<MapView />} />
      </Routes>

      {/* Global AI Assistant */}
      <ResQBot />
    </>
  );
}

export default App;
