"use client";

import React, { useState } from "react";

export default function SummarizePanel() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  async function summarize() {
    if (!text.trim()) return;
    setLoading(true);
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

      setSummary(result || "(no summary)");
    } catch (err: any) {
      setSummary(
        `Error calling /api/summarize: ${err?.message ?? String(err)}`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-2xl border p-3">
      <div className="mb-2 text-sm font-medium">Summarize</div>

      <textarea
        placeholder="Paste text or notes to summarize…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="min-h-[160px] flex-1 resize-y rounded-xl border p-3 outline-none"
      />

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {text.trim().length} chars
        </span>
        <button
          onClick={summarize}
          disabled={loading || !text.trim()}
          className="rounded-xl px-4 py-2 border bg-foreground text-background disabled:opacity-50"
        >
          {loading ? "Summarizing…" : "Summarize"}
        </button>
      </div>

      {summary && (
        <div className="mt-3 rounded-xl border bg-background/50 p-3 whitespace-pre-wrap">
          {summary}
        </div>
      )}
    </div>
  );
}
