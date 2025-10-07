"use client";

import { useState } from "react";

export default function DebugSearchPage() {
  const [q, setQ] = useState("Detroit");
  const [lat, setLat] = useState("42.3314");
  const [lng, setLng] = useState("-83.0458");
  const [radiusKm, setRadiusKm] = useState("40");
  const [out, setOut] = useState("");

  async function run() {
    const body = {
      q,
      lat: Number(lat),
      lng: Number(lng),
      radiusKm: Number(radiusKm),
    };
    const r = await fetch("/api/tools/search-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await r.json();
    setOut(JSON.stringify(json, null, 2));
  }

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1>Search Events (Local API)</h1>
      <div
        style={{
          display: "grid",
          gap: 8,
          gridTemplateColumns: "repeat(4, 1fr)",
          marginBottom: 12,
        }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="q"
        />
        <input
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="lat"
        />
        <input
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="lng"
        />
        <input
          value={radiusKm}
          onChange={(e) => setRadiusKm(e.target.value)}
          placeholder="radiusKm"
        />
      </div>
      <button onClick={run}>Run</button>
      <pre style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>{out}</pre>
    </div>
  );
}
