import { useEffect, useState } from "react";
import axios from "axios";

function Buildings() {
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/buildings")
      .then((res) => {
        setBuildings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Unable to load campus buildings.");
        setLoading(false);
      });
  }, []);

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
          marginBottom: "10px",
        }}
      >
        Campus Buildings
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Explore buildings and important locations inside the campus.
      </p>

      {loading && (
        <p style={{ textAlign: "center" }}>
          Loading buildings...
        </p>
      )}

      {error && (
        <p
          style={{
            textAlign: "center",
            color: "red",
            fontWeight: "bold",
          }}
        >
          {error}
        </p>
      )}

      {!loading && !error && buildings.length === 0 && (
        <p style={{ textAlign: "center" }}>
          No buildings found.
        </p>
      )}

      {!loading && !error && buildings.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
          }}
        >
          {buildings.map((building) => (
            <div
              key={building._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                background: "white",
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.1)",
              }}
            >
              <h2
                style={{
                  marginTop: "0",
                  color: "#1565c0",
                }}
              >
                {building.name}
              </h2>

              <p>
                <b>Code:</b> {building.code}
              </p>

              <p>
                <b>Description:</b>{" "}
                {building.description}
              </p>

              <p>
                <b>Latitude:</b> {building.latitude}
              </p>

              <p>
                <b>Longitude:</b> {building.longitude}
              </p>

              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps?q=${building.latitude},${building.longitude}`,
                    "_blank"
                  );
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  marginTop: "10px",
                  background: "#1565c0",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                📍 View on Map
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Buildings;