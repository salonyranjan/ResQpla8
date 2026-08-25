import { lazy, Suspense, useEffect } from "react";
import { Navigate, Route, Routes, Outlet, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/NavBar.jsx";
import PageTransition from "./components/PageTransition.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Landing = lazy(() => import("./components/Landing.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const Signup = lazy(() => import("./pages/Signup.jsx"));
const Contact = lazy(() => import("./components/Contact/Contact.jsx"));
const About = lazy(() => import("./components/About.jsx"));
const DashboardLayout = lazy(() => import("./layouts/DashboardLayout.jsx"));
const DashboardHome = lazy(() => import("./pages/DashboardHome.jsx"));
const FoodListing = lazy(() => import("./pages/FoodListing.jsx"));
const CartPage = lazy(() => import("./pages/Cart.jsx"));
const CheckoutPage = lazy(() => import("./pages/Checkout.jsx"));
const OrderTracking = lazy(() => import("./pages/OrderTracking.jsx"));
const MapView = lazy(() => import("./components/MapView.jsx"));
const ProfilePage = lazy(() => import("./pages/Profile.jsx"));
const Settings = lazy(() => import("./pages/Settings.jsx"));
const AIMatching = lazy(() => import("./pages/AIMatching.jsx"));
const DonateFood = lazy(() => import("./pages/DonateFood.jsx"));
const Analytics = lazy(() => import("./pages/Analytics.jsx"));
const SmartAlerts = lazy(() => import("./pages/SmartAlerts.jsx"));
const VolunteerPickup = lazy(() => import("./pages/VolunteerPickup.jsx"));
const ImpactDelivered = lazy(() => import("./pages/ImpactDelivered.jsx"));
const Leaderboard = lazy(() => import("./pages/Leaderboard.jsx"));
const ResQBot = lazy(() => import("./components/Chat/ResQBot"));

const SITE_URL = "https://res-q-plate.vercel.app";
const DEFAULT_SOCIAL_IMAGE = `${SITE_URL}/screenshots/home-light.png`;
const PUBLIC_SEO = {
  "/": {
    title: "ResQPlate | Rescue Surplus Food Together",
    description: "ResQPlate connects food donors, receivers, and volunteers to rescue surplus meals through secure claims, coordinated pickups, and live impact tracking.",
  },
  "/about": {
    title: "About ResQPlate | Technology for Food Rescue",
    description: "Discover how ResQPlate uses technology and community coordination to connect surplus food with people who can put it to use.",
  },
  "/contact": {
    title: "Contact ResQPlate | Join the Food Rescue Community",
    description: "Contact ResQPlate about food donation, community partnerships, receiver support, volunteering, or local food rescue coordination.",
  },
};

function setMeta(selector, attribute, value) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

const SeoManager = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = PUBLIC_SEO[pathname];
    const title = seo?.title || "ResQPlate | Secure Food Rescue Workspace";
    const description = seo?.description || "Sign in to use ResQPlate's secure food donation, claiming, volunteer coordination, and rescue tracking tools.";
    const canonicalUrl = `${SITE_URL}${seo ? pathname : "/"}`;
    document.title = title;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="robots"]', "content", seo ? "index, follow, max-image-preview:large" : "noindex, nofollow");
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonicalUrl);
    setMeta('meta[property="og:image"]', "content", DEFAULT_SOCIAL_IMAGE);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="twitter:image"]', "content", DEFAULT_SOCIAL_IMAGE);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;
  }, [pathname]);
  return null;
};

const AppLoader = () => (
  <div role="status" aria-label="Loading page" style={{ minHeight: "45vh", display: "grid", placeItems: "center", color: "#16a34a", fontWeight: 700 }}>
    Loading…
  </div>
);

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const RoleRoute = ({ roles, children }) => <ProtectedRoute allowedRoles={roles}>{children}</ProtectedRoute>;

const RouteScrollManager = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)));
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);
  return null;
};

function App() {
  return (
    <Suspense fallback={<AppLoader />}>
        <SeoManager />
        <RouteScrollManager />
        <Routes>
          {/* ── DASHBOARD (protected) ── */}
          <Route element={<PageTransition />}>
            <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route index          element={<DashboardHome />}  />
              <Route path="search"  element={<RoleRoute roles={["receiver"]}><FoodListing /></RoleRoute>} />
              <Route path="map"     element={<MapView />}        />
              <Route path="orders"  element={<OrderTracking />} />
              <Route path="orders/:orderId" element={<OrderTracking />} />
              <Route path="track"   element={<OrderTracking />}  />
              <Route path="profile" element={<ProfilePage />}    />
              <Route path="settings" element={<Settings />} />
              <Route path="ai-matching" element={<RoleRoute roles={["receiver"]}><AIMatching /></RoleRoute>} />
              <Route path="donate" element={<RoleRoute roles={["donor"]}><DonateFood /></RoleRoute>} />
              <Route path="analytics" element={<RoleRoute roles={["donor"]}><Analytics /></RoleRoute>} />
              <Route path="smart-alerts" element={<SmartAlerts />} />
              <Route path="post-60" element={<Navigate to="/dashboard/donate" replace />} />
              <Route path="volunteer" element={<RoleRoute roles={["volunteer"]}><VolunteerPickup /></RoleRoute>} />
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
              <Route path="/donations" element={<RoleRoute roles={["receiver"]}><FoodListing /></RoleRoute>} />
              <Route path="/map"      element={<MapView />}  />
            </Route>
          </Route>

          {/* ── STANDALONE ── */}
          <Route path="/cart"                element={<RoleRoute roles={["receiver"]}><CartPage /></RoleRoute>} />
          <Route path="/checkout"            element={<RoleRoute roles={["receiver"]}><CheckoutPage /></RoleRoute>} />
          <Route path="/tracking/:orderId"   element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
          <Route path="*"                    element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Floating Components */}
        <ResQBot />
    </Suspense>
  );
}

export default App;
