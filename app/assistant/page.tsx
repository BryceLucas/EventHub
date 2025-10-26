// Enabling client-side features for this component
"use client";

// Import necessary hooks from React
import { useEffect, useRef, useState } from "react";
// Import types and functions specific to the chat functionality
import type { ChatMsg } from "@/lib/chat-client";
import { sendChat } from "@/lib/chat-client";

// Key for accessing local storage
const STORAGE_KEY = "eventhub-assistant-chat";

// Initial seed messages to establish a default state for the chat
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

// Main Assitant Page component
export default function AssistantPage() {
  // State for storing user input, busy status, and chat messages
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<ChatMsg[]>(SEED);

  // NEW: hydration guard prevents overwriting saved chats on first render
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);

  // Reference for the message list element
  const listRef = useRef<HTMLDivElement | null>(null);

  /* ---------- LOAD from localStorage ONCE (before we allow saving) ---------- */
  useEffect(() => {
    try {
      // Fetch saved chat messages from local storage
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // validate the parsed data
        if (
          Array.isArray(parsed) &&
          parsed.every((m) => m?.role && typeof m?.content === "string")
        ) {
          setMsgs(parsed); // Set the messages if valid
        } else {
          // Reset to seed messages if data is invalid
          setMsgs(SEED);
        }
      } else {
        // If nothing is saved yet → keep SEED
        setMsgs(SEED);
      }
    } catch {
      setMsgs(SEED); // Reset to default if any error occurs
    } finally {
      setLoadedFromStorage(true); // Mark as loaded from storage
    }
  }, []);

  /* ---------- SAVE to localStorage whenever msgs change (but only after load) ---------- */
  useEffect(() => {
    if (!loadedFromStorage) return; // <-- key line: don't save the initial SEED over real history
    try {
      const capped = msgs.slice(-200); // optional cap - limit conversation to the last 200 messages
      localStorage.setItem(STORAGE_KEY, JSON.stringify(capped)); // save messages to local storage
    } catch {
      // ignore errors silently
    }
  }, [msgs, loadedFromStorage]);

  /* ---------- Scroll to bottom on updates ---------- */
  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight, // Scroll to the bottom when new messages arrive
      behavior: "smooth", // Smooth scrolling effect
    });
  }, [msgs, busy]);

  // Function to handle message sending
  async function onSend() {
    const textIn = input.trim(); // Trim the input text
    if (!textIn || busy) return; // Prevent sending empty messages or if busy

    // Update messages with the new user input
    const nextMsgs: ChatMsg[] = [...msgs, { role: "user", content: textIn }];
    setMsgs(nextMsgs); // Set updated messages
    setInput(""); // Clear input field
    setBusy(true); // Set busy status to true

    try {
      // Filter system messages out for the API
      const forApi = nextMsgs.filter((m) => m.role !== "system");
      const data = await sendChat(forApi); // Send chat messages to the API

      // Attempt to parse API response for choices
      const choices = Array.isArray((data as any)?.choices)
        ? (data as any).choices
        : [];
      const first = choices.length > 0 ? choices[0] : undefined;

      // Prepare the response text from the API
      const replyText =
        first?.message?.content ??
        (data as any)?.reply ??
        (data as any)?.message ??
        (typeof data === "string" ? data : JSON.stringify(data));

      // Update messages with the assistant's reply
      setMsgs((prev) => [
        ...prev,
        { role: "assistant", content: replyText || "(no response)" },
      ]);
    } catch (err: any) {
      // Handle errors by notifying the user
      const msg = err?.message ?? "Request failed.";
      setMsgs((prev) => [
        ...prev,
        // Add the error message to the chat
        { role: "assistant", content: `Error: ${msg}` },
      ]);
    } finally {
      setBusy(false); // Reset busy status after handling response or error
    }
  }

  // Function to handle keypress events in the input textarea
  function onKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default newline behavior
      onSend(); // Call the send function
    }
  }

  /* -------------------- Summarize (right column) -------------------- */
  const [sumInput, setSumInput] = useState(""); // State for summarization input
  const [sumBusy, setSumBusy] = useState(false); // State for summarization busy status
  const [summary, setSummary] = useState(""); // State to hold the summary response

  // Function to handle the summarization process
  async function onSummarize() {
    const text = sumInput.trim(); // Trim the input text for summarization
    if (!text || sumBusy) return; // Prevent empty input or when summarizing

    setSumBusy(true); // Set summation busy status to true
    setSummary(""); // Clear previous summary

    try {
      // Send a POST request to the summarize endpoint
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }), // Send the text to summarize
      });

      // Determine the content type of the response
      const ct = res.headers.get("content-type") || "";
      let result = "";
      // Handle JSON response
      if (ct.includes("application/json")) {
        const j = await res.json();
        // Extract summary from response
        result = j.summary ?? j.result ?? JSON.stringify(j);
      } else {
        result = await res.text(); // Hanlde plain text response
      }
      setSummary(result || "(no summary returned)"); // Update summary state
    } catch (e: any) {
      // Handle any erros occurred during the summarizing process
      setSummary(`Error: ${e?.message ?? "request failed"}`);
    } finally {
      setSumBusy(false); // Reset summarization busy status
    }
  }

  return (
    <section className="grid gap-4"> {/*Main section with grid layout*/}
      <div className="flex items-center justify-between"> {/*Header section for Assitant*/}
        <h1 className="text-2xl font-semibold">Assistant</h1> {/*Page title */}

        <button
          onClick={() => {
            try {
              localStorage.removeItem(STORAGE_KEY); // Clear the chat from local storage
            } catch {}
            setMsgs(SEED); // Reset messages to seed
          }}
          className="text-xs text-zinc-400 hover:underline"
          title="Clear saved conversation" // Tooltip for the button
        >
          Clear chat
        </button>
      </div>

      {/* Two columns on desktop, stacked on mobile */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* ---------------- Left: Q&A ---------------- */}
        <div className="flex flex-col gap-4">
          <div
            ref={listRef} // Reference for scrolling
            className="h-[60vh] w-full overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4"
            // Styling for the message container
          >
            <div className="grid gap-3">
              {msgs
                .filter((m) => m.role !== "system") // Filter out system messages
                .map((m, i) => (
                  <div
                    key={i}
                    className={
                      m.role === "user"
                        ? "ml-auto max-w-[80%] rounded-xl bg-zinc-800 px-3 py-2" // User message styling
                        : "max-w-[80%] rounded-xl bg-zinc-700/60 px-3 py-2" // Assistant message styling
                    }
                  >
                    <div className="whitespace-pre-wrap text-sm">
                      {m.content} {/*Display message content*/}
                    </div>
                  </div>
                ))}

              {busy && (
                <div className="max-w-[80%] rounded-xl bg-zinc-700/40 px-3 py-2 text-sm">
                  Thinking…  {/*Indicator for the assistant's processing*/}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end gap-2">
            <textarea
              value={input} // Controlled input field
              onChange={(e) => setInput(e.target.value)} // Update input state on change
              onKeyDown={onKey} // Attach keydown event handler for sending messages
              className="min-h-[44px] flex-1 rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm outline-none focus:border-zinc-600"
              placeholder="Ask something…" // Placeholder text for user input
            />
            <button
              onClick={onSend} // Call onSend function when clicked
              disabled={busy || !input.trim()} // Disable button if busy or input is empty
              className="rounded-xl bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-50"
            >
              Send {/*Button text*/}
            </button>
          </div>
        </div>

        {/* --------------- Right: Summarize --------------- */}
        <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
          <div className="text-sm font-medium">Summarize</div> {/*Summarization section header*/}

          <textarea
            value={sumInput} // Controlled input field for summarization
            onChange={(e) => setSumInput(e.target.value)} // Update state on change
            placeholder="Paste text to summarize…" // Placeholder text for summarization input
            className="min-h-[180px] flex-1 resize-y rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm outline-none focus:border-zinc-600"
          />

          <div className="flex items-center justify-between"> {/*Flex container for summary controls*/}
            <span className="text-xs text-zinc-400">
              {sumInput.trim().length} chars {/*Display character count*/}
            </span>
            <button
              onClick={onSummarize} // Call onSummarize function when clicked
              disabled={sumBusy || !sumInput.trim()} // Disable button if busy or input is empty
              className="rounded-xl bg-zinc-100 px-4 py-2 text-zinc-900 disabled:opacity-50"
            >
              {sumBusy ? "Summarizing…" : "Summarize"} {/*Button text changes based on busy state */}
            </button>
          </div>

          {summary && ( // Conditional rendering of summary content
            <div className="whitespace-pre-wrap rounded-xl border border-zinc-800 bg-zinc-900/60 p-3 text-sm">
              {summary} {/*Display the generated summary*/}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
