import { NextRequest } from "next/server";
import crypto from "crypto";

function toISOZulu(x?: string | null) {
  if (!x) return undefined;
  const d = new Date(x);
  const yyyy = d.getUTCFullYear();
  const mm = `${d.getUTCMonth() + 1}`.padStart(2, "0");
  const dd = `${d.getUTCDate()}`.padStart(2, "0");
  const hh = `${d.getUTCHours()}`.padStart(2, "0");
  const mi = `${d.getUTCMinutes()}`.padStart(2, "0");
  const ss = `${d.getUTCSeconds()}`.padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}Z`;
}

function kmToMiles(km?: number) {
  if (!km && km !== 0) return 25;
  return Math.max(1, Math.round(km * 0.621371));
}

function pick<T>(arr: T[] | undefined | null, i = 0): T | undefined {
  return Array.isArray(arr) ? arr[i] : undefined;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const q = body?.q ?? "";
  const lat = typeof body?.lat === "number" ? body.lat : undefined;
  const lng = typeof body?.lng === "number" ? body.lng : undefined;
  const radiusKm = kmToMiles(body?.radiusKm);
  const start = toISOZulu(body?.startDate);
  const end = toISOZulu(body?.endDate);
  const category = body?.category ?? "";

  const key = process.env.TICKETMASTER_API_KEY || "";
  if (!key)
    return new Response("Missing TICKETMASTER_API_KEY", { status: 500 });

  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  url.searchParams.set("apikey", key);
  if (q) url.searchParams.set("keyword", q);
  if (lat != null && lng != null) {
    url.searchParams.set("latlong", `${lat},${lng}`);
    url.searchParams.set("radius", String(radiusKm));
    url.searchParams.set("unit", "miles");
  }
  if (start) url.searchParams.set("startDateTime", start);
  if (end) url.searchParams.set("endDateTime", end);
  if (category) url.searchParams.set("classificationName", category);
  url.searchParams.set("size", "50");
  url.searchParams.set("sort", "date,asc");

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) return new Response("Upstream error", { status: 502 });
  const data = await r.json();

  const items: any[] = data?._embedded?.events ?? [];
  const events = items.map((e: any) => {
    const id = e?.id ? `ticketmaster:${e.id}` : crypto.randomUUID();
    const venue: any = pick(e?._embedded?.venues, 0) || {};
    const images: any[] = Array.isArray(e?.images) ? e.images : [];
    const image = (images.filter((im: any) => im?.url)[0]?.url as string) || "";
    const price: any = pick(e?.priceRanges, 0) || {};
    const classif: any = pick(e?.classifications, 0) || {};
    const categoryName: string =
      classif?.genre?.name || classif?.segment?.name || "";

    return {
      id,
      source: "ticketmaster",
      title: e?.name || "Event",
      url: e?.url || "",
      start: e?.dates?.start?.dateTime || null,
      end: e?.dates?.end?.dateTime || null,
      timezone: e?.dates?.timezone || null,
      priceMin: typeof price?.min === "number" ? price.min : null,
      priceMax: typeof price?.max === "number" ? price.max : null,
      currency: price?.currency || null,
      category: categoryName || null,
      tags: [],
      image: image || null,
      venue: {
        id: venue?.id || null,
        name: venue?.name || null,
        address: venue?.address?.line1 || null,
        city: venue?.city?.name || null,
        state: venue?.state?.stateCode || venue?.state?.name || null,
        country: venue?.country?.countryCode || venue?.country?.name || null,
        lat: venue?.location?.latitude ? Number(venue.location.latitude) : null,
        lng: venue?.location?.longitude
          ? Number(venue.location.longitude)
          : null,
      },
    };
  });

  return Response.json({ events });
}
