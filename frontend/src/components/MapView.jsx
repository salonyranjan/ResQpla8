import { useEffect, useState, useRef, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  Circle,
} from "react-leaflet";
import { foodListings } from "../data/mockData";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ═══════════════════════════════════════════════════
   MapView — God-Level Edition
   Deps: react-leaflet, leaflet
   Fonts: loaded inline
═══════════════════════════════════════════════════ */

/* ── Global Styles ── */
const useMapStyles = () => {
  useEffect(() => {
    if (document.getElementById("rq-map-styles")) return;

    const link = document.createElement("link");
    link.id = "rq-map-font";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.id = "rq-map-styles";
    style.textContent = `
      .rq-map-root *, .rq-map-root *::before, .rq-map-root *::after {
        box-sizing: border-box; margin: 0; padding: 0;
      }
      .rq-map-root { font-family: 'DM Sans', system-ui, sans-serif; }
      .rq-map-root .mono { font-family: 'DM Mono', monospace; }

      /* Leaflet overrides */
      .rq-map-root .leaflet-container {
        background: #0d1f12;
        font-family: 'DM Sans', system-ui, sans-serif;
      }
      .rq-map-root .leaflet-popup-content-wrapper {
        background: rgba(10,22,14,0.97);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(82,183,136,0.18);
        border-radius: 18px;
        box-shadow: 0 24px 64px rgba(0,0,0,0.5);
        color: #fff;
        padding: 0;
      }
      .rq-map-root .leaflet-popup-content { margin: 0; }
      .rq-map-root .leaflet-popup-tip-container { display: none; }
      .rq-map-root .leaflet-popup-close-button {
        color: rgba(255,255,255,0.4) !important;
        font-size: 18px !important;
        top: 10px !important; right: 14px !important;
      }
      .rq-map-root .leaflet-popup-close-button:hover { color: #fff !important; }
      .rq-map-root .leaflet-control-zoom {
        border: none !important;
        border-radius: 16px !important;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4) !important;
      }
      .rq-map-root .leaflet-control-zoom a {
        background: rgba(10,22,14,0.92) !important;
        backdrop-filter: blur(12px) !important;
        color: rgba(255,255,255,0.7) !important;
        border: none !important;
        border-bottom: 1px solid rgba(255,255,255,0.06) !important;
        width: 40px !important; height: 40px !important;
        line-height: 40px !important;
        font-size: 18px !important;
        transition: background 0.2s, color 0.2s;
      }
      .rq-map-root .leaflet-control-zoom a:hover {
        background: rgba(45,138,85,0.6) !important;
        color: #fff !important;
      }
      .rq-map-root .leaflet-control-attribution {
        background: rgba(0,0,0,0.5) !important;
        color: rgba(255,255,255,0.3) !important;
        font-size: 9px !important;
        backdrop-filter: blur(8px);
      }
      .rq-map-root .leaflet-control-attribution a { color: rgba(82,183,136,0.6) !important; }

      /* Custom markers */
      .rq-marker { position: relative; }
      .rq-marker-ring {
        position: absolute;
        border-radius: 50%;
        animation: rq-ping 2.4s ease-out infinite;
        pointer-events: none;
      }
      @keyframes rq-ping {
        0%   { transform: scale(1); opacity: 0.6; }
        80%  { transform: scale(2.6); opacity: 0; }
        100% { transform: scale(2.6); opacity: 0; }
      }
      @keyframes rq-slide-up {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes rq-fade-in {
        from { opacity: 0; }
        to   { opacity: 1; }
      }
      @keyframes rq-shimmer {
        0%,100% { background-position: 0% 50%; }
        50%      { background-position: 100% 50%; }
      }
      @keyframes rq-pulse-dot {
        0%,100% { opacity: 1; transform: scale(1); }
        50%      { opacity: 0.3; transform: scale(0.65); }
      }
      @keyframes rq-spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      /* Sidebar */
      .rq-sidebar {
        position: absolute;
        top: 0; left: 0; bottom: 0;
        width: 360px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        background: rgba(8,16,10,0.92);
        backdrop-filter: blur(28px);
        border-right: 1px solid rgba(82,183,136,0.1);
        animation: rq-fade-in 0.4s ease;
      }
      .rq-listing-card {
        cursor: pointer;
        border-bottom: 1px solid rgba(255,255,255,0.04);
        padding: 16px 20px;
        transition: background 0.18s;
        animation: rq-slide-up 0.4s ease;
      }
      .rq-listing-card:hover { background: rgba(82,183,136,0.07); }
      .rq-listing-card.active { background: rgba(82,183,136,0.12); border-left: 2px solid #52b788; }

      /* Controls */
      .rq-control-btn {
        display: flex; align-items: center; justify-content: center;
        width: 48px; height: 48px; border-radius: 16px;
        background: rgba(8,16,10,0.92);
        backdrop-filter: blur(16px);
        border: 1px solid rgba(82,183,136,0.14);
        cursor: pointer; transition: all 0.2s;
        color: rgba(255,255,255,0.6);
        box-shadow: 0 8px 24px rgba(0,0,0,0.35);
      }
      .rq-control-btn:hover {
        background: rgba(45,138,85,0.35);
        border-color: rgba(82,183,136,0.4);
        color: #fff;
      }
      .rq-control-btn.active {
        background: rgba(45,138,85,0.5);
        border-color: #52b788;
        color: #fff;
      }

      /* Filter chips */
      .rq-chip {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 6px 14px; border-radius: 100px;
        font-size: 12px; font-weight: 500; cursor: pointer;
        border: 1px solid rgba(255,255,255,0.1);
        background: rgba(255,255,255,0.05);
        color: rgba(255,255,255,0.55);
        transition: all 0.18s; white-space: nowrap;
        font-family: 'DM Sans', sans-serif;
      }
      .rq-chip:hover {
        background: rgba(82,183,136,0.15);
        border-color: rgba(82,183,136,0.35);
        color: #95d5b2;
      }
      .rq-chip.active {
        background: rgba(82,183,136,0.2);
        border-color: #52b788;
        color: #52b788;
      }

      /* Scrollbar */
      .rq-sidebar-list::-webkit-scrollbar { width: 3px; }
      .rq-sidebar-list::-webkit-scrollbar-track { background: transparent; }
      .rq-sidebar-list::-webkit-scrollbar-thumb { background: rgba(82,183,136,0.25); border-radius: 10px; }

      /* Search input */
      .rq-search-input {
        width: 100%; background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 14px; padding: 11px 16px 11px 40px;
        color: #fff; font-size: 13.5px;
        font-family: 'DM Sans', sans-serif;
        outline: none; transition: border-color 0.2s, background 0.2s;
      }
      .rq-search-input::placeholder { color: rgba(255,255,255,0.28); }
      .rq-search-input:focus {
        border-color: rgba(82,183,136,0.45);
        background: rgba(82,183,136,0.06);
      }

      /* Status badge */
      .rq-status {
        display: inline-flex; align-items: center; gap: 5px;
        padding: 3px 10px; border-radius: 100px;
        font-size: 10.5px; font-weight: 600;
        font-family: 'DM Mono', monospace; letter-spacing: 0.04em;
      }
      .rq-status.available { background: rgba(82,183,136,0.15); color: #52b788; }
      .rq-status.urgent    { background: rgba(239,68,68,0.15);  color: #f87171; }
      .rq-status.claimed   { background: rgba(59,130,246,0.15); color: #60a5fa; }

      /* Detail panel */
      .rq-detail-panel {
        position: absolute;
        bottom: 24px; right: 24px;
        width: 320px; z-index: 1100;
        background: rgba(8,16,10,0.95);
        backdrop-filter: blur(28px);
        border: 1px solid rgba(82,183,136,0.2);
        border-radius: 24px;
        box-shadow: 0 32px 80px rgba(0,0,0,0.55);
        overflow: hidden;
        animation: rq-slide-up 0.3s ease;
      }

      @media (max-width: 768px) {
        .rq-sidebar { width: 100%; top: auto; height: 52%; border-right: none; border-top: 1px solid rgba(82,183,136,0.14); }
        .rq-detail-panel { bottom: 56%; right: 0; left: 0; width: auto; border-radius: 24px 24px 0 0; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.getElementById("rq-map-styles")?.remove(); };
  }, []);
};

/* ── Design tokens ── */
const C = {
  bg:          "rgba(8,16,10,0.92)",
  accent:      "#2d8a55",
  accentLight: "#52b788",
  mint:        "#95d5b2",
  gold:        "#d4a017",
  goldLight:   "#f0c040",
  red:         "#ef4444",
  blue:        "#3b82f6",
  purple:      "#8b5cf6",
  text:        "#ffffff",
  textMuted:   "rgba(255,255,255,0.45)",
  textFaint:   "rgba(255,255,255,0.2)",
  border:      "rgba(82,183,136,0.14)",
};

/* ── Mock data enrichment (fallback if mockData is sparse) ── */
const MOCK_LISTINGS = [
  { id: 1, name: "Dal Makhani + Rice", restaurant: "Spice Garden", quantity: "45 meals", type: "Cooked", status: "available", emoji: "🍛", location: { lat: 28.6139, lng: 77.2090 }, expires: "2h 30m", distance: "0.4 km" },
  { id: 2, name: "Fresh Salad Boxes",  restaurant: "Green Bowl",   quantity: "28 boxes",  type: "Ready-to-eat", status: "urgent", emoji: "🥗", location: { lat: 28.6189, lng: 77.2140 }, expires: "45m",    distance: "1.1 km" },
  { id: 3, name: "Biryani Portions",   restaurant: "Royal Feast",  quantity: "60 meals",  type: "Cooked", status: "available", emoji: "🍚", location: { lat: 28.6080, lng: 77.2020 }, expires: "4h",      distance: "1.8 km" },
  { id: 4, name: "Bread & Pastries",   restaurant: "Sunrise Bakery",quantity: "90 pieces",type: "Bakery", status: "claimed",   emoji: "🥐", location: { lat: 28.6210, lng: 77.2010 }, expires: "6h",      distance: "2.3 km" },
  { id: 5, name: "Paneer Curry",       restaurant: "Dhaba Classics",quantity: "35 meals", type: "Cooked", status: "available", emoji: "🫕", location: { lat: 28.6060, lng: 77.2160 }, expires: "3h",      distance: "2.7 km" },
  { id: 6, name: "Fruit Platters",     restaurant: "Fresh Mart",   quantity: "20 platters",type: "Raw",   status: "urgent",   emoji: "🍱", location: { lat: 28.6155, lng: 77.1980 }, expires: "1h",      distance: "3.1 km" },
];

/* ── Custom Marker Icons ── */
const makeIcon = (color, emoji, size = 36) =>
  L.divIcon({
    className: "",
    html: `
      <div class="rq-marker" style="width:${size}px; height:${size}px; position:relative;">
        <div class="rq-marker-ring" style="
          width:${size}px; height:${size}px;
          background:${color}; opacity:0.28;
          top:0; left:0;
        "></div>
        <div style="
          position:absolute; inset:0;
          background:${color};
          border-radius:50%;
          border:2.5px solid rgba(255,255,255,0.9);
          box-shadow: 0 4px 20px ${color}88, 0 0 0 1px ${color}44;
          display:flex; align-items:center; justify-content:center;
          font-size:${size * 0.44}px;
          z-index:1;
        ">${emoji}</div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 8],
  });

const userIcon = L.divIcon({
  className: "",
  html: `
    <div style="position:relative; width:20px; height:20px;">
      <div style="
        position:absolute; inset:-8px;
        background:rgba(59,130,246,0.18);
        border-radius:50%;
        animation:rq-ping 2.5s ease-out infinite;
      "></div>
      <div style="
        width:20px; height:20px; border-radius:50%;
        background:#3b82f6;
        border:3px solid #fff;
        box-shadow:0 2px 12px rgba(59,130,246,0.6);
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const getMarkerColor = (status) =>
  status === "urgent" ? C.red : status === "claimed" ? C.blue : C.accentLight;

/* ── Map event controller ── */
const MapController = ({ center, onLocationFound, onMapClick }) => {
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 14 });
  }, [map]);

  useMapEvents({
    locationfound(e) { onLocationFound?.(e.latlng); },
    click(e) { onMapClick?.(e.latlng); },
  });

  useEffect(() => {
    if (center) map.flyTo(center, 15, { duration: 1.2 });
  }, [center, map]);

  return null;
};

/* ── Listing Card ── */
const ListingCard = ({ item, isActive, onClick }) => (
  <div
    className={`rq-listing-card${isActive ? " active" : ""}`}
    onClick={() => onClick(item)}
  >
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
      <div style={{
        width: 44, height: 44, borderRadius: 14, flexShrink: 0,
        background: `${getMarkerColor(item.status)}18`,
        border: `1px solid ${getMarkerColor(item.status)}28`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22,
      }}>{item.emoji || "🍱"}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{item.name}</div>
          <span className={`rq-status ${item.status}`}>{item.status}</span>
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>{item.restaurant}</div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="mono" style={{ fontSize: 11, color: C.accentLight, fontWeight: 500 }}>{item.quantity}</div>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: C.textFaint, flexShrink: 0 }} />
          <div className="mono" style={{ fontSize: 11, color: item.expires?.includes("m") ? "#f87171" : C.textMuted }}>⏱ {item.expires}</div>
          <div style={{ width: 3, height: 3, borderRadius: "50%", background: C.textFaint, flexShrink: 0 }} />
          <div className="mono" style={{ fontSize: 11, color: C.textMuted }}>📍 {item.distance}</div>
        </div>
      </div>
    </div>
  </div>
);

/* ── Detail Panel ── */
const DetailPanel = ({ item, onClose, onAccept }) => {
  const [claimed, setClaimed] = useState(false);
  if (!item) return null;
  const color = getMarkerColor(item.status);
  return (
    <div className="rq-detail-panel">
      {/* Header stripe */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />

      <div style={{ padding: "20px 22px" }}>
        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{
              width: 50, height: 50, borderRadius: 16, fontSize: 26,
              background: `${color}18`, border: `1px solid ${color}28`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{item.emoji || "🍱"}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>{item.name}</div>
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>{item.restaurant}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, width: 32, height: 32, cursor: "pointer", color: C.textMuted, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 18 }}>
          {[
            { label: "Quantity", value: item.quantity },
            { label: "Expires", value: item.expires },
            { label: "Distance", value: item.distance },
          ].map((s, i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "10px 12px", textAlign: "center" }}>
              <div className="mono" style={{ fontSize: 10, color: C.textMuted, marginBottom: 5, letterSpacing: "0.08em" }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#fff" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {[item.type, "Pickup", "Verified"].map((tag, i) => (
            <div key={i} style={{
              fontSize: 11, color: C.accentLight, background: "rgba(82,183,136,0.1)",
              border: "1px solid rgba(82,183,136,0.18)", borderRadius: 100, padding: "4px 12px",
              fontFamily: "'DM Mono',monospace",
            }}>{tag}</div>
          ))}
        </div>

        {/* CTA */}
        {item.status !== "claimed" ? (
          <button
            onClick={() => { setClaimed(true); onAccept?.(item); }}
            disabled={claimed}
            style={{
              width: "100%", padding: "13px 0", borderRadius: 14,
              background: claimed
                ? "rgba(82,183,136,0.2)"
                : `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              color: claimed ? C.accentLight : "#fff",
              border: "none", cursor: claimed ? "default" : "pointer",
              fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14.5,
              transition: "all 0.2s",
              boxShadow: claimed ? "none" : `0 8px 28px ${C.accent}55`,
            }}
          >
            {claimed ? "✓  Pickup Confirmed!" : "Accept Pickup →"}
          </button>
        ) : (
          <div style={{ textAlign: "center", padding: "13px 0", color: C.blue, fontSize: 13.5, fontWeight: 600 }}>
            Already claimed by another NGO
          </div>
        )}
      </div>
    </div>
  );
};

/* ── Popup content ── */
const PopupContent = ({ item }) => (
  <div style={{ padding: "16px 18px", minWidth: 200 }}>
    <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
      <span style={{ fontSize: 22 }}>{item.emoji || "🍱"}</span>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>{item.name}</div>
        <div style={{ fontSize: 11, color: C.textMuted }}>{item.restaurant}</div>
      </div>
    </div>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <span className={`rq-status ${item.status}`}>{item.status}</span>
      <span className="mono" style={{ fontSize: 10.5, color: C.accentLight, background: "rgba(82,183,136,0.1)", borderRadius: 100, padding: "3px 10px" }}>{item.quantity}</span>
    </div>
    <div className="mono" style={{ fontSize: 10.5, color: item.expires?.includes("m") ? "#f87171" : C.textMuted, marginTop: 10 }}>⏱ Expires in {item.expires}</div>
  </div>
);

/* ── Stats bar ── */
const StatsBar = ({ listings }) => {
  const available = listings.filter(l => l.status === "available").length;
  const urgent    = listings.filter(l => l.status === "urgent").length;
  const claimed   = listings.filter(l => l.status === "claimed").length;
  return (
    <div style={{
      display: "flex", gap: 20, padding: "14px 20px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      flexShrink: 0,
    }}>
      {[
        { label: "Available", count: available, color: C.accentLight },
        { label: "Urgent",    count: urgent,    color: C.red },
        { label: "Claimed",   count: claimed,   color: C.blue },
      ].map((s, i) => (
        <div key={i} style={{ textAlign: "center", flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: "'DM Sans',sans-serif", lineHeight: 1 }}>{s.count}</div>
          <div className="mono" style={{ fontSize: 9.5, color: C.textMuted, marginTop: 4, letterSpacing: "0.06em" }}>{s.label}</div>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════ */
const MapView = ({ selectedPickup, onPickupSelect }) => {
  useMapStyles();

  const listings = (foodListings?.length ? foodListings : MOCK_LISTINGS).map((item, i) => ({
    ...MOCK_LISTINGS[i % MOCK_LISTINGS.length],
    ...item,
  }));

  const [mapCenter, setMapCenter]           = useState(null);
  const [userLocation, setUserLocation]     = useState(null);
  const [pickupLocation, setPickupLocation] = useState(selectedPickup?.location || null);
  const [searchText, setSearchText]         = useState("");
  const [activeFilter, setActiveFilter]     = useState("all");
  const [selectedItem, setSelectedItem]     = useState(null);
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [isLocating, setIsLocating]         = useState(false);
  const [mapReady, setMapReady]             = useState(false);

  const handleLocationFound = useCallback((latlng) => {
    setUserLocation(latlng);
    setIsLocating(false);
  }, []);

  const handleMapClick = useCallback((latlng) => {
    if (onPickupSelect) {
      setPickupLocation(latlng);
      onPickupSelect(latlng);
    }
  }, [onPickupSelect]);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
    setMapCenter([item.location.lat, item.location.lng]);
  };

  const locateMe = () => {
    setIsLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(latlng);
        setMapCenter([latlng.lat, latlng.lng]);
        setIsLocating(false);
      },
      () => setIsLocating(false)
    );
  };

  const filteredListings = listings.filter(item => {
    const matchesFilter = activeFilter === "all" || item.status === activeFilter;
    const matchesSearch = !searchText || [item.name, item.restaurant, item.type]
      .some(v => v?.toLowerCase().includes(searchText.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const FILTERS = [
    { id: "all",       label: "All",       emoji: "🗺️" },
    { id: "available", label: "Available", emoji: "✅" },
    { id: "urgent",    label: "Urgent",    emoji: "🔴" },
    { id: "claimed",   label: "Claimed",   emoji: "🔵" },
  ];

  return (
    <div className="rq-map-root" style={{ position: "relative", height: "100vh", width: "100%", overflow: "hidden", background: "#0d1f12" }}>

      {/* ── SIDEBAR ── */}
      {sidebarOpen && (
        <div className="rq-sidebar">
          {/* Header */}
          <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", flexShrink: 0 }}>
            {/* Logo row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: "linear-gradient(135deg,#2d8a55,#0d9488)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</div>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, fontWeight: 700, color: "#fff" }}>
                  ResQ<span style={{ color: "#d4a017" }}>Map</span>
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.accentLight, animation: "rq-pulse-dot 2s infinite" }} />
                <span className="mono" style={{ fontSize: 10, color: C.accentLight }}>LIVE</span>
              </div>
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: 14 }}>
              <svg style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, opacity: 0.4, pointerEvents: "none" }} fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="rq-search-input"
                placeholder="Search food, restaurant…"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
              />
            </div>

            {/* Filter chips */}
            <div style={{ display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4 }}>
              {FILTERS.map(f => (
                <button key={f.id} className={`rq-chip${activeFilter === f.id ? " active" : ""}`}
                  onClick={() => setActiveFilter(f.id)}>
                  {f.emoji} {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Listings */}
          <div className="rq-sidebar-list" style={{ flex: 1, overflowY: "auto" }}>
            {filteredListings.length === 0 ? (
              <div style={{ padding: "48px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 14 }}>🔍</div>
                <div style={{ fontSize: 14, color: C.textMuted }}>No listings match your search</div>
              </div>
            ) : filteredListings.map(item => (
              <ListingCard key={item.id} item={item} isActive={selectedItem?.id === item.id} onClick={handleItemSelect} />
            ))}
          </div>

          {/* Stats */}
          <StatsBar listings={listings} />
        </div>
      )}

      {/* ── MAP ── */}
      <div style={{ position: "absolute", inset: 0, left: sidebarOpen ? 360 : 0, transition: "left 0.35s ease" }}>
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          whenReady={() => setMapReady(true)}
        >
          {/* Dark map tiles (Carto Dark Matter) */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            subdomains="abcd"
            maxZoom={20}
          />

          <MapController
            center={mapCenter}
            onLocationFound={handleLocationFound}
            onMapClick={handleMapClick}
          />

          {/* User location */}
          {userLocation && (
            <>
              <Circle
                center={[userLocation.lat, userLocation.lng]}
                radius={300}
                pathOptions={{ fillColor: "#3b82f6", fillOpacity: 0.07, color: "#3b82f6", weight: 1, opacity: 0.25 }}
              />
              <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                <Popup><div style={{ padding: "12px 16px", color: "#fff" }}><div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>📍 You are here</div><div className="mono" style={{ fontSize: 10.5, color: C.textMuted }}>{userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</div></div></Popup>
              </Marker>
            </>
          )}

          {/* Food markers */}
          {filteredListings.map(item => (
            <Marker
              key={item.id}
              position={[item.location.lat, item.location.lng]}
              icon={makeIcon(getMarkerColor(item.status), item.emoji || "🍱", selectedItem?.id === item.id ? 42 : 36)}
              eventHandlers={{ click: () => handleItemSelect(item) }}
            >
              <Popup maxWidth={240}><PopupContent item={item} /></Popup>
            </Marker>
          ))}

          {/* Selected pickup */}
          {pickupLocation && (
            <Marker position={[pickupLocation.lat, pickupLocation.lng]} icon={makeIcon(C.purple, "📌", 36)}>
              <Popup><div style={{ padding: "12px 16px", color: "#fff" }}><div style={{ fontSize: 13, fontWeight: 600 }}>Selected Pickup Point</div></div></Popup>
            </Marker>
          )}
        </MapContainer>

        {/* ── MAP CONTROLS ── */}
        <div style={{ position: "absolute", top: 20, right: 20, zIndex: 1000, display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Sidebar toggle */}
          <button className={`rq-control-btn${sidebarOpen ? " active" : ""}`} onClick={() => setSidebarOpen(v => !v)} title="Toggle sidebar">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16" />
            </svg>
          </button>

          {/* Zoom in */}
          <button className="rq-control-btn" title="Zoom in">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M12 4v16M4 12h16" />
            </svg>
          </button>

          {/* Zoom out */}
          <button className="rq-control-btn" title="Zoom out">
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" d="M4 12h16" />
            </svg>
          </button>

          {/* Locate me */}
          <button className={`rq-control-btn${isLocating ? " active" : ""}`} onClick={locateMe} title="My location">
            {isLocating ? (
              <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "rq-spin 0.8s linear infinite" }} />
            ) : (
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              </svg>
            )}
          </button>
        </div>

        {/* ── DONOR: Set Pickup CTA ── */}
        {onPickupSelect && (
          <div style={{ position: "absolute", bottom: 28, left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
            <button
              style={{
                background: `linear-gradient(135deg, #2d8a55, #52b788)`,
                color: "#fff", border: "none",
                padding: "14px 32px", borderRadius: 100,
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14.5,
                cursor: "pointer",
                boxShadow: "0 12px 40px rgba(45,138,85,0.5)",
                display: "flex", alignItems: "center", gap: 9,
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="12" cy="12" r="10" /><path d="M12 8v8M8 12h8" strokeLinecap="round" />
              </svg>
              Tap map to set pickup point
            </button>
          </div>
        )}

        {/* ── Legend pill ── */}
        <div style={{
          position: "absolute", bottom: 28, left: 20, zIndex: 1000,
          background: "rgba(8,16,10,0.88)", backdropFilter: "blur(16px)",
          border: "1px solid rgba(82,183,136,0.12)",
          borderRadius: 16, padding: "10px 16px",
          display: "flex", gap: 16, alignItems: "center",
        }}>
          {[
            { color: C.accentLight, label: "Available" },
            { color: C.red,         label: "Urgent" },
            { color: C.blue,        label: "Claimed" },
            { color: "#3b82f6",     label: "You" },
          ].map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: l.color, boxShadow: `0 0 6px ${l.color}88` }} />
              <span className="mono" style={{ fontSize: 10, color: C.textMuted }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── DETAIL PANEL ── */}
      {selectedItem && (
        <div style={{ position: "absolute", bottom: 28, right: sidebarOpen ? 28 : 28, zIndex: 1100 }}>
          <DetailPanel
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onAccept={(item) => console.log("Accepted:", item)}
          />
        </div>
      )}
    </div>
  );
};

export default MapView;