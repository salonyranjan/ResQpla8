import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion as Motion, useMotionValue, useSpring } from "framer-motion";

const ROUTE_PROFILES = {
  "/dashboard":        { color: "#52b788", label: "Home",      variant: "slide"   },
  "/dashboard/search": { color: "#f4a261", label: "Search",    variant: "zoom"    },
  "/dashboard/cart":   { color: "#e76f51", label: "Cart",      variant: "flip"    },
  "/dashboard/orders": { color: "#4cc9f0", label: "Orders",    variant: "curtain" },
  "/dashboard/profile":{ color: "#c77dff", label: "Profile",   variant: "morph"   },
};

const DEFAULT_PROFILE = { color: "#52b788", label: "Page", variant: "slide" };

function getProfile(pathname) {
  const key = Object.keys(ROUTE_PROFILES)
    .sort((a, b) => b.length - a.length)
    .find((k) => pathname.startsWith(k));
  return key ? ROUTE_PROFILES[key] : DEFAULT_PROFILE;
}

const VARIANTS = {
  slide: {
    initial:   { opacity: 0, y: 28, filter: "blur(6px)" },
    animate:   { opacity: 1, y: 0,  filter: "blur(0px)" },
    exit:      { opacity: 0, y: -20, filter: "blur(4px)" },
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
  },
  zoom: {
    initial:   { opacity: 0, scale: 0.94, filter: "blur(8px)" },
    animate:   { opacity: 1, scale: 1,    filter: "blur(0px)" },
    exit:      { opacity: 0, scale: 1.04, filter: "blur(6px)" },
    transition: { duration: 0.38, ease: [0.34, 1.56, 0.64, 1] },
  },
  flip: {
    initial:   { opacity: 0, rotateX: 8,  y: 30,  filter: "blur(6px)" },
    animate:   { opacity: 1, rotateX: 0,  y: 0,   filter: "blur(0px)" },
    exit:      { opacity: 0, rotateX: -6, y: -20, filter: "blur(4px)" },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  curtain: {
    initial:   { opacity: 0, clipPath: "inset(0 0 100% 0)" },
    animate:   { opacity: 1, clipPath: "inset(0 0 0% 0)" },
    exit:      { opacity: 0, clipPath: "inset(100% 0 0 0)" },
    transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
  },
  morph: {
    initial:   { opacity: 0, x: 40,  skewX: -4, filter: "blur(8px)" },
    animate:   { opacity: 1, x: 0,   skewX: 0,  filter: "blur(0px)" },
    exit:      { opacity: 0, x: -30, skewX: 3,  filter: "blur(4px)" },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

function ProgressBar({ color }) {
  const width = useMotionValue(0);
  const smooth = useSpring(width, { stiffness: 120, damping: 22 });

  useEffect(() => {
    width.set(0);
    const t1 = setTimeout(() => width.set(72), 80);
    const t2 = setTimeout(() => width.set(90), 300);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [color, width]);

  return (
    <Motion.div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "3px",
        width: smooth,
        background: `linear-gradient(90deg, ${color}cc, ${color})`,
        zIndex: 9999,
        borderRadius: "0 3px 3px 0",
        boxShadow: `0 0 12px ${color}88`,
        transformOrigin: "left center",
        pointerEvents: "none",
      }}
    />
  );
}

function RouteLabel({ label, color }) {
  return (
    <Motion.div
      initial={{ opacity: 0, x: -16, y: 4 }}
      animate={{ opacity: 1, x: 0,   y: 0  }}
      exit={{    opacity: 0, x: 0,   y: 8  }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        bottom: 28,
        left: 24,
        zIndex: 9998,
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "'DM Mono', 'Fira Code', monospace",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <Motion.span
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 8px ${color}`,
        }}
        animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
      />
      {label}
    </Motion.div>
  );
}

function InkSplash({ color }) {
  return (
    <Motion.div
      initial={{ scale: 0, opacity: 0.55 }}
      animate={{ scale: 18, opacity: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        translate: "-50% -50%",
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: color,
        zIndex: 9990,
        pointerEvents: "none",
        mixBlendMode: "screen",
        filter: "blur(2px)",
      }}
    />
  );
}

export default function PageTransition() {
  const location  = useLocation();
  const profile   = getProfile(location.pathname);
  const { variant, color, label } = profile;
  const v         = VARIANTS[variant];

  return (
    <>
      {/* ── Top progress bar ── */}
      <ProgressBar color={color} />

      {/* ── Ink splash burst ── */}
      <InkSplash key={`splash-${location.pathname}`} color={color} />

      {/* ── Route label ── */}
      <AnimatePresence>
        <RouteLabel key={location.pathname} label={label} color={color} />
      </AnimatePresence>

      {/* ── Page content with seamless transitions ── */}
      <AnimatePresence mode="wait" initial={false}>
        <Motion.div
          key={location.pathname}  /* <-- critical: changes on every route */
          initial={v.initial}
          animate={v.animate}
          exit={v.exit}
          transition={v.transition}
          style={{
            position: "relative",
            minHeight: "100vh",
            transformPerspective: 1200,
            willChange: "transform, opacity",
          }}
        >
          <Outlet />
        </Motion.div>
      </AnimatePresence>
    </>
  );
}
