// Import the NextRequest type from Next.js to ensure type-safe request handling
import { NextRequest } from "next/server";

// Function to call the Together.ai API with retry logic
async function callTogetherWithRetry(payload: any, retries = 2) {
  // Attempt the API to call for the specified number of retries
  for (let i = 0; i <= retries; i++) {
    // Fetch the API endpoint with the provided payload
    const resp = await fetch(
      "https://api.together.xyz/v1/chat/completions",
      payload
    );
    // return the response as JSON if the request was successful
    if (resp.ok) return await resp.json();
    // if this was the last attempt, throw an error
    if (i === retries) throw new Error("Together.ai API failed after retries");
  }
}

// Async function to handle POST requests
export async function POST(req: NextRequest) {
  try {
    // Parse the JSON body of the incoming request
    const body = await req.json();
    // Destructure necessary properties from the body with default values
    const {
      text,
      mode = "short", // Default to "short" mode if not provided
      language = "English", // Default to English language if not provided
      maxLength = 150, // Default max length to 150 words if not provided
    } = body;

    const apiKey = process.env.TOGETHER_API_KEY; // Retrieve API key from environment variables
    if (!apiKey) {
      return new Response("Missing TOGETHER_API_KEY", { status: 500 }); // Handle missing API key
    }

    // Determine the instruction based on the summarization mode
    let modeInstruction = "";
    switch (mode) {
      case "short":
        modeInstruction = "Summarize this text in 1–2 sentences.";
        break;
      case "detailed":
        modeInstruction =
          "Summarize this text in a detailed but concise paragraph.";
        break;
      case "simple":
        modeInstruction =
          "Summarize this text in very simple and clear language.";
        break;
      case "formal":
        modeInstruction = "Summarize this text in a professional, formal tone.";
        break;
      default:
        modeInstruction = "Summarize this text clearly and concisely.";
    }

    // Construct the prompt for the summarization API
    const prompt = `${modeInstruction} The summary should not exceed ${maxLength} words. Translate the final summary to ${language} if needed.\n\n${text}`;

    // Prepare the payload for the API request
    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Specify the content type
        Authorization: `Bearer ${apiKey}`, // Include the API key in the authorization header
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", // Specify the model to use for the summarization
        messages: [
          {
            role: "system",
            content: "You are a helpful summarization assistant.", // System message defining the assistant's role
          },
          { role: "user", content: prompt }, // User message with the summarization request
        ],
        temperature: 0.4, // Set the randomness of responses, lower values yield more focused output
        max_tokens: 400, // Limit the max number of token in the response
      }),
    };

    // Call the Together.ai API with retry logic
    const data = await callTogetherWithRetry(payload);
    // Extract the summarized content from the response
    const summary = data.choices[0].message.content;

    // Return the summary in JSON format
    return new Response(JSON.stringify({ summary }), {
      // Set the content type for the response
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    // Log any errors encountered during the process
    console.error("Error in /api/summarize route:", err);
    // return a 500 error for any unhandled exceptions
    return new Response("Internal Server Error", { status: 500 });
  }
}
