"use client";

import React, { useMemo, useState } from "react";
import EventCard from "@/components/EventCard";

interface PlannerPageUIProps {
  items: any[];
}

//  "YYYY-MM-DD"
function dateToKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getEventDateKey(event: any): string | null {
  const staticCandidates: (string | undefined | null)[] = [
    event?.dates?.start?.localDate,
    event?.dates?.start?.dateTime,
    event?.dates?.start?.date,
    event?.start?.localDate,
    event?.start?.local,
    event?.start?.utc,
    event?.start?.dateTime,
    event?.startDateTime,
    event?.start_date,
    event?.date,
    event?.startDate,
    event?.datetime,
    event?.dateTime,
  ];

  const dynamicCandidates: string[] = [];

  const visitObject = (obj: any, depth: number) => {
    if (!obj || typeof obj !== "object" || depth > 1) return;
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "string" && /date|time/i.test(k)) {
        dynamicCandidates.push(v);
      } else if (typeof v === "object" && depth === 0) {
        // only go one level deep to avoid huge recursion
        visitObject(v, depth + 1);
      }
    }
  };

  visitObject(event, 0);

  const allCandidates = [...staticCandidates, ...dynamicCandidates];

  const raw = allCandidates.find(
    (v) => typeof v === "string" && v.trim().length > 0
  );

  if (!raw) {
    // console.debug("No date found for event", event?.name ?? event?.title);
    return null;
  }

  // If it's an ISO-like datetime, keep just the date part first
  const firstPart = raw.includes("T") ? raw.slice(0, 10) : raw.trim();

  // Already looks like YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(firstPart)) return firstPart;

  // Fallback: let Date try to parse it
  const parsed = new Date(firstPart);
  if (isNaN(parsed.getTime())) {
    // console.debug("Could not parse date for event", raw, event);
    return null;
  }
  return dateToKey(parsed);
}

// Build a lookup: { "YYYY-MM-DD": [events...] }
function groupEventsByDate(items: any[]): Record<string, any[]> {
  const map: Record<string, any[]> = {};
  for (const ev of items) {
    const key = getEventDateKey(ev);
    if (!key) continue;
    if (!map[key]) map[key] = [];
    map[key].push(ev);
  }
  return map;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function PlannerPageUI({ items }: PlannerPageUIProps) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDateKey, setSelectedDateKey] = useState<string>(
    dateToKey(today)
  );

  const eventsByDate = useMemo(() => groupEventsByDate(items), [items]);
  const selectedEvents = selectedDateKey
    ? eventsByDate[selectedDateKey] ?? []
    : [];

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build calendar cells (with leading blanks)
  const cells: Array<{
    label: string;
    key?: string;
    isToday?: boolean;
    hasEvents?: boolean;
  }> = [];

  // Empty cells before the 1st
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push({ label: "" });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, month, day);
    const key = dateToKey(dateObj);
    const isToday = key === dateToKey(today);
    const hasEvents = !!eventsByDate[key]?.length;

    cells.push({
      label: String(day),
      key,
      isToday,
      hasEvents,
    });
  }

  function goToPrevMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }

  function goToNextMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }

  const selectedPretty = selectedDateKey
    ? (() => {
        const [y, m, d] = selectedDateKey.split("-").map(Number);
        if (!y || !m || !d) return "";
        return `${monthNames[m - 1]} ${d}, ${y}`;
      })()
    : "";

  const savedDayCount = Object.values(eventsByDate).filter(
    (arr) => arr.length > 0
  ).length;

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      {/* Page header */}
      <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-black">
            Event Planner
          </h1>
          <p className="text-sm text-black/80 max-w-xl">
            View your saved events on the calendar and see what&apos;s coming up
            at a glance.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1.4fr] items-start">
        {/* CALENDAR PANEL */}
        <section className="rounded-3xl border border-[#3b0c2a] bg-[linear-gradient(to-br,#FFCC0D66,#FF194D66)] p-4 md:p-5 shadow-xl">
          {/* Month header */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={goToPrevMonth}
              className="rounded-full border border-black/30 px-3 py-1 text-sm font-medium text-black hover:bg-black/5 active:scale-95"
            >
              ‹ Prev
            </button>
            <div className="text-center">
              <div className="text-lg font-semibold text-black">
                {monthNames[month]} {year}
              </div>
              <div className="text-xs text-black/80">
                {savedDayCount} saved day{savedDayCount === 1 ? "" : "s"}
              </div>
            </div>
            <button
              type="button"
              onClick={goToNextMonth}
              className="rounded-full border border-black/30 px-3 py-1 text-sm font-medium text-black hover:bg-black/5 active:scale-95"
            >
              Next ›
            </button>
          </div>

          {/* Day names */}
          <div className="mb-1 grid grid-cols-7 text-center text-xs font-semibold uppercase tracking-wide text-black">
            {dayNames.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1 text-sm">
            {cells.map((cell, idx) => {
              if (!cell.key) {
                return <div key={`empty-${idx}`} className="h-10 rounded-xl" />;
              }

              const isSelected = cell.key === selectedDateKey;
              const hasEvents = cell.hasEvents;

              return (
                <button
                  key={cell.key}
                  type="button"
                  onClick={() => setSelectedDateKey(cell.key!)}
                  className={[
                    "relative flex h-10 items-center justify-center rounded-xl border text-sm font-medium transition text-black",
                    isSelected
                      ? "border-black bg-black/10"
                      : "border-black/20 bg-white/80 hover:bg-white",
                  ].join(" ")}
                >
                  <span className="z-10">{cell.label}</span>
                  {cell.isToday && (
                    <span className="absolute left-1 top-1 rounded-full bg-black/80 px-1 text-[9px] font-semibold text-white">
                      Today
                    </span>
                  )}
                  {hasEvents && (
                    <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-[#FF194D]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected date + events summary */}
          <div className="mt-5 rounded-2xl border border-black/20 bg-white/80 px-3 py-3">
            <div className="mb-2 text-sm font-semibold text-black">
              {selectedPretty || "Select a date"}
            </div>
            {selectedEvents.length === 0 ? (
              <p className="text-xs text-black/80">
                No saved events on this day.
              </p>
            ) : (
              <ul className="space-y-1 text-xs text-black/90">
                {selectedEvents.map((ev, i) => (
                  <li key={ev.id ?? i} className="flex items-center gap-2">
                    <span className="inline-block h-2 w-2 rounded-full bg-[#FF194D]" />
                    <span className="font-semibold">
                      {ev?.name ?? ev?.title ?? "Event"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* SAVED EVENTS + DETAILS */}
        <section className="space-y-4">
          {/* Saved events list */}
          <div className="rounded-3xl border border-[#3b0c2a] bg-[linear-gradient(to-br,#FFCC0D66,#FF194D66)] p-4 shadow-xl">
            <h2 className="mb-3 text-lg font-semibold tracking-tight text-black">
              Saved Events
            </h2>
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="rounded-2xl border border-black/15 bg-white/80 px-3 py-3 text-sm text-black/80">
                  You don&apos;t have any saved events yet. Go to{" "}
                  <span className="font-semibold">Browse Events</span> and click
                  the <span className="font-semibold">Save</span> button to add
                  events to your planner.
                </div>
              ) : (
                items.map((e, i) => <EventCard key={e.id ?? i} event={e} />)
              )}
            </div>
          </div>

          {/* Event details for selected day */}
          <div className="rounded-3xl border border-[#3b0c2a] bg-[linear-gradient(to-br,#FFCC0D66,#FF194D66)] p-4 shadow-xl">
            <h2 className="mb-2 text-lg font-semibold tracking-tight text-black">
              Event Details
            </h2>
            {selectedEvents.length === 0 ? (
              <p className="text-sm text-black/85">
                Select a highlighted date in the calendar to see details for
                saved events on that day.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedEvents.map((ev, i) => {
                  const rawDate =
                    ev?.dates?.start?.localDate ??
                    ev?.dates?.start?.dateTime ??
                    ev?.date ??
                    ev?.startDate ??
                    "";
                  const time =
                    ev?.dates?.start?.localTime ??
                    ev?.time ??
                    ev?.startTime ??
                    "";
                  const venue =
                    ev?._embedded?.venues?.[0]?.name ??
                    ev?.venue?.name ??
                    ev?.venueName ??
                    "";

                  return (
                    <div
                      key={ev.id ?? `detail-${i}`}
                      className="rounded-2xl border border-black/15 bg-white/80 px-3 py-2 text-sm text-black"
                    >
                      <div className="font-semibold">
                        {ev?.name ?? ev?.title ?? "Event"}
                      </div>
                      <div className="text-xs text-black/80">
                        {rawDate && <span>{rawDate.slice(0, 10)}</span>}
                        {time && ` • ${time}`}
                        {venue && ` • ${venue}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
