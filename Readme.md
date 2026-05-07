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

### 🎨 Cinematic UX
* **3D Visuals:** Integrated **Three.js** and **GSAP** for a high-end, smooth user experience.
* **Responsive Design:** Fully optimized for mobile and desktop donors.

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
2.  **AI Layer:** An agentic workflow that processes user text and images via Gemini 1.5 Flash.
3.  **Data Layer:** Appwrite handles real-time updates for food pickup status and NGO availability.

---
