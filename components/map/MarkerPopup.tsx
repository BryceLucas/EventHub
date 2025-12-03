interface Props {
  event: {
    name: string;
    venue?: string;
    date?: string;
    image?: string;
    url?: string;
  };
}

export default function MarkerPopup({ event }: Props) {
  return (
    <div style={{ minWidth: 180 }}>
      <strong style={{ fontSize: "15px" }}>{event.name}</strong>
      <br />

      {event.venue && <div>📍 {event.venue}</div>}
      {event.date && <div>📅 {event.date}</div>}

      {event.image && (
        <img
          src={event.image}
          alt="event"
          style={{
            width: "100%",
            height: "auto",
            marginTop: "8px",
            borderRadius: "6px",
          }}
        />
      )}

      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            marginTop: "6px",
            color: "#3b82f6",
            fontSize: "14px",
          }}
        >
          View Event →
        </a>
      )}
    </div>
  );
}
