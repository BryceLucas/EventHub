"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMsg } from "@/lib/chat-client";
import { sendChat } from "@/lib/chat-client";

const STORAGE_KEY = "eventhub-assistant-chat";

const SEED: ChatMsg[] = [
  {
    role: "system",
    content: "You are EventHub Assistant. Be concise and helpful.",
  },
  {
    role: "assistant",
    content: "Hi! Ask me about events, weather, or planning.",
  },
];

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>(SEED);

  // NEW: hydration guard prevents overwriting saved chats on first render
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  const listRef = useRef<HTMLDivElement | null>(null);

  /* ---------- LOAD from localStorage ONCE (before we allow saving) ---------- */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (
          Array.isArray(parsed) &&
          parsed.every((m) => m?.role && typeof m?.content === "string")
        ) {
          setMsgs(parsed);
        } else {
          // if bad data, reset to SEED
          setMsgs(SEED);
        }
      } else {
        // nothing saved yet → keep SEED
        setMsgs(SEED);
      }
    } catch {
      setMsgs(SEED);
    } finally {
      setLoadedFromStorage(true);
    }
  }, []);

  /* ---------- SAVE to localStorage whenever msgs change (but only after load) ---------- */
  useEffect(() => {
    if (!loadedFromStorage) return; // <-- key line: don't save the initial SEED over real history
    try {
      const capped = msgs.slice(-200); // optional cap
      localStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
    } catch {
      // ignore
    }
  }, [msgs, loadedFromStorage]);

  /* ---------- Scroll to bottom on updates ---------- */
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, busy]);

  async function onSend() {
    const textIn = input.trim();
    if (!textIn || busy) return;

    const nextMsgs: ChatMsg[] = [...msgs, { role: "user", content: textIn }];
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

      const replyText =
        first?.message?.content ??
        (data as any)?.reply ??
        (data as any)?.message ??
        (typeof data === "string" ? data : JSON.stringify(data));

      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: replyText || "(no response)" },
      ]);
    } catch (err: any) {
      const msg = err?.message ?? "Request failed.";
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${msg}` },
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

  /* -------------------- Summarize (right column) -------------------- */
  const [sumInput, setSumInput] = useState("");
  const [sumBusy, setSumBusy] = useState(false);
  const [summary, setSummary] = useState("");

  async function onSummarize() {
    const text = sumInput.trim();
    if (!text || sumBusy) return;

    setSumBusy(true);
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const ct = res.headers.get("content-type") || "";
      let result = "";
      if (ct.includes("application/json")) {
        const j = await res.json();
        result = j.summary ?? j.result ?? JSON.stringify(j);
      } else {
        result = await res.text();
      }
      setSummary(result || "(no summary returned)");
    } catch (e: any) {
      setSummary(`Error: ${e?.message ?? "request failed"}`);
    } finally {
      setSumBusy(false);
    }
  }

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Assistant</h1>

        <button
          onClick={() => {
            try {
              localStorage.removeItem(STORAGE_KEY);
            } catch {}
            setMsgs(SEED);
          }}
          className="text-xs text-zinc-400 hover:underline"
          title="Clear saved conversation"
        >
          Clear chat
        </button>
      </div>

      {/* Two columns on desktop, stacked on mobile */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* ---------------- Left: Q&A ---------------- */}
        <div className="flex flex-col gap-4">
          <div
            ref={listRef}
            className="h-[60vh] w-full overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
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
                    <div className="whitespace-pre-wrap text-sm">
                      {m.content}
                    </div>
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
        </div>

        {/* --------------- Right: Summarize --------------- */}
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-sm font-medium">Summarize</div>

          <textarea
            value={sumInput}
            onChange={(e) => setSumInput(e.target.value)}
            placeholder="Paste text to summarize…"
            className="min-h-[180px] flex-1 resize-y rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm outline-none focus:border-zinc-600"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              {sumInput.trim().length} chars
            </span>
            <button
              onClick={onSummarize}
              disabled={sumBusy || !sumInput.trim()}
              className="rounded-xl bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-50"
            >
              {sumBusy ? "Summarizing…" : "Summarize"}
            </button>
          </div>

          {summary && (
            <div className="whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm">
              {summary}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
