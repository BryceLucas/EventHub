"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  transformTicketmaster,
  type EventMarker,
} from "@/lib/maps/transformEvents";

// Load Leaflet map on CLIENT only — required for Amplify & Next.js SSR
const EventMap = dynamic(() => import("@/components/map/EventMap"), {
  ssr: false,
});

export default function EventsPage() {
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
        setError("Unable to load events at this time.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Events</h1>
      <p>Search and browse events.</p>

      {loading && (
        <div className="text-lg text-yellow-200 font-medium">
          Loading events...
        </div>
      )}

      {error && <div className="text-red-300 font-medium">{error}</div>}

      {!loading && !error && (
        <div className="w-full h-[600px]">
          <EventMap events={events} />
        </div>
      )}
    </main>
  );
}
