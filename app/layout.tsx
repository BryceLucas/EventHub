import "./global.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import TopNav from "@/components/TopNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventHub",
  description: "Find events, plan, and get AI help.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100`}>
        <TopNav />
        {/* Pages already handle their own containers/margins */}
        {children}
      </body>
    </html>
  );
}
