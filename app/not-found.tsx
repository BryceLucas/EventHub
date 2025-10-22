// /app/not-found.tsx
export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Try the{" "}
        <a className="underline" href="/events">
          Events
        </a>{" "}
        page or ask the{" "}
        <a className="underline" href="/assistant">
          Assistant
        </a>
        .
      </p>
    </main>
  );
}
