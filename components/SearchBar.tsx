"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
  const router = useRouter();
  const params = useSearchParams();

  const [q, setQ] = useState(params.get("q") ?? "");
  const [city, setCity] = useState(params.get("city") ?? "");
  const [start, setStart] = useState(params.get("start") ?? "");
  const [end, setEnd] = useState(params.get("end") ?? "");
  const [radius, setRadius] = useState(params.get("radius") ?? "25");

  useEffect(() => {
    setQ(params.get("q") ?? "");
    setCity(params.get("city") ?? "");
    setStart(params.get("start") ?? "");
    setEnd(params.get("end") ?? "");
    setRadius(params.get("radius") ?? "25");
  }, [params]);

  function submit() {
    const sp = new URLSearchParams();
    if (q) sp.set("q", q);
    if (city) sp.set("city", city);
    if (start) sp.set("start", start);
    if (end) sp.set("end", end);
    if (radius) sp.set("radius", radius);
    router.push(`/events?${sp.toString()}`);
  }

  return (
    <div className="grid gap-2 md:grid-cols-[1fr_220px_180px_180px_120px_auto]">
      <input
        className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2"
        placeholder="Search concerts, sports…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <input
        className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2"
        placeholder="City (e.g., Detroit)"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type="date"
        className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2"
        value={start}
        onChange={(e) => setStart(e.target.value)}
      />
      <input
        type="date"
        className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2"
        value={end}
        onChange={(e) => setEnd(e.target.value)}
      />
      <input
        className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-2"
        placeholder="Radius (mi)"
        value={radius}
        onChange={(e) => setRadius(e.target.value)}
      />
      <button
        onClick={submit}
        className="rounded-lg bg-zinc-100 px-4 py-2 text-zinc-900"
      >
        Search
      </button>
    </div>
  );
}
