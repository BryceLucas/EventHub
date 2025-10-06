import { NextRequest } from "next/server";

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function weatherCodeToSummary(code: number) {
  if ([0].includes(code)) return "Clear";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65].includes(code)) return "Rain";
  if ([66, 67].includes(code)) return "Freezing rain";
  if ([71, 73, 75, 77].includes(code)) return "Snow";
  if ([80, 81, 82].includes(code)) return "Showers";
  if ([85, 86].includes(code)) return "Snow showers";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
}

export async function POST(req: NextRequest) {
  const { lat, lng, isoDatetime } = await req.json();
  if (typeof lat !== "number" || typeof lng !== "number" || !isoDatetime)
    return new Response("Bad request", { status: 400 });

  const d = new Date(isoDatetime);
  const y = d.getUTCFullYear();
  const m = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  const dateStr = `${y}-${m}-${day}`;

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lng));
  url.searchParams.set("hourly", "temperature_2m,weathercode");
  url.searchParams.set("temperature_unit", "fahrenheit");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("start_date", dateStr);
  url.searchParams.set("end_date", dateStr);

  const r = await fetch(url.toString(), { cache: "no-store" });
  if (!r.ok) return new Response("Upstream error", { status: 502 });
  const data = await r.json();

  const hours: string[] = data?.hourly?.time ?? [];
  const temps: number[] = data?.hourly?.temperature_2m ?? [];
  const codes: number[] = data?.hourly?.weathercode ?? [];

  const targetISO =
    new Date(
      Date.UTC(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        d.getUTCHours(),
        0,
        0
      )
    )
      .toISOString()
      .slice(0, 13) + ":00";
  let idx = hours.findIndex((h) => h.startsWith(targetISO));
  if (idx < 0) idx = 0;

  const tempF = temps[idx] ?? null;
  const code = codes[idx] ?? 0;
  const summary = weatherCodeToSummary(code);

  return Response.json({
    icon: String(code),
    summary,
    tempF,
    tempC: tempF == null ? null : Math.round(((tempF - 32) * 5) / 9),
  });
}
