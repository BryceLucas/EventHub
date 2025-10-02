import Link from "next/link";

export default function Home() {
  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">
        Discover events with context that matters
      </h1>
      <p className="text-zinc-300">
        Weather, accessibility, distance, and transparent recommendations.
      </p>
      <div className="flex gap-3">
        <Link
          href="/events"
          className="rounded-xl px-4 py-2 bg-zinc-800 hover:bg-zinc-700"
        >
          Browse events
        </Link>
        <Link
          href="/calendar"
          className="rounded-xl px-4 py-2 border border-zinc-700 hover:bg-zinc-800"
        >
          Calendar
        </Link>
      </div>
    </section>
  );
}
