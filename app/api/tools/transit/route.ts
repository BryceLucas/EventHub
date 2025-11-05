import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { from, to, departAt } = await req.json();
  if (!from || !to)
    return NextResponse.json({ error: "missing coords" }, { status: 400 });

  const base = new URL("https://www.google.com/maps/dir/");
  const s = `${from.lat},${from.lng}`;
  const e = `${to.lat},${to.lng}`;
  base.searchParams.set("api", "1");
  base.searchParams.set("origin", s);
  base.searchParams.set("destination", e);
  base.searchParams.set("travelmode", "transit");
  if (departAt)
    base.searchParams.set(
      "departure_time",
      String(Math.floor(new Date(departAt).getTime() / 1000))
    );

  return NextResponse.json({ url: base.toString() });
}
