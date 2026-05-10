import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";

/* ═══════════════════════════════════════════════
   FOODCARD — Standalone, no router/context deps
   Drop-in replacement that works anywhere
═══════════════════════════════════════════════ */

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap";

/* ── Inject styles once globally ── */
let stylesInjected = false;
const injectStyles = () => {
  if (stylesInjected || typeof document === "undefined") return;
  stylesInjected = true;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = FONT_URL;
  document.head.appendChild(link);

  const style = document.createElement("style");
  style.id = "fc-global";
  style.textContent = `
    .fc-root {
      --fc-radius: 22px;
      --fc-img-h: 200px;
      --fc-ease: cubic-bezier(0.34, 1.56, 0.64, 1);
      --fc-ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
      font-family: 'Outfit', system-ui, sans-serif;
    }

    /* LIGHT */
    .fc-root[data-theme="light"] {
      --fc-bg:            #ffffff;
      --fc-bg-alt:        #f5f2ee;
      --fc-bg-chip:       #eef7f2;
      --fc-border:        rgba(26, 74, 46, 0.1);
      --fc-border-accent: rgba(26, 74, 46, 0.22);
      --fc-text:          #111c15;
      --fc-text-sub:      #4a5e52;
      --fc-text-muted:    #8da398;
      --fc-accent:        #1a6b3c;
      --fc-accent-2:      #2d8a55;
      --fc-accent-soft:   rgba(26,107,60,0.08);
      --fc-amber:         #c97a0a;
      --fc-amber-soft:    rgba(201,122,10,0.09);
      --fc-red:           #c0392b;
      --fc-shadow-sm:     0 2px 16px rgba(26,74,46,0.07);
      --fc-shadow-md:     0 20px 56px rgba(26,74,46,0.16), 0 4px 16px rgba(26,74,46,0.08);
      --fc-shadow-btn:    0 6px 20px rgba(26,107,60,0.38);
      --fc-glow:          0 0 0 3px rgba(26,107,60,0.14);
    }

    /* DARK */
    .fc-root[data-theme="dark"] {
      --fc-bg:            #0f1a11;
      --fc-bg-alt:        #162019;
      --fc-bg-chip:       #1a2c1f;
      --fc-border:        rgba(52,211,113,0.1);
      --fc-border-accent: rgba(52,211,113,0.24);
      --fc-text:          #e8fdf0;
      --fc-text-sub:      #7dd898;
      --fc-text-muted:    #4a7a58;
      --fc-accent:        #34d371;
      --fc-accent-2:      #22c55e;
      --fc-accent-soft:   rgba(52,211,113,0.1);
      --fc-amber:         #f59e0b;
      --fc-amber-soft:    rgba(245,158,11,0.12);
      --fc-red:           #f87171;
      --fc-shadow-sm:     0 2px 16px rgba(0,0,0,0.5);
      --fc-shadow-md:     0 20px 56px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4);
      --fc-shadow-btn:    0 6px 24px rgba(52,211,113,0.4);
      --fc-glow:          0 0 0 3px rgba(52,211,113,0.18);
    }

    /* CARD SHELL */
    .fc-card {
      position: relative;
      display: block;
      background: var(--fc-bg);
      border-radius: var(--fc-radius);
      border: 1px solid var(--fc-border);
      box-shadow: var(--fc-shadow-sm);
      overflow: hidden;
      cursor: pointer;
      text-decoration: none;
      color: var(--fc-text);
      width: 300px;
      transition:
        box-shadow 0.5s var(--fc-ease-smooth),
        transform 0.5s var(--fc-ease-smooth),
        border-color 0.4s ease;
      will-change: transform;
    }

    .fc-card:hover {
      box-shadow: var(--fc-shadow-md);
      transform: translateY(-8px) scale(1.015);
      border-color: var(--fc-border-accent);
      outline: none;
    }

    .fc-card:focus-visible {
      box-shadow: var(--fc-glow), var(--fc-shadow-sm);
      outline: none;
    }

    /* IMAGE AREA */
    .fc-img-wrap {
      position: relative;
      height: var(--fc-img-h);
      overflow: hidden;
      background: var(--fc-bg-alt);
    }

    .fc-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.7s var(--fc-ease-smooth);
    }

    .fc-card:hover .fc-img { transform: scale(1.1); }

    /* Cinematic gradient overlay */
    .fc-img-wrap::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        170deg,
        transparent 30%,
        rgba(0,0,0,0.04) 60%,
        rgba(0,0,0,0.38) 100%
      );
      pointer-events: none;
      z-index: 1;
    }

    /* Noise texture overlay */
    .fc-img-noise {
      position: absolute;
      inset: 0;
      z-index: 2;
      opacity: 0.028;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      pointer-events: none;
    }

    /* CATEGORY BADGE */
    .fc-badge {
      position: absolute;
      top: 14px;
      left: 14px;
      z-index: 4;
      background: var(--fc-bg);
      color: var(--fc-accent);
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      padding: 5px 11px;
      border-radius: 100px;
      border: 1px solid var(--fc-border-accent);
      transition: transform 0.4s var(--fc-ease), box-shadow 0.4s ease;
      backdrop-filter: blur(12px);
    }

    .fc-card:hover .fc-badge {
      transform: translateY(-2px);
      box-shadow: var(--fc-shadow-sm);
    }

    /* ADD BUTTON */
    .fc-add-btn {
      position: absolute;
      top: 14px;
      right: 14px;
      z-index: 4;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 1.5px solid var(--fc-border-accent);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--fc-bg);
      color: var(--fc-accent);
      font-size: 22px;
      font-weight: 300;
      line-height: 1;
      backdrop-filter: blur(12px);
      transition:
        background 0.35s var(--fc-ease),
        color 0.35s ease,
        transform 0.5s var(--fc-ease),
        box-shadow 0.35s ease,
        border-color 0.35s ease;
    }

    .fc-add-btn:hover {
      background: var(--fc-accent);
      color: #fff;
      border-color: transparent;
      transform: scale(1.15) rotate(90deg);
      box-shadow: var(--fc-shadow-btn);
    }

    .fc-add-btn.fc-added {
      background: var(--fc-accent);
      color: #fff;
      border-color: transparent;
      animation: fc-pop-btn 0.6s var(--fc-ease) forwards;
    }

    @keyframes fc-pop-btn {
      0%   { transform: scale(1) rotate(0deg); }
      35%  { transform: scale(1.4) rotate(12deg); }
      65%  { transform: scale(0.9) rotate(-4deg); }
      100% { transform: scale(1) rotate(0deg); }
    }

    /* EXPIRES RIBBON */
    .fc-ribbon {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 3;
      padding: 6px 16px;
      background: linear-gradient(90deg, var(--fc-amber), rgba(0,0,0,0));
      color: #fff;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9.5px;
      font-weight: 500;
      letter-spacing: 0.06em;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* BODY */
    .fc-body {
      padding: 18px 20px 20px;
    }

    .fc-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 20px;
      font-weight: 700;
      color: var(--fc-text);
      line-height: 1.2;
      margin: 0 0 4px;
      transition: color 0.25s ease;
      letter-spacing: -0.01em;
    }

    .fc-card:hover .fc-name { color: var(--fc-accent); }

    .fc-restaurant {
      font-size: 11px;
      font-weight: 600;
      color: var(--fc-accent);
      font-family: 'JetBrains Mono', monospace;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin: 0 0 8px;
      opacity: 0.85;
    }

    .fc-desc {
      font-size: 13px;
      font-weight: 300;
      color: var(--fc-text-muted);
      line-height: 1.6;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .fc-divider {
      height: 1px;
      background: var(--fc-border);
      margin: 14px 0;
    }

    /* META ROW */
    .fc-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .fc-meta-chip {
      display: flex;
      align-items: center;
      gap: 5px;
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: var(--fc-text-sub);
      background: var(--fc-bg-chip);
      border: 1px solid var(--fc-border);
      padding: 4px 10px;
      border-radius: 100px;
    }

    .fc-rating-chip {
      color: var(--fc-amber);
      background: var(--fc-amber-soft);
      border-color: rgba(201,122,10,0.14);
    }

    /* QUANTITY FOOTER */
    .fc-footer {
      margin-top: 14px;
      padding: 11px 14px;
      background: var(--fc-accent-soft);
      border-radius: 14px;
      border: 1px solid var(--fc-border-accent);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .fc-qty-label {
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      font-weight: 400;
      color: var(--fc-text-muted);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .fc-qty-value {
      font-family: 'Outfit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: var(--fc-accent);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .fc-pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--fc-accent);
      animation: fc-pulse 2s ease-in-out infinite;
      flex-shrink: 0;
    }

    @keyframes fc-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.35; transform: scale(0.7); }
    }

    /* DARK TOGGLE */
    .fc-toggle-row {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 10px;
    }

    .fc-toggle-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: var(--fc-bg);
      border: 1px solid var(--fc-border-accent);
      border-radius: 100px;
      padding: 5px 13px 5px 8px;
      cursor: pointer;
      font-family: 'Outfit', sans-serif;
      font-size: 12px;
      font-weight: 500;
      color: var(--fc-text-sub);
      transition: all 0.3s ease;
      user-select: none;
      box-shadow: var(--fc-shadow-sm);
    }

    .fc-toggle-pill:hover {
      border-color: var(--fc-accent);
      color: var(--fc-accent);
      box-shadow: var(--fc-glow);
    }

    .fc-track {
      width: 32px;
      height: 18px;
      border-radius: 100px;
      background: var(--fc-border);
      position: relative;
      transition: background 0.35s ease;
      flex-shrink: 0;
    }

    .fc-track.on { background: var(--fc-accent); }

    .fc-thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #fff;
      transition: transform 0.4s var(--fc-ease);
      box-shadow: 0 1px 6px rgba(0,0,0,0.25);
    }

    .fc-track.on .fc-thumb { transform: translateX(14px); }

    /* IMAGE PLACEHOLDER (when no image src) */
    .fc-img-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(135deg, var(--fc-bg-alt) 0%, var(--fc-bg-chip) 100%);
    }

    .fc-img-placeholder-icon {
      font-size: 40px;
      filter: saturate(0.6);
    }

    .fc-img-placeholder-text {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      color: var(--fc-text-muted);
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }
  `;
  document.head.appendChild(style);
};

/* ══════════════════════════════════════════
   FOOD CARD COMPONENT
══════════════════════════════════════════ */
const FoodCard = ({
  item = {},
  onClick,
  externalDark,
  onDarkToggle,
}) => {
  const [added, setAdded] = useState(false);
  const [dark, setDark] = useState(true); // ← dark mode is now DEFAULT
  const cardRef = useRef(null);
  const { addItem } = useCart();

  // Allow external dark control or internal
  const isDark = externalDark !== undefined ? externalDark : dark;
  const handleDarkToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDarkToggle) onDarkToggle(!isDark);
    else setDark((d) => !d);
  };

  useEffect(() => { injectStyles(); }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Map Appwrite document fields to the context's Product type
    addItem({
      id: item.$id,
      name: item.foodItem || "Surplus Meal",
      price: 0, // Since ResQPlate is for donation
      restaurant: item.restaurant,
      image: item.imageUrl
    }, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const handleClick = () => {
    if (onClick) onClick(item);
  };

  const {
    name = "Dal Makhani Thali",
    restaurant = "Spice Garden",
    category = "Indian",
    description = "Rich creamy dal makhani with basmati rice, sabzi, and fresh rotis.",
    image = "",
    expiresIn = "2h 30m",
    distance = "0.8 km",
    rating = 4.8,
    quantity = 45,
  } = item;

  return (
    <div className="fc-root" data-theme={isDark ? "dark" : "light"} style={{ display: "inline-block" }}>
      {/* Dark toggle */}
      <div className="fc-toggle-row">
        <button className="fc-toggle-pill" onClick={handleDarkToggle} aria-label="Toggle dark mode">
          <div className={`fc-track ${isDark ? "on" : ""}`}>
            <div className="fc-thumb" />
          </div>
          {isDark ? "🌙 Dark" : "☀️ Light"}
        </button>
      </div>

      <div
        ref={cardRef}
        className="fc-card"
        role="article"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => e.key === "Enter" && handleClick()}
        aria-label={`Food item: ${name} from ${restaurant}`}
      >
        {/* ── Image ── */}
        <div className="fc-img-wrap">
          {image ? (
            <img src={image} alt={name} className="fc-img" loading="lazy" decoding="async" />
          ) : (
            <div className="fc-img-placeholder">
              <span className="fc-img-placeholder-icon">🍱</span>
              <span className="fc-img-placeholder-text">food photo</span>
            </div>
          )}
          <div className="fc-img-noise" aria-hidden="true" />

          {/* Category badge */}
          <span className="fc-badge">{category}</span>

          {/* Add-to-cart button */}
          <button
            onClick={handleAdd}
            className={`fc-add-btn ${added ? "fc-added" : ""}`}
            aria-label={`Add ${name} to cart`}
            type="button"
          >
            {added ? "✓" : "+"}
          </button>

          {/* Expires ribbon */}
          <div className="fc-ribbon">
            <span>⏱</span>
            <span>Expires in {expiresIn}</span>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="fc-body">
          <p className="fc-restaurant">{restaurant}</p>
          <h3 className="fc-name">{name}</h3>
          <p className="fc-desc">{description}</p>

          <div className="fc-divider" />

          <div className="fc-meta">
            <span className="fc-meta-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {distance}
            </span>
            <span className="fc-meta-chip fc-rating-chip">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {rating}
            </span>
          </div>

          {/* Quantity footer */}
          <div className="fc-footer">
            <span className="fc-qty-label">Available</span>
            <span className="fc-qty-value">
              <span className="fc-pulse-dot" />
              {quantity} portions
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;