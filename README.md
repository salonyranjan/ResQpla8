# 🥗 ResQPlate: AI-Driven Food Rescue Ecosystem

**ResQPlate** is a high-performance, smart food redistribution platform designed to bridge the gap between surplus food donors (restaurants, households, event planners) and NGOs in **Patna, Bihar**. By leveraging **Groq's LPU™ Inference Engine** and **Appwrite's Real-time Backend**, we minimize food waste and combat hunger with sub-second intelligence.

---

## 🚀 Key Features

### 🌿 AI-Powered Impact Storyteller
- **Botanical Narrative Engine:** Uses **Groq (Llama 3.1)** to transform raw donation data into metaphor-rich, "botanical" impact stories.
- **Dynamic Eco-Ranking:** Automatically assigns prestigious ranks based on $CO_2$ offset and meals rescued.
- **Visual Growth Cards:** Generates shareable, high-resolution PNG impact cards using `html-to-image` for social sharing.

### 🤖 ResQBot (Intelligence Coordinator)
- **High-Speed Interaction:** Powered by **Groq (Llama-3.1-8b-instant)** for near-instant responses to donor and NGO inquiries.
- **Smart Matching:** An agentic workflow that matches surplus food with the most relevant NGOs based on location and storage facilities.
- **Multimodal Support:** Integrated fallback to **Gemini 1.5/2.5** for vision-based food quality analysis and shelf-life estimation.

### 🍱 Smart Donation Management (Appwrite + AI)
- **Real-time Logistics:** Tracks the lifecycle of a donation from "Pending" to "Delivered" using Appwrite's real-time subscription capabilities.
- **Batching Algorithm:** Optimizes pickup routes in Patna to reduce fuel consumption and maximize food freshness.
- **Post in 60 Seconds:** A rapid-action, 3-step donation flow designed to minimize user friction.

### 📱 Premium Glassmorphic Dashboard
- **Live Impact Telemetry:** High-performance dashboard with spring-animated counters and floating botanical particles (`framer-motion`).
- **Role-Based Access (RBAC):** Specialized, secure interfaces for **Donors**, **NGOs**, and **Logistics Drivers**.
- **Responsive Design:** Optimized for a seamless experience on laptops and mobile devices.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Tailwind CSS, Framer Motion
* **3D Engine:** Three.js, GSAP (for cinematic transitions and 3D portfolio elements)
* **Artificial Intelligence:** * **Groq (Primary):** Llama-3.1-8b-instant for rapid-fire chat and text generation.
    * **Google Gemini (Vision):** Multimodal analysis for food imagery.
* **Backend as a Service:** Appwrite (Real-time Database, Auth, and Cloud Storage)
* **Deployment:** Vercel / AWS EC2

---

## 🏗️ System Architecture

1.  **User Interface:** React components styled with premium glassmorphism and botanical aesthetics.
2.  **Resilient AI Layer:** A hybrid provider architecture. The system prioritizes **Groq** for high-speed logic and switches to **Gemini** for vision-intensive tasks.
3.  **Data Layer:** **Appwrite** acts as the central command center, handling real-time synchronization between donors and NGOs.

---

## 🌍 Environmental Impact Logic

ResQPlate calculates real-world environmental savings for every donation:
* **$CO_2$ Offset:** Calculated at $0.5\text{kg } CO_2$ per meal rescued.
* **Water Savings:** Estimated based on the embedded water footprint of the food type (Veg/Non-Veg).
* **Waste Diversion:** Real-time tracking of kilograms diverted from landfills to plate.

---

