import { Navigate, Route, Routes, Outlet } from "react-router-dom";

// Components
import Navbar from "./components/NavBar.jsx";
import PageTransition from "./components/PageTransition.jsx";
import Landing from "./components/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Contact from "./components/Contact/Contact.jsx";
import About from "./components/About.jsx";
import DashboardLayout from "./layouts/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

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
import VolunteerPickup from "./pages/VolunteerPickup.jsx";
import ImpactDelivered from "./pages/ImpactDelivered.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import ResQBot from "./components/Chat/ResQBot";

/* ════════════════════════════════════
   PUBLIC LAYOUT WRAPPER
══════════════════════════════════════ */
const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

/* ════════════════════════════════════
   APP ROUTER
══════════════════════════════════════ */
function App() {
  return (
    <>
        <Routes>
          {/* ── DASHBOARD (protected) ── */}
          <Route element={<PageTransition />}>
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index          element={<DashboardHome />}  />
              <Route path="search"  element={<FoodListing />}    />
              <Route path="orders"  element={<OrderTracking />} /> {/* Added missing path */}
              <Route path="track"   element={<OrderTracking />}  />
              <Route path="profile" element={<ProfilePage />}    />
              <Route path="settings" element={<Settings />} />
              <Route path="ai-matching" element={<AIMatching />} />
              <Route path="donate" element={<DonateFood />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="smart-alerts" element={<SmartAlerts />} />
              <Route path="post-60" element={<Navigate to="/dashboard/donate" replace />} />
              <Route path="volunteer" element={<VolunteerPickup />} />
              <Route path="impact-delivered" element={<ImpactDelivered />} />
              <Route path="leader-board" element={<Leaderboard />} />
            </Route>
          </Route>

          {/* ── PUBLIC (marketing, auth) ── */}
          <Route element={<PageTransition />}>
            <Route element={<PublicLayout />}>
              <Route path="/"         element={<Landing />}  />
              <Route path="/login"    element={<Login />}    />
              <Route path="/register" element={<Signup />}   />
              <Route path="/contact"  element={<Contact />}  />
              <Route path="/about"    element={<About />}    />
              <Route path="/map"      element={<MapView />}  />
            </Route>
          </Route>

          {/* ── STANDALONE ── */}
          <Route path="/cart"                element={<ProtectedRoute><CartPage /></ProtectedRoute>}      />
          <Route path="/checkout"            element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}  />
          <Route path="/tracking/:orderId"   element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
          <Route path="*"                    element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Floating Components */}
        <ResQBot />
    </>
  );
}

export default App;
