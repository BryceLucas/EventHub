"use client";

import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

type Msg = { role: "user" | "assistant"; content: string };

export default function ChatPanel() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! Ask me anything for Q&A." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({
      top: scrollerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setLoading(true);

    try {
      // Try JSON {reply: string} or {message:string} or raw text fallback.
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      const ct = res.headers.get("content-type") || "";
      let reply = "";

      if (ct.includes("application/json")) {
        const j = await res.json();
        reply = j.reply ?? j.message ?? j.answer ?? JSON.stringify(j);
      } else {
        reply = await res.text();
      }

      setMessages((m) => [
        ...m,
        { role: "assistant", content: reply || "(no response)" },
      ]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: `Error calling /api/chat: ${err?.message ?? String(err)}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border p-3">
      <div className="mb-2 text-sm font-medium">Q&A</div>

      <div
        ref={scrollerRef}
        className="flex-1 overflow-y-auto rounded-lg bg-background/50 p-2 border"
      >
        {messages.map((m, i) => (
          <MessageBubble key={i} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="text-xs text-muted-foreground mt-2">Thinking…</div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Type a question and press Enter…"
          className="min-h-[72px] resize-y rounded-xl border p-3 outline-none"
        />
        <div className="flex justify-end">
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="rounded-xl px-4 py-2 border bg-foreground text-background disabled:opacity-50"
          >
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
