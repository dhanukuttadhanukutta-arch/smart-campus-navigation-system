import React from "react";

function About() {
  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1565c0",
          marginBottom: "15px",
        }}
      >
        About Smart Campus Navigation
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#555",
          marginBottom: "35px",
        }}
      >
        A smart and simple way to navigate inside the college campus.
      </p>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ color: "#1565c0" }}>
          Project Overview
        </h2>

        <p>
          Smart Campus Navigation System is a web-based application
          designed to help students, staff and visitors easily find
          buildings and important locations inside the campus.
        </p>

        <p>
          The system provides an interactive campus map, location
          search, current location detection and route guidance to
          selected campus locations.
        </p>
      </div>

      <div
        style={{
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          marginBottom: "25px",
        }}
      >
        <h2 style={{ color: "#1565c0" }}>
          Technologies Used
        </h2>

        <p>• React.js</p>
        <p>• HTML, CSS and JavaScript</p>
        <p>• Node.js and Express.js</p>
        <p>• MongoDB</p>
        <p>• Leaflet and OpenStreetMap</p>
        <p>• Browser Geolocation</p>
      </div>

      <div
        style={{
          background: "#1565c0",
          color: "white",
          padding: "25px",
          borderRadius: "12px",
          textAlign: "center",
        }}
      >
        <h2>Smart Campus Navigation System</h2>

        <p>
          Developed as a Final Year BCA Project
        </p>

        <p>
          Chikkanna Government Arts College, Tiruppur
        </p>
      </div>
    </div>
  );
}

export default About;