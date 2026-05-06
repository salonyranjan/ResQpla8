import { } from "framer-motion";

// Page-level transition: fade in while sliding up slightly.
export const pageReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

// Container for staggered children (lists, grids, cards).
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

// Individual item inside a staggered container.
export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

// Hover effect for interactive cards: slight scale-up and shadow lift.
export const hoverCard = {
  rest: { scale: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" },
  hover: {
    scale: 1.02,
    boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

// Fade-only variant (no vertical movement) for subtle reveals.
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

// Slide in from left (useful for side-drawers or list items).
export const slideLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// Slide in from right.
export const slideRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

// Scale up on appear (good for modals, hero elements).
export const scaleUp = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};
