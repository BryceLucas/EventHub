// /app/page.tsx
export const dynamic = "force-static"; // optional: helps with caching

// Fonts
//import '@fontsource/contrail-one'; // for card text
//import '@fontsource/bowlby-one-sc'; // for navbar links

export default function HomePage() {
  return (
    <main 
      className="mx-auto max-w-6xl p-6 min-h-screen"
      style={{
         // Page background gradient: FFCC0D → BF2669 with 50% opacity
        background:
          "linear-gradient(135deg, rgba(255,204,13,0.5), rgba(191,38,105,0.5))",
      }}
      >
          {/* ---------- Navbar ---------- */}
      <nav className="flex justify-center space-x-8 mb-2">
        {['Home', 'Events', 'Planner', 'Map', 'Assistant'].map((item) => (
          <a
            key={item}
            href={`/${item.toLowerCase() === 'home' ? '' : item.toLowerCase()}`}
            className="text-white text-lg hover:text-orange-400 transition font-['Bowlby_One_SC']"
          >
            {item}
          </a>
        ))}
      </nav>

      {/* ---------- Gradient underline bar ---------- */}
      <div
        className="mx-auto mb-8 rounded-md h-2 max-w-6xl"
        style={{
          background: "linear-gradient(90deg, #FF7326 0%, #702A8C 100%)",
        }}
      />

      {/* ---------- Hero Section with Logo ---------- */}
      <section className="flex justify-between items-center mb-8">
        {/* Left: Title and subtitle */}
        <div className="text-left max-w-xl">
          <h1 className="text-4xl font-semibold tracking-tight">
            Welcome to EventHub
        </h1>
        <p className="mt-2 text-zinc-400 text-sm md:text-base">
          Discover local events, plan your outings, and use AI assistance to
          stay organized.
        </p>
        </div>

         {/* Right: Logo */}
        <div className="ml-4">
          <img
            src="/logo.png" // replace with your logo path
            alt="EventHub Logo"
            className="h-20 w-auto object-contain"
          />
        </div>
      </section>
      
      {/* ---------- Cards Section ---------- */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Events */}
        <a
          href="/events"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition"
        >
          <div className="text-lg font-medium">🎟️ Browse Events</div>
          <p className="text-sm text-zinc-400 mt-1">
            Search by city, date, or type of event. View details and save what
            interests you.
          </p>
        </a>

        {/* Assistant */}
        <a
          href="/assistant"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition"
        >
          <div className="text-lg font-medium">🤖 AI Assistant</div>
          <p className="text-sm text-zinc-400 mt-1">
            Chat with the assistant or summarize event info in seconds.
          </p>
        </a>

        {/* Planner */}
        <a
          href="/planner"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition"
        >
          <div className="text-lg font-medium">🗓️ Event Planner</div>
          <p className="text-sm text-zinc-400 mt-1">
            View and manage your saved events all in one place.
          </p>
        </a>

        {/* Map */}
        <a
          href="/map"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition"
        >
          <div className="text-lg font-medium">🗺️ Map View</div>
          <p className="text-sm text-zinc-400 mt-1">
            See event locations near you with an interactive map (coming soon).
          </p>
        </a>

        {/* Settings */}
        <a
          href="/settings"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition"
        >
          <div className="text-lg font-medium">⚙️ Settings</div>
          <p className="text-sm text-zinc-400 mt-1">
            Adjust default city, search radius, and units for your searches.
          </p>
        </a>

        {/* About */}
        <a
          href="/about"
          className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 hover:bg-zinc-900/60 transition"
        >
          <div className="text-lg font-medium">ℹ️ About</div>
          <p className="text-sm text-zinc-400 mt-1">
            Learn how EventHub brings APIs together to make event discovery
            easy.
          </p>
        </a>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="mt-10 text-center text-xs text-zinc-500">
        <p>
          © {new Date().getFullYear()} EventHub. Built by the EventHub Team.
        </p>
      </footer>
    </main>
  );
}
