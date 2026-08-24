const ROUTING_ENDPOINT = import.meta.env.VITE_ROUTING_ENDPOINT?.trim() || "https://router.project-osrm.org";

const haversineKm = ([lat1, lon1], [lat2, lon2]) => {
  const radians = (degrees) => degrees * Math.PI / 180;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export async function getShortestPickupRoute(receiverPosition, donationPosition, signal, allowFallback = true) {
  const [receiverLat, receiverLng] = receiverPosition;
  const [donationLat, donationLng] = donationPosition;
  const coordinates = `${receiverLng},${receiverLat};${donationLng},${donationLat}`;
  const params = new URLSearchParams({ alternatives: "3", steps: "false", geometries: "geojson", overview: "full" });

  try {
    const response = await fetch(`${ROUTING_ENDPOINT}/route/v1/driving/${coordinates}?${params}`, { signal });
    if (!response.ok) throw new Error(`Routing service returned ${response.status}`);
    const payload = await response.json();
    if (payload.code !== "Ok" || !payload.routes?.length) throw new Error(payload.code || "No road route found");
    const shortest = [...payload.routes].sort((a, b) => a.distance - b.distance)[0];
    return {
      source: "road",
      distanceKm: shortest.distance / 1000,
      durationMinutes: Math.max(1, Math.round(shortest.duration / 60)),
      positions: shortest.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    };
  } catch (error) {
    if (error.name === "AbortError") throw error;
    if (!allowFallback) throw new Error("A verified road route is not available for these addresses.");
    return {
      source: "straight-line",
      distanceKm: haversineKm(receiverPosition, donationPosition),
      durationMinutes: null,
      positions: [receiverPosition, donationPosition],
    };
  }
}
