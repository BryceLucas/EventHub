"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMsg } from "@/lib/chat-client";
import { sendChat } from "@/lib/chat-client";

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      role: "system",
      content: "You are EventHub Assistant. Be concise and helpful.",
    },
    {
      role: "assistant",
      content: "Hi! Ask me about events, weather, or planning.",
    },
  ]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs]);

  async function onSend() {
    if (!input.trim() || busy) return;
    const nextMsgs = [
      ...msgs,
      { role: "user", content: input.trim() } as ChatMsg,
    ];
    setMsgs(nextMsgs);
    setInput("");
    setBusy(true);
    try {
      const forApi = nextMsgs.filter((m) => m.role !== "system");
      const data = await sendChat(forApi);
      const choices = Array.isArray((data as any)?.choices)
        ? (data as any).choices
        : [];
      const first = choices.length > 0 ? choices[0] : undefined;
      const text = first?.message?.content ?? "";
      setMsgs((prev) => [...prev, { role: "assistant", content: text }]);
    } catch {
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: "Request failed." },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">Assistant</h1>
      <div
        ref={listRef}
        className="h-[60vh] w-full overflow-y-auto rounded-2xl border border-zinc-800 p-4 bg-zinc-900/40"
      >
        <div className="grid gap-3">
          {msgs
            .filter((m) => m.role !== "system")
            .map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[80%] rounded-xl bg-zinc-800 px-3 py-2"
                    : "max-w-[80%] rounded-xl bg-zinc-700/60 px-3 py-2"
                }
              >
                <div className="whitespace-pre-wrap text-sm">{m.content}</div>
              </div>
            ))}
          {busy && (
            <div className="max-w-[80%] rounded-xl bg-zinc-700/40 px-3 py-2 text-sm">
              Thinking…
            </div>
          )}
        </div>
      </div>
      <div className="flex items-end gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          className="min-h-[44px] flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm outline-none focus:border-zinc-600"
          placeholder="Ask something…"
        />
        <button
          onClick={onSend}
          disabled={busy || !input.trim()}
          className="rounded-xl bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </section>
  );
}
