"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/map", label: "Map" },
  { href: "/planner", label: "Planner" },
  { href: "/assistant", label: "Assistant" },
];

export default function TopNav() {
  const pathname = usePathname();
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/70 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/40">
      <nav className="mx-auto max-w-6xl flex gap-2 p-3 text-sm">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-1.5 hover:bg-zinc-800/50 ${
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
