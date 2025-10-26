// Enabling client-side features for this component
"use client";

// Import the useState hook from React
import { useState } from "react";

// Default function component for the Debug Search Page
export default function DebugSearchPage() {
  // State hools for input fields and output display
  const [q, setQ] = useState("Detroit"); // Search query, default set to "Detroit"
  const [lat, setLat] = useState("42.3314"); // Latitude, default set to the center of Detroit
  const [lng, setLng] = useState("-83.0458"); // Longitude, default set to the center of Detroit
  const [radiusKm, setRadiusKm] = useState("40"); // Search radius in kilometers, default is 40 km
  const [out, setOut] = useState(""); // State to hold output from the API response

  // Function to run the search event query
  async function run() {
    // Contruct the request body from state variables
    const body = {
      q,
      lat: Number(lat), // Convert latitude from string to number
      lng: Number(lng), // Convert longitude from string to number
      radiusKm: Number(radiusKm), // Convert radius from string to number
    };

    // Fetch dat from the local API
    const r = await fetch("/api/tools/search-events", {
      method: "POST", // Specify the method as POST
      headers: { "Content-Type": "application/json" }, // Set the content type to JSON
      body: JSON.stringify(body), // Stringify the body for the request
    });
    const json = await r.json(); // Parse the JSON response from the API
    setOut(JSON.stringify(json, null, 2)); // Format and set the output state
  }

  return (
    <div style={{ padding: 24, maxWidth: 900 }}> {/*Container for the page*/}
      <h1>Search Events (Local API)</h1> {/*Header for the page*/}
      <div
        style={{
          display: "grid", // Use grid layout for inputs
          gap: 8, // Spacing between inputs
          gridTemplateColumns: "repeat(4, 1fr)", // Four equal-width columns
          marginBottom: 12, // Bottom margin for the input container
        }}
      >
        <input
          value={q} // Controlled input for search query
          // Update state on input change
          onChange={(e) => setQ(e.target.value)}
          placeholder="q" // Placeholder text for search query
        />
        <input
          value={lat} // Controlled input for latitude
          // Update state on input change
          onChange={(e) => setLat(e.target.value)}
          placeholder="lat" // Placeholder text for latitude
        />
        <input
          value={lng} // Controlled input for longitude
          // Update state on input change
          onChange={(e) => setLng(e.target.value)}
          placeholder="lng" // Placeholder text for longitude
        />
        <input
          value={radiusKm} // Controlled input for search radius
          // Update state on input change
          onChange={(e) => setRadiusKm(e.target.value)}
          placeholder="radiusKm" // Placeholder text for search radius
        />
      </div>
      <button onClick={run}>Run</button> {/*Button to trigger the search*/}
      <pre style={{ whiteSpace: "pre-wrap", marginTop: 16 }}>{out}</pre>
      {/*Display the output from API in a formatted way*/}
    </div>
  );
}
