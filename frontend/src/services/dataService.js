// Data service providing mock data for the frontend components.
// In a real application these would be replaced with API calls.

// Alerts data for SmartAlerts component
export const getAlerts = () => [
  {
    id: 1,
    type: "urgent",
    icon: "⚠️",
    title: "Food Expiring Soon",
    message: "45 meals of Dal Makhani at Taj Palace will expire in 30 minutes",
    time: "2 min ago",
    location: "Connaught Place, Delhi",
    action: "Notify NGOs",
    color: "#F59E0B",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    id: 2,
    type: "match",
    icon: "🤖",
    title: "AI Match Found",
    message: "Found 3 NGOs within 2km suitable for your Biryani donation (80 meals)",
    time: "5 min ago",
    location: "ITC Grand Chola, Delhi",
    action: "View Matches",
    color: "#10B981",
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.2)",
  },
  {
    id: 3,
    type: "pickup",
    icon: "🚴",
    title: "Pickup Update",
    message: "Volunteer Ramesh is 0.8km away and will arrive in 4 minutes",
    time: "8 min ago",
    location: "Paharganj, Delhi",
    action: "Track Live",
    color: "#2563EB",
    bg: "rgba(37,99,235,0.08)",
    border: "rgba(37,99,235,0.2)",
  },
  {
    id: 4,
    type: "delivery",
    icon: "✅",
    title: "Delivery Confirmed",
    message: "Order #2847 successfully delivered to Akshaya Patra - 45 meals",
    time: "15 min ago",
    location: "Karol Bagh, Delhi",
    action: "View Proof",
    color: "#14B8A6",
    bg: "rgba(20,184,166,0.08)",
    border: "rgba(20,184,166,0.2)",
  },
  {
    id: 5,
    type: "new",
    icon: "🆕",
    title: "New Donation Posted",
    message: "Hyderabadi Biryani Platter - 80 meals available for pickup",
    time: "18 min ago",
    location: "Bangalore South",
    action: "View Details",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.2)",
  },
  {
    id: 6,
    type: "system",
    icon: "⚙️",
    title: "System Alert",
    message: "3 NGOs haven't confirmed pickup within 30min window - auto-escalating",
    time: "22 min ago",
    location: "Mumbai Central",
    action: "Manage",
    color: "#EF4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
  },
];

// Pickup data for VolunteerPickup component
export const getActivePickups = () => [
  {
    id: 1,
    status: "on-the-way",
    volunteer: "Ramesh K.",
    avatar: "RK",
    rating: 4.9,
    rescues: 142,
    foodItem: "Dal Makhani x45",
    donor: "Taj Palace Hotel",
    ngo: "Akshaya Patra",
    pickupLocation: "Connaught Place, Delhi",
    deliveryLocation: "Karol Bagh, Delhi",
    distance: "1.2 km",
    eta: "4 min",
    progress: 65,
    color: "#10B981",
  },
  {
    id: 2,
    status: "arrived",
    volunteer: "Priya S.",
    avatar: "PS",
    rating: 4.7,
    rescues: 118,
    foodItem: "Biryani Platter x80",
    donor: "ITC Grand Chola",
    ngo: "Feeding India",
    pickupLocation: "Chanakyapuri, Delhi",
    deliveryLocation: "Paharganj, Delhi",
    distance: "2.8 km",
    eta: "0 min",
    progress: 85,
    color: "#F59E0B",
  },
  {
    id: 3,
    status: "picking-up",
    volunteer: "Arun M.",
    avatar: "AM",
    rating: 4.5,
    rescues: 97,
    foodItem: "South Indian Thali x60",
    donor: "Marriott Chennai",
    ngo: "Govt. Shelter #42",
    pickupLocation: "Anna Salai, Chennai",
    deliveryLocation: "T. Nagar, Chennai",
    distance: "0.9 km",
    eta: "12 min",
    progress: 45,
    color: "#14B8A6",
  },
];

// Mock orders for OrderTracking component (mirrors data/mockData)
export const getMockOrder = (orderId) => {
  // This mirrors the structure used in the original component.
  // In a real app this would fetch from an API.
  const mockOrders = [
    // Replace with actual mock order objects if needed.
  ];
  const found = mockOrders?.find((o) => o.id === orderId);
  return found || { id: orderId, deliveryAddress: "Your location", items: [] };
};
