// Metadata object containing information about the page for SEO and social sharing
export const metadata = {
  title: "EventHub", // Title of the webpage
  // Description for search engines and previews
  description: "Find accessible events with weather & distance context",
};

// Main layout component for the Root layout of the application
export default function RootLayout({
  children,
}: {
  // Type definiation for children prop, allowing any React nodes
  children: React.ReactNode; 
}) {
  return (
    <html lang="en"> {/*Set the language of the document to English */}
      <body className="min-h-screen bg-zinc-950 text-zinc-100 antialiased"> {/*Main body styling*/}
        <div className="mx-auto max-w-6xl p-4"> {/*Wrapper for centered content with max width*/}
          <header className="flex items-center justify-between py-4"> {/*Header container with flex layout*/}
            <a href="/" className="text-xl font-semibold"> {/*Logo link to homepage*/}
              EventHub
            </a>
            <nav className="flex gap-4 text-sm"> {/*Navigation container with spacing between items*/}
              <a href="/events" className="hover:underline"> {/*Link to events page with hover effect*/}
                Events
              </a>
              <a href="/calendar" className="hover:underline"> {/*Link to calendar page with hover effect*/}
                Calendar
              </a>
              <a href="/assistant" className="hover:underline"> {/*Link to assistant page with hover effect*/}
                Assistant
              </a>
            </nav>
          </header>
          <main>{children}</main> {/*Main content area where child components will render*/}
          <footer className="py-8 text-xs text-zinc-400"> {/*Footer area with styling for text color and size*/}
            © {new Date().getFullYear()} EventHub {/*Display the current year dynamically*/}
          </footer>
        </div>
      </body>
    </html>
  );
}
