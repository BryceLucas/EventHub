// Functional Summary
// defines an asynchronous function for handling POST requests in a Next.js application.
// extracts messages from the requesto body and verifies API key.
// POST request is made to the together API and a formatted JSON response is returned.

// Importing NextRequest type from Next.js server utilities
import { NextRequest } from "next/server";

// Exporting an asynchornous POST function to handle incoming requests
export async function POST(req: NextRequest) {
  // Attempting to pasre the request body as JSON; if it fails, assign an empty object
  const body = await req.json().catch(() => ({}));
  
  // Extracting messages from the body; defaults to an empty array if not an array
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  
  // Retrieving the API key from environment variables; defaults to an empty string if not found
  const apiKey = process.env.TOGETHER_API_KEY || "";
  
  // Checking if the API key is missing; returns a 500 error response if so
  if (!apiKey) return new Response("Missing TOGETHER_API_KEY", { status: 500 });

  // Making a POST request to the 'together' API for chat completions
  const resp = await fetch("https://api.together.xyz/v1/chat/completions", {
    // Setting the request method to POST
    method: "POST",
    headers: {
      // Specifying content type as JSON
      "Content-Type": "application/json",
      // Adding authorization header with the API key
      Authorization: `Bearer ${apiKey}`,
    },
    // Sending the request body containing model parameters and messages
    body: JSON.stringify({
      model: "openai/gpt-oss-20b", // Specifying the model to use
      messages, // Including the extracted messages
      temperature: 0.4, // Setting the randomness of the model's predictions
      max_tokens: 512,  // Limiting the maximum number of tokens in the response
    }),
  });

  // Checking if the response from the API is not OK; returns a 502 error response if so
  if (!resp.ok) return new Response("Upstream error", { status: 502 });
  
  //Parsing the JSON data from the response
  const data = await resp.json();
  
  // Returning the response data as JSON with the correct content type
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
