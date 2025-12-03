// /app/page.tsx
export const dynamic = "force-static"; // optional: helps with caching

// Fonts
import "@fontsource/contrail-one"; // for card text
//import '@fontsource/bowlby-one-sc'; // for navbar links

export default function HomePage() {
  return (
    <main 
      className="min-h-screen flex flex-col p-6 max-w-6xl mx-auto">

      {/* ---------- Hero Section with Logo ---------- */}
      <section className="flex flex-col md:flex-row mb-12 min-h-[30vh] px-4 md:px-0">
      {/* Logo first on small screens, right on large screens */}
      <div className="flex-shrink-0 mb-4 md:mb-0 md:ml-6 order-1 md:order-2">
        <img
          src="/logo.png"
          alt="EventHub Logo"
          className="h-20 w-auto object-contain"
        />
      </div>

      {/* Title + Subtitle */}
      <div className="flex flex-col justify-end text-left max-w-full md:max-w-md order-2 md:order-1 flex-grow">
        <h1
          className="text-5xl font-normal text-black"
          style={{ fontFamily: '"Contrail One", sans-serif' }}
        >
          EventHub
        </h1>
        <p className="mt-2 text-lg text-black md:whitespace-nowrap">
          Discover local events, plan your outings, and use AI assistance to stay organized.
        </p>
      </div>
    </section>
      
      {/* ---------- Cards Section ---------- */}
      <div className="mb-12"> {/* adds space below the grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Events */}
        <a
          href="/events"
          className="rounded-2xl p-5 transition"
          style={{
            background: "linear-gradient(135deg, #FFCC0D66 0%, #FF194D66 40%)",
            boxShadow: "-12px 12px 6px rgba(68, 2, 94, 0.5)",
            border: "4px solid black",
            fontFamily: '"Contrail One", sans-serif',
          }}
        >
          <div className="text-lg font-medium text-black">🎟️ Browse Events</div>
          <p className="text-sm text-black mt-1">
            Search by city, date, or type of event. View details and save what interests you.
          </p>
        </a>

        {/* Assistant */}
        <a
          href="/assistant"
          className="rounded-2xl p-5 transition"
          style={{
            background: "linear-gradient(135deg, #FFCC0D66 0%, #FF194D66 40%)",
            boxShadow: "-12px 12px 6px rgba(68, 2, 94, 0.5)",
            border: "4px solid black",
            fontFamily: '"Contrail One", sans-serif',
          }}
        >
          <div className="text-lg font-medium text-black">🤖 AI Assistant</div>
          <p className="text-sm text-black mt-1">
            Chat with the assistant or summarize event info in seconds.
          </p>
        </a>

        {/* Planner */}
        <a
          href="/planner"
          className="rounded-2xl p-5 transition"
          style={{
            background: "linear-gradient(135deg, #FFCC0D66 0%, #FF194D66 40%)",
            boxShadow: "-12px 12px 6px rgba(68, 2, 94, 0.5)",
            border: "4px solid black",
            fontFamily: '"Contrail One", sans-serif',
          }}
        >
          <div className="text-lg font-medium text-black">🗓️ Event Planner</div>
          <p className="text-sm text-black mt-1">
            View and manage your saved events all in one place.
          </p>
        </a>

        {/* Map */}
        <a
          href="/map"
          className="rounded-2xl p-5 transition"
          style={{
            background: "linear-gradient(135deg, #FFCC0D66 0%, #FF194D66 40%)",
            boxShadow: "-12px 12px 6px rgba(68, 2, 94, 0.5)",
            border: "4px solid black",
            fontFamily: '"Contrail One", sans-serif',
          }}
        >
          <div className="text-lg font-medium text-black">🗺️ Map View</div>
          <p className="text-sm text-black mt-1">
            See event locations near you with an interactive map (coming soon).
          </p>
        </a>

        {/* Settings */}
        <a
          href="/settings"
          className="rounded-2xl p-5 transition"
          style={{
            background: "linear-gradient(135deg, #FFCC0D66 0%, #FF194D66 40%)",
            boxShadow: "-12px 12px 6px rgba(68, 2, 94, 0.5)",
            border: "4px solid black",
            fontFamily: '"Contrail One", sans-serif',
          }}
        >
          <div className="text-lg font-medium text-black">⚙️ Settings</div>
          <p className="text-sm text-black mt-1">
            Adjust default city, search radius, and units for your searches.
          </p>
        </a>

        {/* About */}
        <a
          href="/about"
          className="rounded-2xl p-5 transition"
          style={{
            background: "linear-gradient(135deg, #FFCC0D66 0%, #FF194D66 40%)",
            boxShadow: "-12px 12px 6px rgba(68, 2, 94, 0.5)",
            border: "4px solid black",
            fontFamily: '"Contrail One", sans-serif',
          }}
        >
          <div className="text-lg font-medium text-black">ℹ️ About</div>
          <p className="text-sm text-black mt-1">
            Learn how EventHub brings APIs together to make event discovery easy.
          </p>
        </a>
      </section>
      </div>


      {/* ---------- Footer ---------- */}
      <footer className="mt-10 text-center text-xs text-black">
        <p>
          © {new Date().getFullYear()} EventHub. Built by the EventHub Team.
        </p>
      </footer>
    </main>
  );
}
