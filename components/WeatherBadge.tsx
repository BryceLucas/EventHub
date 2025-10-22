"use client";
import { useEffect, useState } from "react";

export default function WeatherBadge({
  city,
  date,
}: {
  city?: string;
  date?: string;
}) {
  const [txt, setTxt] = useState<string>("");

  useEffect(() => {
    if (!city) return;
    (async () => {
      try {
        const res = await fetch("/api/weather", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ city, date }),
        });
        const j = await res.json();
        setTxt(j?.summary ?? j?.text ?? "Weather loaded.");
      } catch {
        setTxt("Weather unavailable.");
      }
    })();
  }, [city, date]);

  if (!city) return null;

  return (
    <span className="inline-block rounded-md border border-zinc-700 bg-zinc-900/60 px-2 py-1 text-xs">
      {txt}
    </span>
  );
}
