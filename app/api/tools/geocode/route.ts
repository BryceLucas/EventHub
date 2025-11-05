import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { query } = await req.json();
  if (!query)
    return NextResponse.json({ error: "missing query" }, { status: 400 });

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", String(query));
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("limit", "5");

  const r = await fetch(url, { headers: { "User-Agent": "EventHub/1.0" } });
  if (!r.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
  const data = await r.json();

  const results = data.map((d: any) => ({
    label: d.display_name,
    lat: Number(d.lat),
    lng: Number(d.lon),
  }));

  return NextResponse.json({ results });
}
