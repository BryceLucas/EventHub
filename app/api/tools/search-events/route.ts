// Importing NextRequest for handling HTTP requests in Next.js apps
import { NextRequest } from "next/server";
// Importing crypto module for generating unique identifiers
import crypto from "crypto";

// Function to convert date strings to ISO 8601 (Zulu) format
function toISOZulu(x?: string | null) {
  // If input is not provided, return undefined
  if (!x) return undefined;
  const d = new Date(x);  // Create Date object from the input string
  const yyyy = d.getUTCFullYear(); // Extract the year in UTC
  const mm = `${d.getUTCMonth() + 1}`.padStart(2, "0");  // Extract month (zero-padded)
  const dd = `${d.getUTCDate()}`.padStart(2, "0");  // Extract day (zero-padded)
  const hh = `${d.getUTCHours()}`.padStart(2, "0");  // Extract hour (zero-padded)
  const mi = `${d.getUTCMinutes()}`.padStart(2, "0");  // Extract minutes (zero-padded)
  const ss = `${d.getUTCSeconds()}`.padStart(2, "0");  // Extract seconds (zero-padded)
  // Return formatted date string in ISO 8601 (Zulu) format
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}:${ss}Z`;
}

// Function to convert kilometers to miles
function kmToMiles(km?: number) {
  // If input is not provided (null), return a default value of 25 miles
  if (!km && km !== 0) return 25;
  // Convert km to miles, ensuring a minimum return value of 1
  return Math.max(1, Math.round(km * 0.621371));
}

// Function to pick an element at a given index from an array
function pick<T>(arr: T[] | undefined | null, i = 0): T | undefined {
  // Return the specified index element if the input is an array; otherwise return undefined
  return Array.isArray(arr) ? arr[i] : undefined;
}

// Main function that handles POST requests
export async function POST(req: NextRequest) {
  // Extract relevant data from the request body; set defauls where necessary
  const body = await req.json();
  const q = body?.q ?? "";  // Extract search query, default to empty string
  const lat = typeof body?.lat === "number" ? body.lat : undefined;  // Extract latitude if provided
  const lng = typeof body?.lng === "number" ? body.lng : undefined;  // Extract longitude if provided
  const radiusKm = kmToMiles(body?.radiusKm);  // Convert radius from km to miles
  const start = toISOZulu(body?.startDate);  // Convert start date to ISO format
  const end = toISOZulu(body?.endDate);  // Convert end date to ISO format
  const category = body?.category ?? "";  // Extract category, deault to empty string

  // Retrieve the Ticketmaster API key from environment variables
  const key = process.env.TICKETMASTER_API_KEY || "";
  // Return error response if API key is not provided
  if (!key)
    return new Response("Missing TICKETMASTER_API_KEY", { status: 500 });

  // Construct the Ticketmaster API endpoint URL
  const url = new URL("https://app.ticketmaster.com/discovery/v2/events.json");
  // Append the API key to the URL
  url.searchParams.set("apikey", key);
  // If there is a search query, append it to the URL
  if (q) url.searchParams.set("keyword", q);
  // If latitude and longitude are provided, append them and set radius
  if (lat != null && lng != null) {
    url.searchParams.set("latlong", `${lat},${lng}`);
    url.searchParams.set("radius", String(radiusKm));
    url.searchParams.set("unit", "miles"); // set unit to miles
  }
  // Append start and end dates to the URL if provided
  if (start) url.searchParams.set("startDateTime", start);
  if (end) url.searchParams.set("endDateTime", end);
  // Append event category if provided
  if (category) url.searchParams.set("classificationName", category);
  // Limt results size and sort by date
  url.searchParams.set("size", "50");
  url.searchParams.set("sort", "date,asc");

  // Fetch data from Ticketmaster API
  const r = await fetch(url.toString(), { cache: "no-store" });
  // If the response from API is not successful, return error response
  if (!r.ok) return new Response("Upstream error", { status: 502 });
  // Parse the response JSON into a Javascript object
  const data = await r.json();

  // Extract the events from the response, defaulting to an empty array if none found
  const items: any[] = data?._embedded?.events ?? [];
  // Map through the events to transform and structure the date for the output
  const events = items.map((e: any) => {
    // Generate a unique identifier for the event; use Ticketmaster ID if available, otherwise create new UUID
    const id = e?.id ? `ticketmaster:${e.id}` : crypto.randomUUID();
    // Get the first venue from the event date, if available
    const venue: any = pick(e?._embedded?.venues, 0) || {};
    // Collect images if available, defaulting to an empty array
    const images: any[] = Array.isArray(e?.images) ? e.images : [];
    // Select the first image URL; default to an empty string if none found
    const image = (images.filter((im: any) => im?.url)[0]?.url as string) || "";
    // Get price range information, defaulting to an empty object
    const price: any = pick(e?.priceRanges, 0) || {};
    // Get classification information, defaulting to an empty object
    const classif: any = pick(e?.classifications, 0) || {};
    // Extract category name from classification data
    const categoryName: string =
      classif?.genre?.name || classif?.segment?.name || "";

    // Return a structured event object
    return {
      id,  // Unique event identifier
      source: "ticketmaster",  // Source of the event data
      title: e?.name || "Event",  // Event title, defaulting to "Event" if not found
      url: e?.url || "",  // URL for the event page
      start: e?.dates?.start?.dateTime || null,  // Event start datetime
      end: e?.dates?.end?.dateTime || null,  // Event end datetime
      timezone: e?.dates?.timezone || null,  // Timezone for the event
      priceMin: typeof price?.min === "number" ? price.min : null,  // minimum price, if available
      priceMax: typeof price?.max === "number" ? price.max : null,  // maximum price, if available
      currency: price?.currency || null,  // Currency for the pricing
      category: categoryName || null,  // Event category, if available
      tags: [],  // Placeholder for tags (could be extended in future)
      image: image || null,  // Image URL for the event
      // Venue details structured into an object
      venue: {
        id: venue?.id || null,  // Venue ID
        name: venue?.name || null,  // Venue name
        address: venue?.address?.line1 || null,  // Venue address
        city: venue?.city?.name || null,  // Venue city
        state: venue?.state?.stateCode || venue?.state?.name || null,  // Venue state
        country: venue?.country?.countryCode || venue?.country?.name || null,  // Venue country
        // Latitiude and longitude for the venue location
        lat: venue?.location?.latitude ? Number(venue.location.latitude) : null,  
        lng: venue?.location?.longitude
          ? Number(venue.location.longitude)
          : null,
      },
    };
  });

  // Return the structured events list wrapped in a JSON response
  return Response.json({ events });
}
