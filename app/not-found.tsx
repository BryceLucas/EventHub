// /app/not-found.tsx

// Default export of the NotFound component, which is displayed when a page is not found
export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl p-6"> {/*Main container with centered alignment and a maximum width of 3xl*/}
      <h1 className="text-xl font-semibold">Page not found</h1> {/*Heading indicating the page is missing*/}
      <p className="mt-2 text-sm text-zinc-400"> {/*Paragraph with some top margin, smaller text size, and lighter color*/}
        Try the{" "} {/*Suggestion to the user, using JSX syntax for adding space*/}
        <a className="underline" href="/events"> {/*Link to the Events page with an underline style */}
          Events
        </a>{" "} {/*Clsing tag with added space*/}
        page or ask the{" "} {/*Additional prompt text*/}
        <a className="underline" href="/assistant"> {/*Link to the Assistant page with an underline style*/}
          Assistant
        </a>
        . {/*Closing punctuation for the paragraph*/}
      </p>
    </main>
  );
}
