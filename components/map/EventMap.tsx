"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { EventMarker } from "@/lib/maps/transformEvents";

interface Props {
  events: EventMarker[];
  savedEvents: any[];
}

export default function EventMap({ events, savedEvents }: Props) {
  const mapRef = useRef<L.Map | null>(null);

  // Fix default Leaflet icon paths
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("events-map", {
        center: [42.3314, -83.0458],
        zoom: 12,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear old layers
    map.eachLayer((layer) => {
      if ((layer as any).options?.attribution) return;
      map.removeLayer(layer);
    });

    // Default icon (API events)
    const defaultIcon = new L.Icon.Default();

    // Custom blue icon for saved events
    const savedIcon = L.icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });

    // Add Ticketmaster markers
    events.forEach((ev) => {
      if (ev.lat && ev.lng) {
        const marker = L.marker([ev.lat, ev.lng], { icon: defaultIcon });
        marker.bindPopup(
          `<b>${ev.title}</b><br>${ev.venue || ""}<br/>
           <a href="${ev.url}" target="_blank">View Event</a>`
        );
        marker.addTo(map);
      }
    });

    // Add saved markers (blue)
    savedEvents.forEach((ev) => {
      if (ev.lat && ev.lng) {
        const marker = L.marker([ev.lat, ev.lng], { icon: savedIcon });
        marker.bindPopup(
          `<b>${ev.title}</b><br>${ev.venue || ""}<br/>
           <a href="${ev.url}" target="_blank">View Saved Event</a>`
        );
        marker.addTo(map);
      }
    });
  }, [events, savedEvents]);

  return (
    <div
      id="events-map"
      style={{
        width: "100%",
        height: "600px",
        borderRadius: "10px",
      }}
    />
  );
}
