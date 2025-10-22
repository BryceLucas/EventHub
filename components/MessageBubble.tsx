"use client";

import React from "react";

type Props = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === "user";
  const tone =
    role === "assistant"
      ? "bg-muted/40 border border-border"
      : isUser
      ? "bg-blue-600 text-white"
      : "bg-zinc-100 text-zinc-700 border";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2 my-1 whitespace-pre-wrap ${tone}`}
      >
        {content}
      </div>
    </div>
  );
}
