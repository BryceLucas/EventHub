"use client";
import { useEffect, useState } from "react";

type Props = { event: any };

function loadSaved(): any[] {
  try {
    return JSON.parse(localStorage.getItem("savedEvents") || "[]");
  } catch {
    return [];
  }
}
function saveAll(items: any[]) {
  localStorage.setItem("savedEvents", JSON.stringify(items));
}

export default function SaveButton({ event }: Props) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const list = loadSaved();
    setSaved(!!list.find((e) => (e.id ?? "") === (event?.id ?? "")));
  }, [event?.id]);

  function toggle() {
    const list = loadSaved();
    const idx = list.findIndex((e) => (e.id ?? "") === (event?.id ?? ""));
    if (idx >= 0) {
      list.splice(idx, 1);
      setSaved(false);
    } else {
      list.unshift(event);
      setSaved(true);
    }
    saveAll(list);
  }

  return (
    <button
      onClick={toggle}
      className={`rounded-md px-3 py-1.5 border ${
        saved ? "border-green-500 text-green-400" : "border-zinc-700"
      }`}
      title={saved ? "Remove from planner" : "Save to planner"}
    >
      {saved ? "Saved ✓" : "Save"}
    </button>
  );
}
