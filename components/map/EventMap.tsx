"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import { useEffect, useRef } from "react";
import MarkerPopup from "./MarkerPopup";

import type { EventMarker } from "@/lib/maps/transformEvents";

// Fix default icon issues in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Props {
  events: EventMarker[];
}

export default function EventMap({ events }: Props) {
  const mapRef = useRef<any>(null);

  // Auto-fit map to markers when they load
  useEffect(() => {
    if (!mapRef.current || events.length === 0) return;

    const group = new L.FeatureGroup(
      events.map((ev) => L.marker([ev.lat, ev.lng]))
    );

    mapRef.current.fitBounds(group.getBounds(), {
      padding: [50, 50],
    });
  }, [events]);

  return (
    <MapContainer
      center={[42.3314, -83.0458]} // Detroit default
      zoom={12}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "600px", borderRadius: "10px" }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      <MarkerClusterGroup chunkedLoading>
        {events.map((ev, i) => (
          <Marker key={i} position={[ev.lat, ev.lng]}>
            <Popup>
              <MarkerPopup event={ev} />
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
