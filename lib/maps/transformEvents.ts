export interface EventMarker {
  name: string;
  lat: number;
  lng: number;
  venue?: string;
  date?: string;
  image?: string;
  url?: string;
}

export function transformTicketmaster(data: any): EventMarker[] {
  if (!data._embedded?.events) return [];

  return data._embedded.events
    .filter((ev: any) => ev._embedded?.venues?.[0]?.location)
    .map((event: any) => {
      const venue = event._embedded.venues[0];
      const loc = venue.location;

      return {
        name: event.name,
        lat: parseFloat(loc.latitude),
        lng: parseFloat(loc.longitude),
        venue: venue.name,
        date: event.dates?.start?.localDate,
        url: event.url,
        image: event.images?.[0]?.url,
      };
    });
}
