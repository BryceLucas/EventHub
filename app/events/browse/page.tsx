"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import SaveButton from "@/components/SaveButton";

interface EventLike {
  id?: string;
  name?: string;
  title?: string;
  url?: string;

  // normalized fields if backend flattens
  date?: string;
  time?: string;
  location?: string;

  // Ticketmaster-style structure
  dates?: {
    start?: {
      localDate?: string;
      localTime?: string;
      dateTime?: string;
    };
  };
  _embedded?: {
    venues?: {
      name?: string;
      city?: { name?: string };
      state?: { name?: string };
    }[];
  };

  start?: {
    local?: string;
    dateTime?: string;
  };

  [key: string]: any;
}

const DEFAULT_LAT = 42.3314;
const DEFAULT_LNG = -83.0458;
const DEFAULT_RADIUS_KM = 40;

// -----------------------------
// Helpers
// -----------------------------

function toReadableLocalTime(raw: string | undefined): string {
  if (!raw) return "";
  const s = raw.trim();

  // Already human like "8:00 PM"
  if (/am|pm/i.test(s)) return s;

  let d: Date | null = null;

  // ISO datetime (contains "T")
  if (s.includes("T")) {
    const maybe = new Date(s);
    if (!Number.isNaN(maybe.getTime())) d = maybe;
  } else if (s.endsWith("Z") || s.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
    // "HH:MM[:SS]" or "01:00:00Z"
    const iso = s.match(/^\d{2}:\d{2}(:\d{2})?$/) ? `1970-01-01T${s}` : s;
    const maybe = new Date(iso);
    if (!Number.isNaN(maybe.getTime())) d = maybe;
  }

  if (d) {
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    return `${hours}:${minutes} ${ampm}`;
  }

  // fallback simple "HH:MM"
  const basic = s.length >= 5 ? s.slice(0, 5) : s;
  const [hStr, mStr] = basic.split(":");
  const h = parseInt(hStr ?? "", 10);
  if (Number.isNaN(h) || !mStr) return "";

  let hours = h;
  const minutes = mStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;

  return `${hours}:${minutes} ${ampm}`;
}

function toLocalDate(raw: string | undefined): string {
  if (!raw) return "";
  const s = raw.trim();

  // Already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-CA"); // YYYY-MM-DD
}

// -----------------------------
// Component
// -----------------------------
export default function BrowseEventsPage() {
  const [query, setQuery] = useState("");
  const [events, setEvents] = useState<EventLike[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchEvents(searchText: string) {
    try {
      setLoading(true);
      setError(null);

      const body = {
        q: searchText || "Detroit",
        lat: DEFAULT_LAT,
        lng: DEFAULT_LNG,
        radiusKm: DEFAULT_RADIUS_KM,
      };

      // Use SAME endpoint style as the map page (relative URL)
      const res = await fetch("/api/tools/search-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("search-events ERROR:", res.status, text);
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();

      const list: EventLike[] =
        data?.events ??
        data?._embedded?.events ??
        (Array.isArray(data) ? data : []);

      setEvents(list || []);
    } catch (err) {
      console.error(err);
      setError("Sorry, something went wrong while loading events.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents("");
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    fetchEvents(query);
  }

  function formatDate(e: EventLike): string {
    if (e.date) return e.date;
    if (e.dates?.start?.localDate) return e.dates.start.localDate;

    const candidates = [
      e.dates?.start?.dateTime,
      e.start?.local,
      e.start?.dateTime,
      typeof e.start === "string" ? e.start : undefined,
    ];

    for (const c of candidates) {
      const d = toLocalDate(c);
      if (d) return d;
    }

    return "";
  }

  function formatTime(e: EventLike): string {
    if (e.time) {
      const pretty = toReadableLocalTime(e.time);
      if (pretty) return pretty;
    }

    if (e.dates?.start?.localTime) {
      const pretty = toReadableLocalTime(e.dates.start.localTime);
      if (pretty) return pretty;
    }

    const candidates = [
      e.dates?.start?.dateTime,
      e.start?.local,
      e.start?.dateTime,
      typeof e.start === "string" ? e.start : undefined,
    ];

    for (const c of candidates) {
      const pretty = toReadableLocalTime(c);
      if (pretty) return pretty;
    }

    return "";
  }

  function formatLocation(e: EventLike): string {
    if (e.location) return e.location;

    const venue = e._embedded?.venues?.[0];
    if (venue) {
      const city = venue.city?.name;
      const state = venue.state?.name;
      if (city && state) return `${city}, ${state}`;
      if (city) return city;
      if (venue.name) return venue.name;
    }

    if (e.city && e.state) return `${e.city}, ${e.state}`;
    if (e.city) return e.city as string;

    return "";
  }

  const getId = (e: EventLike) => e.id ?? e._id ?? e.eventId ?? "";
  const getName = (e: EventLike) => e.name ?? e.title ?? "Event";

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
            Browse Events
          </h1>
          <p className="text-sm text-zinc-200 max-w-md">
            Search and explore events around Detroit with live details and
            weather.
          </p>
        </header>

        {/* Search Bar */}
        <section className="rounded-3xl border border-white/20 bg-black/40 px-4 py-3 shadow-md backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 md:flex-row md:items-center"
          >
            <label className="flex-1 text-sm font-medium text-zinc-100">
              <span className="mb-1 block">Search</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try 'concert', 'festival', or a neighborhood..."
                className="w-full rounded-full border border-zinc-500 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-100 outline-none focus:border-amber-300 focus:ring-2 focus:ring-pink-400/60"
              />
            </label>

            <button
              type="submit"
              className="rounded-full bg-pink-500 px-6 py-2 text-sm font-semibold text-white shadow-md hover:bg-pink-400 active:scale-[0.98]"
            >
              Search
            </button>
          </form>
        </section>

        {/* Event Listings */}
        <section className="rounded-3xl border border-white/25 bg-black/50 p-4 shadow-xl backdrop-blur-md md:p-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-zinc-50">
              Event Listings
            </h2>
            <div className="flex gap-4 text-xs font-medium text-zinc-200">
              <button className="hover:underline">Filter</button>
              <button className="hover:underline">Sort</button>
            </div>
          </div>

          {loading && (
            <div className="text-zinc-100 text-sm mt-2">Loading events…</div>
          )}

          {error && (
            <div className="mt-2 rounded-xl bg-red-900/70 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="mt-2 text-sm text-zinc-100">
              No events found. Try another search.
            </div>
          )}

          {!error && events.length > 0 && (
            <div className="mt-3 rounded-2xl bg-zinc-900/60 px-3 py-3 shadow-sm border border-zinc-700">
              {/* header row */}
              <div className="grid grid-cols-[2fr,1fr,1fr,1fr,auto,auto] gap-3 border-b border-zinc-700 pb-2 text-xs font-semibold uppercase text-zinc-300">
                <div>Event</div>
                <div className="text-center">Date</div>
                <div className="text-center">Time</div>
                <div className="text-center">Location</div>
                <div className="text-center">Save</div>
                <div className="text-center">Tickets</div>
              </div>

              {/* rows */}
              {events.map((event, index) => {
                const id = getId(event) || String(index);
                const name = getName(event);
                const date = formatDate(event);
                const time = formatTime(event);
                const location = formatLocation(event);

                return (
                  <div
                    key={id}
                    className="grid grid-cols-1 md:grid-cols-[2fr,1fr,1fr,1fr,auto,auto] gap-3 py-3 border-b border-zinc-800 last:border-none"
                  >
                    <Link
                      href={`/events/${id}`}
                      className="font-semibold text-zinc-50 hover:underline"
                    >
                      {name}
                    </Link>

                    <div className="text-center text-zinc-100">
                      {date || "-"}
                    </div>

                    <div className="text-center text-zinc-100">
                      {time || "-"}
                    </div>

                    <div className="text-center text-zinc-100">
                      {location || "-"}
                    </div>

                    <div className="flex justify-center">
                      <SaveButton event={event} />
                    </div>

                    <div className="flex justify-center">
                      {event.url ? (
                        <a
                          href={event.url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-pink-400 px-3 py-1 text-xs font-semibold text-pink-300 hover:bg-pink-400 hover:text-zinc-950"
                        >
                          Tickets
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-400">N/A</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
