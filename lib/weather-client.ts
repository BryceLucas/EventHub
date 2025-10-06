export async function getWeather(input: {
  lat: number;
  lng: number;
  isoDatetime: string;
}) {
  const res = await fetch("/api/tools/weather", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error("weather failed");
  return res.json();
}
