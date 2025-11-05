import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { text, source = "auto", target = "en" } = await req.json();
  const url =
    process.env.LIBRETRANSLATE_URL || "https://libretranslate.de/translate";
  if (!text)
    return NextResponse.json({ error: "missing text" }, { status: 400 });

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q: text, source, target, format: "text" }),
  });
  if (!r.ok) return NextResponse.json({ error: "upstream" }, { status: 502 });
  const data = await r.json();

  return NextResponse.json({ translated: data.translatedText || "" });
}
