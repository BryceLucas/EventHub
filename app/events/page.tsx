"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  transformTicketmaster,
  type EventMarker,
} from "@/lib/maps/transformEvents";

// Load Leaflet map only on the client — SSR must stay off
const EventMap = dynamic(() => import("@/components/map/EventMap"), {
  ssr: false,
});

export default function MapPage() {
  const [events, setEvents] = useState<EventMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/api/tools/search-events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: "Detroit",
            lat: 42.3314,
            lng: -83.0458,
            radiusKm: 40,
          }),
        });

        if (!res.ok) throw new Error("Failed to fetch events");

        const data = await res.json();
        const markers = transformTicketmaster(data);
        setEvents(markers);
      } catch (err) {
        console.error(err);
        setError("Unable to load map data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Map</h1>
      <p>Explore events using the interactive map.</p>

      {loading && <div className="text-yellow-200 text-lg">Loading map...</div>}

      {error && <div className="text-red-300">{error}</div>}

      {!loading && !error && (
        <div className="w-full h-[700px]">
          <EventMap events={events} />
        </div>
      )}
    </main>
  );
}
