//import React from "react";

// This is a starter UI layout for the Event Planner mockup you shared.
// Replace placeholder boxes with real functionality later.

/*import EventCard from "@/components/EventCard";

export default function PlannerPageUI({ items }: { items: any[] }) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-pink-200 via-orange-200 to-yellow-200 p-6 font-sans">
      

      {/* Divider *//*
      <div className="w-full h-2 bg-purple-700 rounded-full mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section *//*
        <section className="col-span-2 bg-white/60 backdrop-blur-md border-4 border-purple-700 rounded-xl p-4 shadow-xl">
          <h2 className="text-center text-xl font-semibold mb-2">Calendar</h2>

          <div className="bg-gray-200 h-72 rounded-md mb-4"></div>

          {/* Bottom buttons / placeholders *//*
          <div className="grid grid-cols-4 gap-3">
            <div className="h-12 bg-gray-300 rounded-md"></div>
            <div className="h-12 bg-gray-300 rounded-md"></div>
            <div className="h-12 bg-gray-300 rounded-md"></div>
            <div className="h-12 bg-gray-300 rounded-md"></div>
          </div>
        </section>

        {/* Sidebar Saved Events *//*
        <section>
          <div className="bg-white/60 backdrop-blur-md border-4 border-purple-700 rounded-xl p-4 shadow-xl mb-6">
            <h2 className="text-center text-lg font-semibold mb-3">Saved Events</h2>

            {/* Event buttons replaced with EventCard list *//*
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-center text-sm text-gray-600">No saved events.</div>
              ) : (
                items.map((e, i) => (
                  <EventCard key={e.id ?? i} event={e} />
                ))
              )}
            </div>
          </div>

          {/* Event Details *//*
          <div className="bg-white/60 backdrop-blur-md border-4 border-purple-700 rounded-xl p-4 shadow-xl h-40">
            <h2 className="text-center text-lg font-semibold mb-2">Event Details</h2>
            <div className="w-full h-24 bg-gray-200 rounded-md"></div>
          </div>
        </section>
      </div>
    </div>
  );
}
*/
import React from "react";

// This is a starter UI layout for the Event Planner mockup you shared.
// Replace placeholder boxes with real functionality later.

import EventCard from "@/components/EventCard";

export default function PlannerPageUI({ items }: { items: any[] }) {
  return (
    <div className="min-h-screen w-full p-6 font-sans">
      {/* Divider */}
      <div className="w-full h-2 bg-purple-700 rounded-full mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <section className="col-span-2 bg-white/60 backdrop-blur-md border-4 border-purple-700 rounded-xl p-4 shadow-xl">
          <h2 className="text-center text-xl font-semibold mb-2">Calendar</h2>

          <div className="bg-gray-200 h-72 rounded-md mb-4"></div>

          {/* Bottom buttons / placeholders */}
          <div className="grid grid-cols-4 gap-3">
            <div className="h-12 bg-gray-300 rounded-md"></div>
            <div className="h-12 bg-gray-300 rounded-md"></div>
            <div className="h-12 bg-gray-300 rounded-md"></div>
            <div className="h-12 bg-gray-300 rounded-md"></div>
          </div>
        </section>

        {/* Sidebar Saved Events */}
        <section>
          <div className="bg-white/60 backdrop-blur-md border-4 border-purple-700 rounded-xl p-4 shadow-xl mb-6">
            <h2 className="text-center text-lg font-semibold mb-3">Saved Events</h2>

            {/* Event buttons replaced with EventCard list */}
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="text-center text-sm text-gray-600">No saved events.</div>
              ) : (
                items.map((e, i) => (
                  <EventCard key={e.id ?? i} event={e} />
                ))
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="bg-white/60 backdrop-blur-md border-4 border-purple-700 rounded-xl p-4 shadow-xl h-40">
            <h2 className="text-center text-lg font-semibold mb-2">Event Details</h2>
            <div className="w-full h-24 bg-gray-200 rounded-md"></div>
          </div>
        </section>
      </div>
    </div>
  );
}
