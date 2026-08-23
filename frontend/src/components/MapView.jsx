import { useCallback, useEffect, useMemo, useState } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "../context/ThemeContext";
import { listAvailableFood, subscribeToPickupChanges } from "../services/foodService";

const DEFAULT_CENTER = [28.6139, 77.209];

const foodMarker = L.divIcon({
  className: "rq-map-marker-shell",
  html: '<span class="rq-map-marker">●</span>',
  iconSize: [34, 42],
  iconAnchor: [17, 40],
  popupAnchor: [0, -38],
});

const userMarker = L.divIcon({
  className: "rq-map-user-shell",
  html: '<span class="rq-map-user-dot"></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function MapActions({ locateRequest, userPosition, selectedPosition, onMapSelect }) {
  const map = useMap();
  useMapEvents({
    click(event) {
      if (onMapSelect) onMapSelect({ lat: event.latlng.lat, lng: event.latlng.lng });
    },
  });

  useEffect(() => {
    if (locateRequest && userPosition) map.flyTo(userPosition, 15, { duration: 0.8 });
  }, [locateRequest, userPosition, map]);

  useEffect(() => {
    if (selectedPosition) map.flyTo(selectedPosition, 15, { duration: 0.7 });
  }, [selectedPosition, map]);

  return null;
}

function coordinatesFor(item) {
  const latitude = Number(item.latitude ?? item.lat);
  const longitude = Number(item.longitude ?? item.lng);
  return Number.isFinite(latitude) && Number.isFinite(longitude) ? [latitude, longitude] : null;
}

export default function MapView({ selectedPickup, onPickupSelect }) {
  const { dark } = useTheme();
  const [listings, setListings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selected, setSelected] = useState(selectedPickup || null);
  const [userPosition, setUserPosition] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locateRequest, setLocateRequest] = useState(0);

  const loadListings = useCallback(async () => {
    try {
      setListings(await listAvailableFood(200));
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Map listings could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
    const unsubscribe = subscribeToPickupChanges(loadListings);
    return () => unsubscribe?.();
  }, [loadListings]);

  const mappedListings = useMemo(
    () => listings.map((item) => ({ ...item, coordinates: coordinatesFor(item) })).filter((item) => item.coordinates),
    [listings],
  );
  const filteredListings = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return mappedListings;
    return mappedListings.filter((item) => [item.name, item.foodType, item.pickupLocation].some((value) => value?.toLowerCase().includes(term)));
  }, [mappedListings, search]);

  const locateUser = () => {
    if (!navigator.geolocation) {
      setError("Location services are not supported by this browser.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserPosition([coords.latitude, coords.longitude]);
        setLocateRequest((value) => value + 1);
        setLocating(false);
      },
      () => {
        setError("Your location could not be accessed. Check browser permission and try again.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  };

  const chooseListing = (item) => {
    setSelected(item);
    if (window.innerWidth < 760) setSidebarOpen(false);
  };

  const selectedPosition = selected ? coordinatesFor(selected) : null;
  const missingCoordinates = Math.max(0, listings.length - mappedListings.length);

  return (
    <main className={`rq-professional-map ${dark ? "dark" : "light"}`}>
      <style>{`
        .rq-professional-map { --panel:#fff; --text:#17251c; --muted:#66776c; --line:rgba(19,74,39,.13); --soft:#f4f8f5; position:relative; height:calc(100dvh - 72px); margin-top:72px; overflow:hidden; background:#e8efe9; color:var(--text); font-family:Inter,system-ui,sans-serif; }
        .rq-professional-map.dark { --panel:#0c1710; --text:#edf7f0; --muted:#8ba092; --line:rgba(82,183,136,.14); --soft:#111f16; background:#09130d; }
        .rq-map-panel { position:absolute; z-index:600; top:16px; bottom:16px; left:16px; width:340px; display:flex; flex-direction:column; overflow:hidden; border:1px solid var(--line); border-radius:18px; background:color-mix(in srgb,var(--panel) 96%,transparent); box-shadow:0 18px 55px rgba(6,35,17,.16); backdrop-filter:blur(16px); }
        .rq-map-panel-head { padding:20px; border-bottom:1px solid var(--line); }
        .rq-map-heading { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
        .rq-map-heading h1 { margin:0; font-size:20px; letter-spacing:-.025em; }
        .rq-map-heading p { margin:5px 0 0; color:var(--muted); font-size:12px; line-height:1.5; }
        .rq-map-search { width:100%; margin-top:16px; padding:11px 12px; border:1px solid var(--line); border-radius:10px; outline:none; background:var(--soft); color:var(--text); font:inherit; }
        .rq-map-search:focus { border-color:#36a269; box-shadow:0 0 0 3px rgba(54,162,105,.12); }
        .rq-map-list { flex:1; overflow:auto; padding:8px; }
        .rq-map-card { width:100%; padding:13px; display:flex; justify-content:space-between; gap:12px; border:0; border-radius:11px; background:transparent; color:var(--text); text-align:left; cursor:pointer; }
        .rq-map-card:hover,.rq-map-card.active { background:var(--soft); }
        .rq-map-card strong { display:block; font-size:13px; }
        .rq-map-card span { display:block; margin-top:4px; color:var(--muted); font-size:11px; }
        .rq-map-empty { padding:30px 18px; text-align:center; color:var(--muted); font-size:13px; line-height:1.65; }
        .rq-map-tools { position:absolute; z-index:650; top:16px; right:16px; display:flex; flex-direction:column; gap:8px; }
        .rq-map-tool { min-width:44px; height:44px; padding:0 12px; border:1px solid var(--line); border-radius:12px; background:var(--panel); color:var(--text); box-shadow:0 8px 24px rgba(6,35,17,.12); cursor:pointer; font-weight:700; }
        .rq-map-tool:hover { border-color:#36a269; }
        .rq-professional-map .leaflet-container { height:100%; width:100%; background:inherit; }
        .rq-map-marker-shell,.rq-map-user-shell { background:transparent; border:0; }
        .rq-map-marker { width:34px; height:34px; display:grid; place-items:center; border:3px solid #fff; border-radius:50% 50% 50% 10%; transform:rotate(-45deg); background:#278653; color:#95d5b2; box-shadow:0 7px 18px rgba(22,94,51,.35); }
        .rq-map-marker::first-letter { transform:rotate(45deg); }
        .rq-map-user-dot { display:block; width:18px; height:18px; border:4px solid #fff; border-radius:50%; background:#2563eb; box-shadow:0 0 0 8px rgba(37,99,235,.18); }
        .rq-professional-map .leaflet-popup-content-wrapper { border-radius:13px; box-shadow:0 15px 45px rgba(0,0,0,.18); }
        .rq-professional-map .leaflet-popup-content { margin:14px 16px; }
        @media(max-width:760px){ .rq-map-panel { top:12px; bottom:12px; left:12px; width:min(330px,calc(100% - 72px)); transform:translateX(-115%); transition:transform .25s; } .rq-map-panel.open { transform:translateX(0); } .rq-map-tools{top:12px;right:12px;} }
      `}</style>

      <aside className={`rq-map-panel ${sidebarOpen ? "open" : ""}`} aria-label="Mapped food listings">
        <div className="rq-map-panel-head">
          <div className="rq-map-heading"><div><h1>Food rescue map</h1><p>Pending donations with saved coordinates</p></div><strong>{mappedListings.length}</strong></div>
          <input className="rq-map-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search mapped listings" aria-label="Search mapped listings" />
        </div>
        <div className="rq-map-list">
          {loading ? <div className="rq-map-empty">Loading map listings…</div> : error ? <div className="rq-map-empty" role="alert">{error}</div> : filteredListings.length ? filteredListings.map((item) => (
            <button key={item.$id} className={`rq-map-card ${selected?.$id === item.$id ? "active" : ""}`} onClick={() => chooseListing(item)}>
              <div><strong>{item.name}</strong><span>{item.pickupLocation}</span></div><div style={{ color: "#36a269", fontSize: 12, whiteSpace: "nowrap" }}>{item.mealsCount || 0} meals</div>
            </button>
          )) : <div className="rq-map-empty">No mapped donations are available.{missingCoordinates > 0 && ` ${missingCoordinates} current listing${missingCoordinates === 1 ? " is" : "s are"} hidden because coordinates were not saved.`}</div>}
        </div>
      </aside>

      <div className="rq-map-tools">
        <button className="rq-map-tool" onClick={() => setSidebarOpen((value) => !value)} aria-label={sidebarOpen ? "Hide listings" : "Show listings"}>{sidebarOpen ? "Hide" : "Listings"}</button>
        <button className="rq-map-tool" onClick={locateUser} disabled={locating}>{locating ? "…" : "Locate"}</button>
      </div>

      <MapContainer center={DEFAULT_CENTER} zoom={12} zoomControl>
        <TileLayer key={dark ? "dark" : "light"} url={dark ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"} attribution='&copy; OpenStreetMap contributors &copy; CARTO' subdomains="abcd" maxZoom={20} />
        <MapActions locateRequest={locateRequest} userPosition={userPosition} selectedPosition={selectedPosition} onMapSelect={onPickupSelect} />
        {userPosition && <><Circle center={userPosition} radius={250} pathOptions={{ color: "#2563eb", fillColor: "#2563eb", fillOpacity: .08, weight: 1 }} /><Marker position={userPosition} icon={userMarker}><Popup>Your current location</Popup></Marker></>}
        {filteredListings.map((item) => <Marker key={item.$id} position={item.coordinates} icon={foodMarker} eventHandlers={{ click: () => setSelected(item) }}><Popup><strong>{item.name}</strong><div style={{ marginTop: 5 }}>{item.mealsCount || 0} meals</div><div style={{ marginTop: 3 }}>{item.pickupLocation}</div></Popup></Marker>)}
      </MapContainer>
    </main>
  );
}
