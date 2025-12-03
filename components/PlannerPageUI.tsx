import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import EventCard from "@/components/EventCard";

export default function PlannerPageUI({ items }: { items: any[] }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  return (
    <div className="min-h-screen w-full p-6 font-sans">
      {/* Divider */}
      <div className="w-full h-2 bg-purple-700 rounded-full mb-8"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Section */}
        <section className="col-span-2 bg-white/60 backdrop-blur-md border-4 border-purple-700 rounded-xl p-4 shadow-xl">
          <h2 className="text-center text-xl font-semibold mb-2">Calendar</h2>

          {/* Functional Calendar (replaces placeholder box) */}
          <div className="rounded-md mb-4 h-72 w-full flex items-center justify-center">
            {/* Constrain width so it fits the square; adjust max-w value as needed */}
            <div className="w-full max-w-[420px] h-full">
              <Calendar
                className="w-full h-full"
                onChange={(value) => setSelectedDate(value as Date)}
                value={selectedDate}
              />
            </div>
          </div>



          {/* Show selected date */}
          <p className="text-center text-sm font-medium mb-4">
            Selected Date:{" "}
            <span className="font-semibold">
              {selectedDate?.toLocaleDateString()}
            </span>
          </p>

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
