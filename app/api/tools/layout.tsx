export const metadata = {
  title: "EventHub",
  description: "Find accessible events with weather & distance context",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased">
        <div className="mx-auto max-w-6xl p-4">
          <header className="flex items-center justify-between py-4">
            <a href="/" className="text-xl font-semibold">
              EventHub
            </a>
            <nav className="flex gap-4 text-sm">
              <a href="/events" className="hover:underline">
                Events
              </a>
              <a href="/calendar" className="hover:underline">
                Calendar
              </a>
              <a href="/assistant" className="hover:underline">
                Assistant
              </a>
            </nav>
          </header>
          <main>{children}</main>
          <footer className="py-8 text-xs text-zinc-400">
            © {new Date().getFullYear()} EventHub
          </footer>
        </div>
      </body>
    </html>
  );
}
