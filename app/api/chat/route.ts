// Functional Summary
// defines an asynchronous function for handling POST requests in a Next.js application.
// extracts messages from the requesto body and verifies API key.
// POST request is made to the together API and a formatted JSON response is returned.

// Importing NextRequest type from Next.js server utilities
import { NextRequest } from "next/server";

async function callTogetherWithRetry(payload: any, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    const resp = await fetch(
      "https://api.together.xyz/v1/chat/completions",
      payload
    );
    if (resp.ok) return await resp.json();
    if (i === retries) throw new Error("Together.ai API failed after retries");
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { messages, tone = "default" } = body;

    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
      return new Response("Missing TOGETHER_API_KEY", { status: 500 });
    }

    if (messages.length > 10) {
      messages = messages.slice(messages.length - 10);
    }

    let systemInstruction = `You are EventBot, an AI assistant for EventHub. Your job is to answer questions clearly, accurately, and in the requested tone.`;
    switch (tone) {
      case "casual":
        systemInstruction += " Speak casually and friendly.";
        break;
      case "formal":
        systemInstruction += " Speak in a formal, professional tone.";
        break;
      case "helpful":
        systemInstruction += " Be extremely helpful and clear, like a tutor.";
        break;
      case "sarcastic":
        systemInstruction += " Respond with mild sarcasm but stay helpful.";
        break;
      default:
        systemInstruction += " Reply normally.";
    }

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [{ role: "system", content: systemInstruction }, ...messages],
        temperature: 0.7,
        max_tokens: 400,
      }),
    };

    const data = await callTogetherWithRetry(payload);
    const reply = data.choices[0].message.content;

    return new Response(JSON.stringify({ reply }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in /api/chat route:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
