# 🥗 ResQPlate: AI-Driven Food Rescue Ecosystem

**ResQPlate** is a smart food redistribution platform designed to bridge the gap between surplus food donors (restaurants, households, event planners) and NGOs in **Patna, Bihar**. By leveraging **Generative AI** and **Real-time Logistics**, we aim to minimize food waste and combat hunger.

---

## 🚀 Key Features

### 🤖 ResQBot (AI Coordinator)
A botanical-themed, floating chatbot built with **Gemini 2.5 Flash**.
* **Smart Matching:** Automatically matches donors to the nearest NGO based on food type and storage facilities (e.g., matching Biryani with NGOs that have refrigeration).
* **Multimodal Vision:** Upload a photo of food, and the AI identifies ingredients, estimated shelf-life, and safety guidelines.

### 📍 Intelligent Logistics
* **NGO Directory:** A curated list of verified NGOs in Locations with specific requirements.
* **Real-time Tracking:** Seamless donation lifecycle management using **Appwrite** as a backend.
## 🚀 Key Features

### 🌿 AI-Powered Impact Storyteller
- **Botanical Narrative Engine:** Uses **Gemini 2.5 Flash** to transform raw donation data into metaphor-rich, "botanical" impact stories.
- **Dynamic Eco-Ranking:** Automatically assigns prestigious ranks based on $CO_2$ offset and meals rescued.
- **Visual Growth Cards:** Generates shareable, high-resolution PNG impact cards using `html-to-image` for social sharing.

### 🍱 Smart Donation Management (Appwrite + AI)
- **AI Smart Matching:** An agentic workflow that matches surplus food with the most relevant NGOs based on location and urgency.
- **Real-time Logistics:** Tracks the lifecycle of a donation from "Pending" to "Delivered" using Appwrite's real-time database capabilities.
- **Batching Algorithm:** Optimizes pickup routes to reduce fuel consumption and maximize the freshness of delivered food.

### 📱 Premium Glassmorphic Dashboard
- **Live Impact Telemetry:** Features a high-performance dashboard with spring-animated counters and floating particle effects (`framer-motion`).
- **One-Tap Quick Rescue:** A simplified modal-based flow for rapid donations, integrated directly into the donor command center.
- **Role-Based Access (RBAC):** Distinct specialized interfaces for **Donors**, **NGOs**, and **Logistics Drivers**.

### 🌍 Social & Environmental Impact
- **$CO_2$ Offset Tracking:** Automatically calculates environmental savings ($0.5\text{kg } CO_2$ per meal rescued).
- **Geospatial Intelligence:** Location-aware indexing to connect local donors in areas like Patna to nearby food banks.
- **Zero-Waste Vision:** A full ERP-style platform designed to bridge the gap between surplus and scarcity.
---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Framer Motion
* **3D Engine:** Three.js, GSAP (for smooth transitions)
* **Artificial Intelligence:** Google Gemini API (Multimodal & RAG)
* **Backend as a Service:** Appwrite (Database, Auth, and Storage)
* **Deployment:** Vercel / AWS EC2

---

## 🏗️ System Architecture

1.  **User Interface:** React components styled with botanical aesthetics.
2.  **AI Layer:** An agentic workflow that processes user text and images via Gemini 2.5 Flash.
3.  **Data Layer:** Appwrite handles real-time updates for food pickup status and NGO availability.

---
