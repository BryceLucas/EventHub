// Import NextRequest type for type-safe request handling
import { NextRequest } from "next/server";

// Function to pad single-digit numbers with a leading zero
function pad(n: number) {
  // return 'On' if n is less than 10, else return n as a string
  return n < 10 ? `0${n}` : `${n}`; 
}

// Function that maps weather codes to human-readable summaries
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
  return "Unknown"; // Default case for unrecognized weather codes
}

// Async function to handle POST requests
export async function POST(req: NextRequest) {
  // Destructure needed properties from the request JSON body
  const { lat, lng, isoDatetime } = await req.json();
  // Validate the input parameters
  if (typeof lat !== "number" || typeof lng !== "number" || !isoDatetime)
    // return 400 if validation fails
    return new Response("Bad request", { status: 400 });

  // Create a date object from the ISO datetime string
  const d = new Date(isoDatetime);
  // Extract year, month, and day from the date
  const y = d.getUTCFullYear();
  // Months are zero-indexed, hence the +1
  const m = pad(d.getUTCMonth() + 1);
  const day = pad(d.getUTCDate());
  // Format date as 'YYYY-MM-DD'
  const dateStr = `${y}-${m}-${day}`;

  // Construct URL for the weather forecast API
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat)); // Set latitude parameter
  url.searchParams.set("longitude", String(lng)); // Set longitude parameter
  url.searchParams.set("hourly", "temperature_2m,weathercode"); // Specify data points to retrieve
  url.searchParams.set("temperature_unit", "fahrenheit"); // Set tempurature unit
  url.searchParams.set("timezone", "auto"); // Automatically adjust timezone
  url.searchParams.set("start_date", dateStr); // Set start date for forecast
  url.searchParams.set("end_date", dateStr); // Set end date for forecast

  // Fetch weather data from the constructed URL
  const r = await fetch(url.toString(), { cache: "no-store" }); // No caching
  if (!r.ok) return new Response("Upstream error", { status: 502 }); // Handle fetch errors
  // Parse the returned JSON data
  const data = await r.json();

  // Extract relevant hourly data from the response
  const hours: string[] = data?.hourly?.time ?? []; // Default to empty array if not available
  const temps: number[] = data?.hourly?.temperature_2m ?? []; // Default to empty array if not available
  const codes: number[] = data?.hourly?.weathercode ?? []; // Default to empty array if not available

  // Calculate the target ISO time for the requested date at midnight
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
      .slice(0, 13) + ":00"; // Format as 'YYYY-MM-DDTHH:00:00Z'
  // Find the index of the target time in the hours array
  let idx = hours.findIndex((h) => h.startsWith(targetISO));
  if (idx < 0) idx = 0; // Default to the first hour if the target time in not found

  // Get the temperature and weather code based on the found index
  const tempF = temps[idx] ?? null; // Temperature in Fahrenheit, or null if not available
  const code = codes[idx] ?? 0; // Weather code, defaulting to 0 if not available
  // Get the human-readable weather summary using the weather code
  const summary = weatherCodeToSummary(code);

  // Return a JSON response with relevant weather information
  return Response.json({
    icon: String(code), // Convert weather code to string for icon display
    summary,  // Human-readable weather summary
    tempF, // Current temperature in Fahrenheit
    // Convert Fahrenheit to Celsius, or null if tempF is unavailable
    tempC: tempF == null ? null : Math.round(((tempF - 32) * 5) / 9),
  });
}
