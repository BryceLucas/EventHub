// Import the Link component from Next.js for client-side navigation
import Link from "next/link";

// Default function component for the Home page
export default function Home() {
  return (
    <section className="grid gap-6"> {/*Container using CSS grid with defined spacing*/}
      <h1 className="text-3xl font-bold"> {/*Main heading with specific text size and weight*/}
        Discover events with context that matters
      </h1>
      <p className="text-zinc-300"> {/*Paragraph with a softer text color*/}
        Weather, accessibility, distance, and transparent recommendations.
      </p>
      <div className="flex gap-3"> {/*Flex container to align links with spacing*/}
        <Link
          href="/events"
          className="rounded-xl px-4 py-2 bg-zinc-800 hover:bg-zinc-700"
          // Button styles with hover effect
        >
          Browse events {/*Text for the first link*/}
        </Link>
        <Link
          href="/calendar"
          className="rounded-xl px-4 py-2 border border-zinc-700 hover:bg-zinc-800"
          // Button styles with border and hover effect
        >
          Calendar {/*Text for the second link*/}
        </Link>
      </div>
    </section>
  );
}
