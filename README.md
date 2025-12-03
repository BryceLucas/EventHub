# 🌐 EventHub

EventHub is an interactive event discovery platform that helps users:

- Explore events happening near them  
- View event details (date, venue, images, and ticket info)  
- See local weather conditions for the event location  
- Chat with an AI assistant for recommendations  
- View all events on an interactive map with popups and clustering  

EventHub brings events, weather, and AI together into one simple interface.

---

## 🚀 Getting Started

Follow these steps to run EventHub on your device.

### 1️⃣ Install dependencies

```bash
npm install
2️⃣ Start the development server
bash
Copy code
npm run dev
Visit the app at:

http://localhost:3000

🗺️ Map Feature Setup (Required for EventHub to run)
EventHub includes a fully interactive map built using Leaflet.
To enable the map, install these packages:

bash
Copy code
npm install leaflet react-leaflet react-leaflet-cluster
Then ensure Leaflet’s CSS is loaded.

In app/layout.tsx, add:

tsx
Copy code
import "leaflet/dist/leaflet.css";
Once installed, the map will automatically load and show:

Event markers

Popup information

Event images

Cluster grouping for dense areas

🧭 How to Use EventHub
EventHub has several tabs and features to help you find events easily.

📅 Events Page
The Events tab displays a feed of nearby events:

Event name

Date and time

Venue

Preview image

Ticketmaster link

You can scroll through events or filter the list using the search options (if available).

🌤️ Weather Integration
Every event includes a weather snapshot:

Temperature

Weather summary

Icon showing current conditions

Weather is automatically matched to the event’s exact location.

🗺️ Map View
The Map tab shows all events as interactive pins:

Click a marker to see event name, venue, date, and image

Map automatically zooms to include all nearby events

Clustering keeps the map clean when many events are close together

💬 AI Assistant
The Assistant tab connects you with an AI helper that can:

Recommend events

Summarize weather

Suggest planning ideas

Answer general event questions

Just type a message and the assistant will respond instantly.

📦 Project Structure (Simplified for Users)
bash
Copy code
/app            → Pages and routing
/components     → UI components
/components/map → Map, popups, and clustering
/lib            → API helpers and event transformation
/public         → Static assets and images
