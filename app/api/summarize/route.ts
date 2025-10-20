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
    const {
      text,
      mode = "short",
      language = "English",
      maxLength = 150,
    } = body;

    const apiKey = process.env.TOGETHER_API_KEY;
    if (!apiKey) {
      return new Response("Missing TOGETHER_API_KEY", { status: 500 });
    }

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

    const prompt = `${modeInstruction} The summary should not exceed ${maxLength} words. Translate the final summary to ${language} if needed.\n\n${text}`;

    const payload = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b",
        messages: [
          {
            role: "system",
            content: "You are a helpful summarization assistant.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.4,
        max_tokens: 400,
      }),
    };

    const data = await callTogetherWithRetry(payload);
    const summary = data.choices[0].message.content;

    return new Response(JSON.stringify({ summary }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error in /api/summarize route:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
