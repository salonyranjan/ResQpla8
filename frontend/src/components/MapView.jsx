import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  HiOutlineLocationMarker,
  HiOutlineSearch,
  HiOutlinePlus,
} from "react-icons/hi";
import { foodListings } from "../data/mockData";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Default center (Delhi)
const DEFAULT_CENTER = [28.6139, 77.2090];
const DEFAULT_ZOOM = 13;

// Custom icons
const createIcon = (color) =>
  L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color:${color}; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 2px 8px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" style="color:white; width:18px; height:18px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

const pickupIcon = createIcon("#10b981"); // green
const dropoffIcon = createIcon("#3b82f6"); // blue

// Component to handle map events and location
const MapController = ({ onLocationFound }) => {
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: DEFAULT_ZOOM });
  }, [map]);

  useMapEvents({
    locationfound(e) {
      onLocationFound && onLocationFound(e.latlng);
    },
  });

  return null;
};

const MapView = ({ selectedPickup, onPickupSelect }) => {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [userLocation, setUserLocation] = useState(null);
  const [pickupLocation, setPickupLocation] = useState(
    selectedPickup?.location || null
  );
  const [searchText, setSearchText] = useState("");

  const handleLocationFound = (latlng) => {
    setUserLocation(latlng);
    setCenter([latlng.lat, latlng.lng]);
  };

  const handleMapClick = (e) => {
    if (onPickupSelect) {
      setPickupLocation(e.latlng);
      onPickupSelect(e.latlng);
    }
  };

  return (
    <div className="relative h-screen w-full">
      {/* Search overlay */}
      <div className="absolute top-0 left-0 right-0 z-[1000] p-4 pt-6 bg-gradient-to-b from-black/50 to-transparent">
        <div className="relative">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search location..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Map */}
      <MapContainer
        center={center}
        zoom={DEFAULT_ZOOM}
        className="h-full w-full"
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController onLocationFound={handleLocationFound} />

        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createIcon("#ef4444")}
          >
            <Popup>Your location</Popup>
          </Marker>
        )}

        {/* Food pickup markers */}
        {foodListings.map((item) => (
          <Marker
            key={item.id}
            position={[item.location.lat, item.location.lng]}
            icon={pickupIcon}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-sm">{item.name}</h3>
                <p className="text-xs text-gray-500">{item.restaurant}</p>
                <p className="text-xs text-green-600 font-medium mt-1">
                  {item.quantity}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Selected pickup marker */}
        {pickupLocation && (
          <Marker
            position={[pickupLocation.lat, pickupLocation.lng]}
            icon={dropoffIcon}
          >
            <Popup>Selected pickup location</Popup>
          </Marker>
        )}
      </MapContainer>

      {/* Current location button */}
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
              const latlng = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              };
              setCenter([latlng.lat, latlng.lng]);
            });
          }
        }}
        className="absolute bottom-24 right-4 z-[1000] bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition"
      >
        <HiOutlineLocationMarker className="text-green-600 text-2xl" />
      </button>

      {/* Add pickup button (for donors) */}
      {onPickupSelect && (
        <div className="absolute bottom-24 left-4 right-16 z-[1000]">
          <button className="w-full bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
            <HiOutlinePlus /> Set Pickup Location
          </button>
        </div>
      )}
    </div>
  );
};

export default MapView;
