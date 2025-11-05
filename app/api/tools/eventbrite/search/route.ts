import { env } from "@/lib/env";

export const runtime = "nodejs";

type Body = {
  q?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  startDate?: string;
  endDate?: string;
};

function toKm(km?: number) {
  const v = typeof km === "number" && isFinite(km) ? km : 40;
  return `${Math.max(1, Math.min(160, Math.round(v)))}km`;
}

function pick<T>(
  arr: T[] | undefined | null,
  idx = 0,
  fallback?: T
): T | undefined {
  if (!arr || !Array.isArray(arr)) return fallback;
  return typeof arr[idx] !== "undefined" ? arr[idx] : fallback;
}

export async function POST(req: Request) {
  try {
    const { q, lat, lng, radiusKm, startDate, endDate } =
      (await req.json()) as Body;

    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (typeof lat === "number" && typeof lng === "number") {
      params.set("location.latitude", String(lat));
      params.set("location.longitude", String(lng));
      params.set("location.within", toKm(radiusKm));
    }
    if (startDate) params.set("start_date.range_start", startDate);
    if (endDate) params.set("start_date.range_end", endDate);
    params.set("expand", "venue");
    params.set("sort_by", "date");

    const url = `https://www.eventbriteapi.com/v3/events/search/?${params.toString()}`;

    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${env.EVENTBRITE_API_KEY}`,
      },
      cache: "no-store",
    });

    if (!r.ok) {
      return new Response(
        JSON.stringify({ error: "Upstream error", status: r.status }),
        { status: 502, headers: { "content-type": "application/json" } }
      );
    }

    const data = await r.json();

    const items = (data?.events ?? []) as any[];

    const events = items.map((e: any) => {
      const id = `eventbrite:${e?.id ?? ""}`;
      const image =
        pick(e?.logo ? [e.logo] : [], 0)?.url ?? e?.logo?.url ?? null;

      const venue = e?.venue ?? {};
      const priceMin = null;
      const priceMax = null;

      return {
        id,
        source: "eventbrite",
        title: e?.name?.text ?? "Event",
        url: e?.url ?? "",
        start: e?.start?.utc ?? null,
        end: e?.end?.utc ?? null,
        timezone: e?.start?.timezone ?? null,
        priceMin,
        priceMax,
        currency: e?.currency ?? null,
        category: e?.category_id ?? null,
        categoryName: null,
        tags: [],
        image,
        venue: {
          id: venue?.id ?? null,
          name: venue?.name ?? null,
          address: venue?.address?.address_1 ?? null,
          city: venue?.address?.city ?? null,
          state: venue?.address?.region ?? null,
          stateCode: venue?.address?.region ?? null,
          country: venue?.address?.country ?? null,
          lat: venue?.latitude ? Number(venue.latitude) : null,
          lng: venue?.longitude ? Number(venue.longitude) : null,
        },
      };
    });

    return new Response(JSON.stringify({ events }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Bad request" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}
