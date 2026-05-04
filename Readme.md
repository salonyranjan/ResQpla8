# ResQPlate: Food Waste Reduction & Donation Web App

> **Tech Stack:** MERN (MongoDB, Express, React, Node.js)

## Overview
**ResQPlate** is a real-time web platform designed to bridge the gap between food donors (restaurants, messes, events) and receivers (NGOs, volunteers). By utilizing **Geo-spatial logic**, the app optimizes the logistics of food recovery, ensuring surplus food reaches the needy before it expires.

## Key Features
- **Real-time Geo-Matching:** Donors and NGOs are matched based on GPS location (Haversine Formula).
- **Interactive Map:** View available food donations on a live map (Leaflet/Google Maps).
- **Expiry Management:** Automated system to flag or remove expired food listings.
- **Role-Based Access:** Separate dashboards for Donors, NGOs, and Admins.
- **Analytics:** Admin dashboard to track total food saved and impact created.

---

## Tech Stack
| Component | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Leaflet Maps |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas (Cloud) |
| **Auth** | JSON Web Tokens (JWT) & Bcrypt |
| **Tools** | Postman, VS Code, Git |

---

## Getting Started

### 1. Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB Atlas](https://www.mongodb.com/) Account (for database connection)

### 2. Installation

**Step 1: Clone the Repository**
```bash
git clone [https://github.com/your-username/ResQPlate.git](https://github.com/your-username/ResQPlate.git)
cd ResQPlate