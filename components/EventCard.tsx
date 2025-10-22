"use client";

import Link from "next/link";
import SaveButton from "./SaveButton";

export default function EventCard({ event }: { event: any }) {
  // Defensive extraction against multiple API shapes
  const id = event?.id ?? event?._id ?? event?.eventId ?? event?.uuid ?? null;

  const title = event?.name ?? event?.title ?? "Event";

  const img =
    event?.images?.[0]?.url ??
    event?.image?.url ??
    event?.image ??
    event?.poster ??
    "/file.svg";

  const venue =
    event?._embedded?.venues?.[0]?.name ??
    event?.venue?.name ??
    event?.venueName ??
    "";

  const city =
    event?._embedded?.venues?.[0]?.city?.name ??
    event?.venue?.city ??
    event?.city ??
    "";

  const date =
    event?.dates?.start?.localDate ?? event?.date ?? event?.startDate ?? "";

  const href = id ? `/events/${encodeURIComponent(id)}` : event?.url ?? "#";

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3">
      <Link href={href} className="block group">
        <div className="relative mb-3 overflow-hidden rounded-xl border border-zinc-800">
          <img
            src={img}
            alt=""
            className="h-40 w-full object-cover transition-transform group-hover:scale-[1.02]"
          />
        </div>
        <h3 className="line-clamp-2 text-sm font-medium">{title}</h3>
        <div className="mt-1 text-xs text-zinc-400">
          {date && <span>{date}</span>}
          {venue && (date ? " • " : "")}
          {venue}
          {city && ` • ${city}`}
        </div>
      </Link>

      <div className="mt-3 flex items-center justify-between">
        {event?.url ? (
          <a
            href={event.url}
            target="_blank"
            className="text-xs underline underline-offset-2"
          >
            Tickets
          </a>
        ) : (
          <span className="text-xs text-zinc-500">Details</span>
        )}
        {/* Works in both Events and Planner */}
        <SaveButton event={event} />
      </div>
    </div>
  );
}