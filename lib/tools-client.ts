export async function searchEventbrite(input: {
  q?: string;
  lat?: number;
  lng?: number;
  radiusKm?: number;
  startDate?: string;
  endDate?: string;
}) {
  const r = await fetch("/api/tools/eventbrite/search", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!r.ok) throw new Error("eventbrite search failed");
  return (await r.json()) as { events: any[] };
}
