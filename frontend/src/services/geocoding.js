const GEOCODER_ENDPOINT = import.meta.env.VITE_GEOCODER_ENDPOINT?.trim() || "https://nominatim.openstreetmap.org/search";
const CACHE_KEY = "resqplate-geocoded-addresses-v2";
let requestQueue = Promise.resolve();

function readCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

export function geocodeAddress(address) {
  const normalized = address?.trim();
  if (!normalized) return Promise.resolve(null);
  const key = normalized.toLowerCase();
  const cached = readCache();
  if (Object.hasOwn(cached, key)) return Promise.resolve(cached[key]);

  const request = requestQueue.then(async () => {
    const params = new URLSearchParams({ q: normalized, format: "jsonv2", limit: "1" });
    try {
      const response = await fetch(`${GEOCODER_ENDPOINT}?${params}`);
      if (!response.ok) throw new Error(`Geocoder returned ${response.status}`);
      const [match] = await response.json();
      const coordinates = match && Number.isFinite(Number(match.lat)) && Number.isFinite(Number(match.lon))
        ? [Number(match.lat), Number(match.lon)]
        : null;
      // Cache successful lookups only. A temporary network/provider miss must
      // not permanently hide a donation from Map View.
      if (coordinates) localStorage.setItem(CACHE_KEY, JSON.stringify({ ...readCache(), [key]: coordinates }));
      return coordinates;
    } finally {
      await new Promise((resolve) => window.setTimeout(resolve, 1100));
    }
  });
  requestQueue = request.catch(() => null);
  return request;
}
