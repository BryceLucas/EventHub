// This component defines the layout structure for the application
// or for a particular section (ex: navbars and footers shared across pages)

// Importing global CSS styles for the application
import "./global.css";
// Importing the Metadata type from Next,js for typing metadata
import type { Metadata } from "next";
// Importing the Inter font from Goofle Fonts via Next.js integration
import { Inter } from "next/font/google";
// Importing the TopNav component for the navigation bar
import TopNav from "@/components/TopNav";

// Initializing the Inter font with a subset for Latin characters
const inter = Inter({ subsets: ["latin"] });

// Exporting metadata for the application, which includes page title and description
export const metadata: Metadata = {
  title: "EventHub", // Title for the application, shown in the browser tab
  description: "Find events, plan, and get AI help.", // Description for search engines and accessibility 
};

// Default export of the RootLayout component, which defines the main structure of the applicaiton
export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // Type definition for children prop, indicating that it can contain any React node
}) {
  return (
    <html lang="en"> {/*Setting the language of the document to English*/}
      <body className={`${inter.className} bg-gradient-to-br from-[#FFCC0D]/50 to-[#BF2669]/50 text-zinc-100 min-h-screen`}>
        {/*Body with applied font and background/text color classes*/}
        <TopNav /> {/*Rendering the TopNav component for navigation */}
        <div
        className="w-full h-2"
        style={{ background: 'linear-gradient(90deg, #FF7326 0%, #702A8C 100%)',}}
        />
        {/* Pages already handle their own containers/margins */}
        {children} {/*Rendering child components (individual pages) passed to this layout*/}
      </body>
    </html>
  );
}
