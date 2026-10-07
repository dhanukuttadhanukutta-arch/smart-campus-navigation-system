import React from "react";

function Events() {
  const events = [
    {
      id: 1,
      title: "College Cultural Events",
      date: "Upcoming",
      location: "College Auditorium",
      description:
        "Cultural programs and activities conducted for students.",
    },
    {
      id: 2,
      title: "Seminar and Workshops",
      date: "Upcoming",
      location: "Seminar Hall",
      description:
        "Educational seminars and technical workshops for students.",
    },
    {
      id: 3,
      title: "Sports Events",
      date: "Upcoming",
      location: "College Ground",
      description:
        "Various sports activities and competitions for students.",
    },
  ];

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1565c0",
          marginBottom: "10px",
        }}
      >
        Campus Events
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        View upcoming events and activities conducted on the campus.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              padding: "20px",
              borderRadius: "12px",
              background: "white",
              border: "1px solid #ddd",
              boxShadow:
                "0 4px 10px rgba(0,0,0,0.1)",
            }}
          >
            <h2
              style={{
                color: "#1565c0",
                marginTop: "0",
              }}
            >
              {event.title}
            </h2>

            <p>
              <b>📅 Date:</b> {event.date}
            </p>

            <p>
              <b>📍 Location:</b> {event.location}
            </p>

            <p>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;