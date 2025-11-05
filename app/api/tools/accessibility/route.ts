import { NextResponse } from "next/server";

function bboxAround(lat: number, lng: number, d = 0.002) {
  return [lat - d, lng - d, lat + d, lng + d];
}

export async function POST(req: Request) {
  const { lat, lng } = await req.json();
  if (typeof lat !== "number" || typeof lng !== "number")
    return NextResponse.json({ error: "coords" }, { status: 400 });

  const [s, w, n, e] = bboxAround(lat, lng);
  const q = `
    [out:json][timeout:25];
    (
      node["wheelchair"]( ${s},${w},${n},${e} );
      way["wheelchair"]( ${s},${w},${n},${e} );
      node["toilets:wheelchair"]( ${s},${w},${n},${e} );
      way["toilets:wheelchair"]( ${s},${w},${n},${e} );
      node["hearing_loop"]( ${s},${w},${n},${e} );
      way["hearing_loop"]( ${s},${w},${n},${e} );
    );
    out center tags;
  `.trim();

  const r = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data: q }).toString(),
  });
  if (!r.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
  const data = await r.json();

  const items = data.elements.map((el: any) => ({
    id: `${el.type}/${el.id}`,
    tags: el.tags || {},
    lat: el.lat ?? el.center?.lat ?? null,
    lng: el.lon ?? el.center?.lon ?? null,
  }));

  return NextResponse.json({ features: items });
}
