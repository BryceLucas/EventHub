import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const messages = Array.isArray(body?.messages) ? body.messages : [];
  const apiKey = process.env.TOGETHER_API_KEY || "";
  if (!apiKey) return new Response("Missing TOGETHER_API_KEY", { status: 500 });

  const resp = await fetch("https://api.together.xyz/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages,
      temperature: 0.4,
      max_tokens: 512,
    }),
  });

  if (!resp.ok) return new Response("Upstream error", { status: 502 });
  const data = await resp.json();
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
