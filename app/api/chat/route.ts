// Import the NextRequest type from the Next.js for type-safe request handling
import { NextRequest } from "next/server";

// Function to call the Together.ai API with retry logic for failures
async function callTogetherWithRetry(payload: any, retries = 2) {
  // Attempt the API call for the specified number of retries
  for (let i = 0; i <= retries; i++) {
    // Fetch the API endpoint with the provided payload
    const resp = await fetch(
      "https://api.together.xyz/v1/chat/completions",
      payload
    );
    // Return the response as JSON if the request was successful
    if (resp.ok) return await resp.json();
    // If this was the last attempt, throw an error
    if (i === retries) throw new Error("Together.ai API failed after retries");
  }
}

// Async function to handle POST requests
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming JSON body of the request
    const body = await req.json();
    // Destructure messages and tone, with a default tone
    let { messages, tone = "default" } = body;

    // Retrieve the API key from environment variables
    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
      return new Response("Missing TOGETHER_API_KEY", { status: 500 }); // Hanlde missing API key
    }

    // Limit the number of messages to the last 10 avoid excessive date
    if (messages.length > 10) {
      messages = messages.slice(messages.length - 10);
    }

    // Define the system instruction for the chatbot
    let systemInstruction = `You are EventBot, an AI assistant for EventHub. Your job is to answer questions clearly, accurately, and in the requested tone.`;
    switch (tone) {
      case "casual":
        // casual tone instruction
        systemInstruction += " Speak casually and friendly.";
        break;
      case "formal":
        // formal tone instruction
        systemInstruction += " Speak in a formal, professional tone.";
        break;
      case "helpful":
        // helpful tone instruction
        systemInstruction += " Be extremely helpful and clear, like a tutor.";
        break;
      case "sarcastic":
        // sarcastic tone instruction
        systemInstruction += " Respond with mild sarcasm but stay helpful.";
        break;
      default:
        // Default response if tone is unrecognized
        systemInstruction += " Reply normally.";
    }

    // Prepare the payload for the API request
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify content type for the request
        Authorization: `Bearer ${apiKey}`, // Include the API key in the authorization header
      },
      body: JSON.stringify({
        // specify the model to use for processing
        model: "openai/gpt-oss-20b",
        // combine system instruction with user messages
        messages: [{ role: "system", content: systemInstruction }, ...messages],
        temperature: 0.7, // Set a moderate level of randomness in responses
        max_tokens: 400, // Limit the maximum number of tokens in the response
      }),
    };

    // Call the together.ai API with the retry logic
    const data = await callTogetherWithRetry(payload);
    // Extract the response content from the API data
    const reply = data.choices[0].message.content;

    // Return the chat reply in JSON format
    return new Response(JSON.stringify({ reply }), {
      // Set the content type header for the response
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // Log any errors that occur during request processing
    console.error("Error in /api/chat route:", err);
    // Return a 500 error for unhandled exceptions
    return new Response("Internal Server Error", { status: 500 });
  }
}
