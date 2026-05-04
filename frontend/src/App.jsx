import { Route, Routes } from "react-router-dom";
import Landing from "./components/Landing.jsx";
import Navbar from "./components/NavBar.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Contact from "./components/Contact/Contact.jsx";
import About from "./components/About.jsx";
import DashboardLayout from "./components/Dashboard/DashboardLayout.jsx";
import DashboardHome from "./pages/DashboardHome.jsx";
import FoodListing from "./pages/FoodListing.jsx";
import CartPage from "./pages/Cart.jsx";
import CheckoutPage from "./pages/Checkout.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";
import ProfilePage from "./pages/Profile.jsx";
import PageTransition from "./components/PageTransition";

// Wrapper for public pages that need Navbar + animation
const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

function App() {
  return (
    <Routes>
      {/* Dashboard routes with bottom nav and page transitions */}
      <Route element={<PageTransition />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="search" element={<FoodListing />} />
          <Route path="orders" element={<OrderTracking />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* Public routes with top navbar and page transitions */}
      <Route element={<PageTransition />}>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Landing />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/register"
          element={
            <PublicLayout>
              <Signup />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
      </Route>

      {/* Standalone pages (no navbar, no transition wrapper) */}
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/tracking/:orderId" element={<OrderTracking />} />
    </Routes>
  );
}

export default App;
