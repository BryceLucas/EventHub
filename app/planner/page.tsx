"use client";
import { useEffect, useState } from "react";
import EventCard from "@/components/EventCard";

export default function PlannerPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedEvents");
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  }, []);

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-6">
      <h1 className="text-2xl font-semibold">Planner</h1>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <div className="text-sm text-zinc-400">No saved events yet.</div>
        ) : (
          items.map((e, i) => <EventCard key={e.id ?? i} event={e} />)
        )}
      </div>
    </main>
  );
}
