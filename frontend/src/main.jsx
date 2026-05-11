import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// Context & State Providers
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

// Styles
import "./index.css";
import "./App.css";
import "leaflet/dist/leaflet.css";

// Components
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
