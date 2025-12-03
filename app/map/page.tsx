"use client";

import { useEffect, useState } from "react";
import EventMap from "@/components/map/EventMap";
import { transformTicketmaster } from "@/lib/maps/transformEvents";
import type { EventMarker } from "@/lib/maps/transformEvents";

export default function MapPage() {
  const [events, setEvents] = useState<EventMarker[]>([]);
  const [savedEvents, setSavedEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load saved events from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedEvents");
      if (raw) {
        const parsed = JSON.parse(raw);

        const mapped = parsed
          .filter((e: any) => e?.venue?.lat && e?.venue?.lng)
          .map((e: any) => ({
            id: e.id,
            title: e.name || e.title,
            lat: Number(e.venue.lat),
            lng: Number(e.venue.lng),
            venue: e.venue?.name || "",
            date: e.dates?.start || "",
            image: e.image || "",
            url: e.url || "",
            isSaved: true,
          }));

        setSavedEvents(mapped);
      }
    } catch (err) {
      console.error("Failed to load saved events:", err);
    }
  }, []);

  // Load Ticketmaster events
  useEffect(() => {
    async function loadEvents() {
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

        if (!res.ok) {
          setError("Event API error.");
          return;
        }

        const data = await res.json();
        const markers = transformTicketmaster(data);

        setEvents(markers);
      } catch (err) {
        setError("Network error loading events.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Map</h1>
      <p className="mb-4">Explore events using the interactive map.</p>

      {loading && <p>Loading events…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <EventMap events={events} savedEvents={savedEvents} />
    </main>
  );
}
