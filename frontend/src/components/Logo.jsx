import { Link } from "react-router-dom";

const Logo = ({ className = "", compact = false, size = 40 }) => (
  <Link to="/" aria-label="ResQPlate home" className={className} style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "inherit", textDecoration: "none" }}>
    <img src="/logo.svg" width={size} height={size} alt="" aria-hidden="true" style={{ display: "block", flexShrink: 0, filter: "drop-shadow(0 8px 16px rgba(20,83,45,.2))" }} />
    {!compact && <span style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontSize: size * 0.5, fontWeight: 800, letterSpacing: "-.045em", lineHeight: 1 }}>ResQ<span style={{ color: "#52b788" }}>Plate</span></span>}
  </Link>
);

export default Logo;
