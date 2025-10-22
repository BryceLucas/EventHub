import SaveButton from "@/components/SaveButton";
import WeatherBadge from "@/components/WeatherBadge";

async function getEvent(id: string) {
  // If your search-events API supports id lookup, use it.
  const url = `${
    process.env.NEXT_PUBLIC_BASE_URL ?? ""
  }/api/search-events?id=${encodeURIComponent(id)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;
  const j = await res.json();
  // Accept several shapes: {event}, Ticketmaster-like, or raw:
  return j?.event ?? j?._embedded?.events?.[0] ?? j;
}

export default async function EventDetail({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);

  if (!event) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold">Event not found</h1>
      </main>
    );
  }

  const title = event?.name ?? "Event";
  const venue = event?._embedded?.venues?.[0]?.name ?? "";
  const city = event?._embedded?.venues?.[0]?.city?.name ?? "";
  const date = event?.dates?.start?.localDate ?? "";
  const img = event?.images?.[0]?.url ?? event?.image ?? "/file.svg";

  return (
    <main className="mx-auto max-w-4xl p-4 md:p-6">
      <div className="flex items-start gap-4">
        <img
          src={img}
          alt=""
          className="h-36 w-56 rounded-lg object-cover border border-zinc-800"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-semibold">{title}</h1>
          <div className="mt-1 text-sm text-zinc-400">
            {venue} {city && `• ${city}`} {date && `• ${date}`}
          </div>
          <div className="mt-2 flex items-center gap-3">
            <SaveButton event={event} />
            <WeatherBadge city={city} date={date} />
            {event?.url && (
              <a href={event.url} target="_blank" className="text-sm underline">
                Tickets
              </a>
            )}
          </div>
        </div>
      </div>

      {event?.info && (
        <p className="mt-4 text-sm text-zinc-300 whitespace-pre-wrap">
          {event.info}
        </p>
      )}
    </main>
  );
}
