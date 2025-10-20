// Asynchronous function to retrieve weather data based on location, time, and date
export async function getWeather(input: {
  lat: number;  // Latitude of the location in degress
  lng: number;  // Longitude of the location in degrees
  isoDatetime: string;  // ISO 8601 formatted date and time string
}) {
  // Send a request to the weather API with the provided input data
  const res = await fetch("/api/tools/weather", {
    method: "POST", // Set the HTTP method to POST
    headers: { "Content-Type": "application/json" }, // Specify JSON content type
    body: JSON.stringify(input), // Convert input object to JSON string for request body
  });
  // Check if the response is not OK; if so, throw error
  if (!res.ok) throw new Error("weather failed");
  // parse and return the response body as JSON
  return res.json();
}
