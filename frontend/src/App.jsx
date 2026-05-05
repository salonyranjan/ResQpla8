import { Route, Routes, Outlet } from "react-router-dom";

// Components
import Navbar from "./components/NavBar.jsx";
import PageTransition from "./components/PageTransition.jsx";
import Landing from "./components/Landing.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Contact from "./components/Contact/Contact.jsx";
import About from "./components/About.jsx";
import DashboardLayout from "./components/Dashboard/DashboardLayout.jsx";

// Pages
import DashboardHome from "./pages/DashboardHome.jsx";
import FoodListing from "./pages/FoodListing.jsx";
import CartPage from "./pages/Cart.jsx";
import CheckoutPage from "./pages/Checkout.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";
import MapView from "./components/MapView.jsx";
import ProfilePage from "./pages/Profile.jsx";

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