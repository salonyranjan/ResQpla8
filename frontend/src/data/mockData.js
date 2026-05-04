// Mock data for food listings and orders

export const foodListings = [
  {
    id: 1,
    name: "Fresh Bread Assortment",
    category: "Bakery",
    quantity: "15 loaves",
    distance: "1.2 km",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=200&fit=crop",
    restaurant: "Golden Bakery",
    description: "Assorted fresh bread including whole wheat, multigrain, and sourdough.",
    expiresIn: "3 hours",
    location: { lat: 28.6139, lng: 77.2090 }
  },
  {
    id: 2,
    name: "Vegetable Curry (Surplus)",
    category: "Surplus Food",
    quantity: "Serves 20",
    distance: "0.8 km",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop",
    restaurant: "Spice Garden",
    description: "Freshly prepared mixed vegetable curry, enough for 20 people.",
    expiresIn: "2 hours",
    location: { lat: 28.6129, lng: 77.2100 }
  },
  {
    id: 3,
    name: "Fresh Produce Box",
    category: "Fresh Produce",
    quantity: "30 kg",
    distance: "2.5 km",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1566385101042-1a0aa0c12681?w=300&h=200&fit=crop",
    restaurant: "Green Farms",
    description: "Assorted fresh vegetables: carrots, tomatoes, cucumbers, spinach.",
    expiresIn: "5 hours",
    location: { lat: 28.6155, lng: 77.2080 }
  },
  {
    id: 4,
    name: "Pasta & Sauce Combo",
    category: "Surplus Food",
    quantity: "Serves 12",
    distance: "1.8 km",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop",
    restaurant: "Italian Bistro",
    description: "Fresh pasta with tomato basil sauce, enough for 12 people.",
    expiresIn: "4 hours",
    location: { lat: 28.6145, lng: 77.2110 }
  },
  {
    id: 5,
    name: "Fruit Basket",
    category: "Fresh Produce",
    quantity: "20 baskets",
    distance: "3.1 km",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=300&h=200&fit=crop",
    restaurant: "Orchard Fresh",
    description: "Seasonal fruits: apples, oranges, bananas, and grapes.",
    expiresIn: "6 hours",
    location: { lat: 28.6130, lng: 77.2120 }
  },
  {
    id: 6,
    name: "Pastry Platter",
    category: "Bakery",
    quantity: "24 pieces",
    distance: "0.5 km",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=300&h=200&fit=crop",
    restaurant: "Sweet Tooth",
    description: "Assorted pastries: croissants, danishes, and muffins.",
    expiresIn: "2 hours",
    location: { lat: 28.6150, lng: 77.2095 }
  },
  {
    id: 7,
    name: "Rice & Lentils (Surplus)",
    category: "Surplus Food",
    quantity: "Serves 50",
    distance: "4.0 km",
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1536304929831-ee1ca9d44f06?w=300&h=200&fit=crop",
    restaurant: "Annapurna Kitchen",
    description: "Cooked rice and lentil curry, enough for large gatherings.",
    expiresIn: "3 hours",
    location: { lat: 28.6110, lng: 77.2070 }
  },
  {
    id: 8,
    name: "Dairy & Cheese Box",
    category: "Fresh Produce",
    quantity: "10 kg",
    distance: "2.2 km",
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1550583724-b269d3f7aaj6?w=300&h=200&fit=crop",
    restaurant: "Dairy Delight",
    description: "Assorted cheeses, yogurt, and milk packets.",
    expiresIn: "4 hours",
    location: { lat: 28.6160, lng: 77.2105 }
  }
];

export const categories = [
  "All",
  "Surplus Food",
  "Fresh Produce",
  "Bakery",
  "Dairy"
];

export const mockOrders = [
  {
    id: "ORD-001",
    items: [foodListings[0], foodListings[2]],
    status: "out_for_delivery",
    statusHistory: [
      { status: "order_placed", time: "2026-05-04T10:00:00Z" },
      { status: "confirmed", time: "2026-05-04T10:05:00Z" },
      { status: "preparing", time: "2026-05-04T10:15:00Z" },
      { status: "out_for_delivery", time: "2026-05-04T10:45:00Z" }
    ],
    deliveryAddress: "123 Main St, Delhi",
    total: 0, // free for donations
    createdAt: "2026-05-04T10:00:00Z"
  }
];

export const currentUser = {
  name: "Salony Ranjan",
  email: "salony@example.com",
  phone: "+91 9876543210",
  role: "donor",
  avatar: "https://i.pravatar.cc/150?img=32"
};
