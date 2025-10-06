export type ChatMsg = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function sendChat(messages: ChatMsg[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error("chat failed");
  return res.json();
}
