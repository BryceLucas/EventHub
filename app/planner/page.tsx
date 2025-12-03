/* 
// Component should be rendered on the client side in Next.js
"use client";

// Importing necessary hooks from React
import { useEffect, useState } from "react";
// Importing the EventCard component for rendering events
import EventCard from "@/components/EventCard";

// Main functional component for the Planner Page
export default function PlannerPage() {
  // State to hold the list of events or items, initialized as an empty array
  const [items, setItems] = useState<any[]>([]);

  // useEffect to retrieve saved events from local storage when the component mounts
  useEffect(() => {
    try {
      // Attempt to get the raw data from local storage
      const raw = localStorage.getItem("savedEvents");
      // Parse the JSON data and update the state; if no data, set an empty array
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      // If there's an error (e.g., JSON parsing error), reset items to an empty array
      setItems([]);
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render
 */

//  return (
//    <main className="mx-auto max-w-6xl p-4 md:p-6"> //Main container with centered alignment and padding
//      <h1 className="text-2xl font-semibold">Planner</h1> //HEading for the page
//     <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"> //Grid layout for event cards 
//        {items.length === 0 ? (
//          <div className="text-sm text-zinc-400">No saved events yet.</div> // Message if no events are found
//        ) : (
//          // Mapping over items to render each EventCard component
//         items.map((e, i) => <EventCard key={e.id ?? i} event={e} />)
//        )}
//      </div>
//    </main>
//  );
"use client";

// Importing necessary hooks from React
import { useEffect, useState } from "react";
// Importing the EventCard component for rendering events
import EventCard from "@/components/EventCard";
import PlannerPageUI from "@/components/PlannerPageUI";

// Main functional component for the Planner Page
export default function PlannerPage() {
  // State to hold the list of events or items, initialized as an empty array
  const [items, setItems] = useState<any[]>([]);

  // useEffect to retrieve saved events from local storage when the component mounts
  useEffect(() => {
    try {
      // Attempt to get the raw data from local storage
      const raw = localStorage.getItem("savedEvents");
      // Parse the JSON data and update the state; if no data, set an empty array
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      // If there's an error (e.g., JSON parsing error), reset items to an empty array
      setItems([]);
    }
  }, []); // Empty dependency array means this effect runs only once after the initial render

  // ⬇⬇ REPLACE your original JSX with this: ⬇⬇
  return <PlannerPageUI items={items} />;
}

