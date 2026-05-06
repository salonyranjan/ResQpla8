import { Route, Routes, Outlet } from "react-router-dom";

// Components
import Navbar from "./components/NavBar.jsx";
import PageTransition from "./components/PageTransition.jsx";
import Landing from "./components/Landing.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Contact from "./components/Contact/Contact.jsx";
import About from "./components/About.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";

// Pages
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

/* ══════════════════════════════════════
   PUBLIC LAYOUT WRAPPER
══════════════════════════════════════ */
const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

/* ══════════════════════════════════════
   APP ROUTER
══════════════════════════════════════ */
function App() {
  return (
    <Routes>

      {/* ── DASHBOARD (protected, no public Navbar) ── */}
      <Route element={<PageTransition />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index          element={<DashboardHome />}  />
          <Route path="search"  element={<FoodListing />}    />
          <Route path="orders"  element={<OrderTracking />}  />
          <Route path="profile" element={<ProfilePage />}    />
          <Route path="settings" element={<Settings />} />
          <Route path="ai-matching" element={<AIMatching />} />
          <Route path="donate" element={<DonateFood />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="smart-alerts" element={<SmartAlerts />} />
          <Route path="post-60" element={<PostIn60Seconds />} />
          <Route path="volunteer-pickups" element={<VolunteerPickup />} />
              <Route path="impact-delivered" element={<ImpactDelivered />} />
        </Route>
      </Route>

      {/* ── PUBLIC (marketing, auth — with Navbar) ── */}
      <Route element={<PageTransition />}>
        <Route element={<PublicLayout />}>
          <Route path="/"         element={<Landing />}  />
          <Route path="/login"    element={<Login />}    />
          <Route path="/register" element={<Signup />}   />
          <Route path="/contact"  element={<Contact />}  />
          <Route path="/about"    element={<About />}    />
        </Route>
      </Route>

      {/* ── STANDALONE (no layout chrome) ── */}
      <Route path="/cart"                element={<CartPage />}      />
      <Route path="/checkout"            element={<CheckoutPage />}  />
      <Route path="/tracking/:orderId"   element={<OrderTracking />} />
      <Route path="/map"                 element={<MapView />}       />

    </Routes>
  );
}

export default App;