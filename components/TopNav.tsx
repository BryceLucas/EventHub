"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/events/browse", label: "Browse Events" },
  { href: "/events", label: "Map" },
  { href: "/planner", label: "Planner" },
  { href: "/assistant", label: "Assistant" },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/40">
      <nav className="mx-auto max-w-6xl flex justify-between px-6 p-3 text-sm">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-1.5 text-zinc-100 hover:bg-zinc-800/50 ${
                active ? "bg-zinc-800/70 font-medium" : ""
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
