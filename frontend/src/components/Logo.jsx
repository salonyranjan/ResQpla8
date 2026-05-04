import { Link } from "react-router-dom";

const NEON = "#39ff14";

const Logo = ({ neon = false, className = "" }) => {
  const baseClass = `flex items-center gap-2 group transition-opacity hover:opacity-90 ${className}`;
  return (
    <Link to="/" className={baseClass}>
      <span
        className="text-2xl font-extrabold tracking-tight font-sans"
        style={
          neon
            ? { color: NEON, textShadow: `0 0 12px ${NEON}` }
            : { color: "inherit" }
        }
      >
        ResQ<span style={{ color: neon ? NEON : "inherit" }}>Plate</span>
      </span>
    </Link>
  );
};

export default Logo;
