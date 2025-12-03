"use client";

import { useEffect, useState } from "react";
import EventMap from "@/components/map/EventMap";
import {
  transformTicketmaster,type EventMarker,} from "@/lib/maps/transformEvents";


export default function EventsPage() {
  const [events, setEvents] = useState<EventMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvents() {
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
      } catch (err: any) {
        console.error(err);
        setError("Unable to load events at this time.");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <main className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Events</h1>
        <p>Search and browse events.</p>
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading map and events…</p>}

      {/* Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Map */}
      {!loading && !error && (
        <div className="w-full h-[600px]">
          <EventMap events={events} />
        </div>
      )}
    </main>
  );
}
