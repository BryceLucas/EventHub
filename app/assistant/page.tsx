"use client"; // Compnent for client-side rendering

// Imports needed React hooks
import { useEffect, useRef, useState } from "react";
// Typescript type for chat messages
import type { ChatMsg } from "@/lib/chat-client";
// Function to send chat messages to backend
import { sendChat } from "@/lib/chat-client";

export default function AssistantPage() {
  /* -------------------- Q&A (left column) -------------------- */
  // State variables for managing input and messages
  const [input, setInput] = useState("");  // user input for chat
  const [busy, setBusy] = useState(false);  // indicates if assistant is busy
  const [msgs, setMsgs] = useState<ChatMsg[]>([  // initial messages array
    {
      role: "system",
      content: "You are EventHub Assistant. Be concise and helpful.",
    },
    {
      role: "assistant",
      content: "Hi! Ask me about events, weather, or planning.",
    },
  ]);
  // Ref for message list
  const listRef = useRef<HTMLDivElement | null>(null);

  // Scrolls to the bottom of the message list whenever message changes or assistant is busy
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [msgs, busy]);

  // Function to send user message
  async function onSend() {
    const textIn = input.trim(); // trims whitespace
    if (!textIn || busy) return;  // prevent sending empty message while busy

    // prepare new message array
    const nextMsgs: ChatMsg[] = [...msgs, { role: "user", content: textIn }];
    setMsgs(nextMsgs);  // update message state
    setInput("");  // clear input
    setBusy(true);  // set a busy state

    try {
      // Your helper posts to /api/chat
      const forApi = nextMsgs.filter((m) => m.role !== "system");  // filter system messages
      const data = await sendChat(forApi);  // send the chat data to the server

      // Tolerate many shapes: OpenAI-style, {reply}, {message}, raw text
      const choices = Array.isArray((data as any)?.choices) // handle various response forms
        ? (data as any).choices
        : [];
      const first = choices.length > 0 ? choices[0] : undefined;

      const replyText =
        first?.message?.content ??
        (data as any)?.reply ??
        (data as any)?.message ??
        (typeof data === "string" ? data : JSON.stringify(data)); // extract reply text

      setMsgs((prev) => [
        ...prev,
        // update message with assistant's reply
        { role: "assistant", content: replyText || "(no response)" },
      ]);
    } catch (err: any) {
      const msg = err?.message ?? "Request failed.";  // error handling
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${msg}` },  // show error message
      ]);
    } finally {
      setBusy(false);  // reset busy state
    }
  }

  // handles sending message with Enter key
  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  /* -------------------- Summarize (right column) -------------------- */
  const [sumInput, setSumInput] = useState("");  // state for summarization input
  const [sumBusy, setSumBusy] = useState(false);  // indicates if summarization is in progress
  const [summary, setSummary] = useState("");  // holds generated summary

  // function to send text for summarization
  async function onSummarize() {
    const text = sumInput.trim();  // trims input text
    if (!text || sumBusy) return;  // prevent summarizing empty text or while busy

    setSumBusy(true); // set summarization busy state
    setSummary(""); // reset summary

    try {
      // sending text for summarization to the backend
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const ct = res.headers.get("content-type") || "";
      let result = "";
      // handking JSON and text responses
      if (ct.includes("application/json")) {
        const j = await res.json();
        result = j.summary ?? j.result ?? JSON.stringify(j);
      } else {
        result = await res.text(); // handle raw text response
      }
      setSummary(result || "(no summary returned)"); // update summary state
    } catch (e: any) {
      setSummary(`Error: ${e?.message ?? "request failed"}`); // handle errors during summarization
    } finally {
      setSumBusy(false); // reset busy state for summarization
    }
  }

  /* ------------------------------ UI ------------------------------ */
  // render the main UI of the AssistantPage compenent
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-semibold">Assistant</h1>

      {/* Two columns on desktop, stacked on mobile */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* ---------------- Left: Q&A ---------------- */}
        <div className="flex flex-col gap-4">
          <div
            ref={listRef} // reference for scrolling
            className="h-[60vh] w-full overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
          >
            <div className="grid gap-3">
              {/*map through the messages and display them */}
              {msgs
                .filter((m) => m.role !== "system") // filter out system messages for display
                .map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user" // conditional styling based on message role
                        ? "ml-auto max-w-[80%] rounded-xl bg-zinc-800 px-3 py-2"
                        : "max-w-[80%] rounded-xl bg-zinc-700/60 px-3 py-2"
                    }
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {m.content} {/*display message content */}
                    </div>
                  </div>
                ))}

              {busy && (
                <div className="max-w-[80%] rounded-xl bg-zinc-700/40 px-3 py-2 text-sm">
                  Thinking…  {/*indicate that the assistant is processing */}
                </div>
              )}
            </div>
          </div>

          {/*input area for user message */}
          <div className="flex items-end gap-2">
            <textarea
              value={input}  //controlled input
              onChange={(e) => setInput(e.target.value)} // update input state
              onKeyDown={onKey} // handle key press
              className="min-h-[44px] flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm outline-none focus:border-zinc-600"
              placeholder="Ask something…"
            />
            <button
              onClick={onSend} // send button action
              disabled={busy || !input.trim()} // disable if busy or input is empty
              className="rounded-xl bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>

        {/* --------------- Right: Summarize --------------- */}
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-sm font-medium">Summarize</div>

          {/*input area for text to summarize */}
          <textarea
            value={sumInput} // controlled input for summary
            onChange={(e) => setSumInput(e.target.value)} // update summary input state
            placeholder="Paste text to summarize…"
            className="min-h-[180px] flex-1 resize-y rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm outline-none focus:border-zinc-600"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              {sumInput.trim().length} chars {/*display character count */}
            </span>
            <button
              onClick={onSummarize} // summarize button action
              disabled={sumBusy || !sumInput.trim()} // disable if busy or input is empty
              className="rounded-xl bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-50"
            >
              {sumBusy ? "Summarizing…" : "Summarize"} {/*conditional button text */}
            </button>
          </div>

          {/*display the summary result */}
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
