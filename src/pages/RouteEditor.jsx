import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// --------------------------------------------------
// ROUTE POINT ICON
// --------------------------------------------------

const createPointIcon = (number) =>
  L.divIcon({
    className: "route-point-marker",

    html: `
      <div style="
        width:30px;
        height:30px;
        background:#e53935;
        color:white;
        border:3px solid white;
        border-radius:50%;
        box-shadow:0 2px 7px rgba(0,0,0,0.45);
        display:flex;
        align-items:center;
        justify-content:center;
        font-weight:bold;
        font-size:12px;
      ">
        ${number}
      </div>
    `,

    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });

// --------------------------------------------------
// MAP CLICK
// --------------------------------------------------

function MapClickHandler({ onAddPoint }) {
  useMapEvents({
    click: (event) => {
      onAddPoint([
        event.latlng.lat,
        event.latlng.lng,
      ]);
    },
  });

  return null;
}

// --------------------------------------------------
// ROUTE EDITOR
// --------------------------------------------------

function RouteEditor() {
  const [points, setPoints] = useState([]);
  const [connections, setConnections] = useState([]);

  const [startPoint, setStartPoint] = useState("");
  const [endPoint, setEndPoint] = useState("");

  // ------------------------------------------------
  // LOAD SAVED DATA
  // ------------------------------------------------

  useEffect(() => {
    const savedPoints =
      localStorage.getItem("campusRoutePoints");

    const savedConnections =
      localStorage.getItem(
        "campusRouteConnections"
      );

    if (savedPoints) {
      try {
        setPoints(JSON.parse(savedPoints));
      } catch (error) {
        console.log(
          "Unable to load route points."
        );
      }
    }

    if (savedConnections) {
      try {
        setConnections(
          JSON.parse(savedConnections)
        );
      } catch (error) {
        console.log(
          "Unable to load connections."
        );
      }
    }
  }, []);

  // ------------------------------------------------
  // ADD POINT
  // ------------------------------------------------

  const handleAddPoint = (position) => {
    const newPoint = {
      id: Date.now(),
      name: `P${points.length + 1}`,
      position: position,
    };

    const updatedPoints = [
      ...points,
      newPoint,
    ];

    setPoints(updatedPoints);

    localStorage.setItem(
      "campusRoutePoints",
      JSON.stringify(updatedPoints)
    );
  };

  // ------------------------------------------------
  // ADD CONNECTION
  // ------------------------------------------------

  const addConnection = () => {
    if (!startPoint || !endPoint) {
      alert(
        "Please select both start and end points."
      );
      return;
    }

    if (startPoint === endPoint) {
      alert(
        "Start and end point cannot be same."
      );
      return;
    }

    const alreadyExists =
      connections.some(
        (connection) =>
          (connection.from === startPoint &&
            connection.to === endPoint) ||
          (connection.from === endPoint &&
            connection.to === startPoint)
      );

    if (alreadyExists) {
      alert(
        "This connection already exists."
      );
      return;
    }

    const newConnection = {
      id: Date.now(),
      from: startPoint,
      to: endPoint,
      blocked: false,
    };

    const updatedConnections = [
      ...connections,
      newConnection,
    ];

    setConnections(updatedConnections);

    localStorage.setItem(
      "campusRouteConnections",
      JSON.stringify(
        updatedConnections
      )
    );

    setStartPoint("");
    setEndPoint("");
  };

  // ------------------------------------------------
  // DELETE LAST POINT
  // ------------------------------------------------

  const deleteLastPoint = () => {
    if (points.length === 0) return;

    const lastPoint =
      points[points.length - 1];

    const updatedPoints =
      points.slice(0, -1);

    const renamedPoints =
      updatedPoints.map(
        (point, index) => ({
          ...point,
          name: `P${index + 1}`,
        })
      );

    const updatedConnections =
      connections.filter(
        (connection) =>
          connection.from !==
            lastPoint.name &&
          connection.to !==
            lastPoint.name
      );

    setPoints(renamedPoints);
    setConnections(
      updatedConnections
    );

    localStorage.setItem(
      "campusRoutePoints",
      JSON.stringify(
        renamedPoints
      )
    );

    localStorage.setItem(
      "campusRouteConnections",
      JSON.stringify(
        updatedConnections
      )
    );
  };

  // ------------------------------------------------
  // DELETE CONNECTION
  // ------------------------------------------------

  const deleteConnection = (
    connectionId
  ) => {
    const updatedConnections =
      connections.filter(
        (connection) =>
          connection.id !==
          connectionId
      );

    setConnections(
      updatedConnections
    );

    localStorage.setItem(
      "campusRouteConnections",
      JSON.stringify(
        updatedConnections
      )
    );
  };

  // ------------------------------------------------
  // BLOCK / UNBLOCK CONNECTION
  // ------------------------------------------------

  const toggleBlocked = (
    connectionId
  ) => {
    const updatedConnections =
      connections.map(
        (connection) =>
          connection.id ===
          connectionId
            ? {
                ...connection,
                blocked:
                  !connection.blocked,
              }
            : connection
      );

    setConnections(
      updatedConnections
    );

    localStorage.setItem(
      "campusRouteConnections",
      JSON.stringify(
        updatedConnections
      )
    );
  };

  // ------------------------------------------------
  // CLEAR EVERYTHING
  // ------------------------------------------------

  const clearAll = () => {
    const confirmClear =
      window.confirm(
        "Clear all route points and connections?"
      );

    if (!confirmClear) return;

    setPoints([]);
    setConnections([]);

    localStorage.removeItem(
      "campusRoutePoints"
    );

    localStorage.removeItem(
      "campusRouteConnections"
    );
  };

  // ------------------------------------------------
  // COPY ROUTE DATA
  // ------------------------------------------------

  const copyRouteData = () => {
    const pointText =
      points
        .map(
          (point) =>
            `${point.name}: [${point.position[0]}, ${point.position[1]}]`
        )
        .join("\n");

    const connectionText =
      connections
        .map(
          (connection) =>
            `${connection.from} -> ${connection.to}${
              connection.blocked
                ? " [BLOCKED]"
                : ""
            }`
        )
        .join("\n");

    const finalText =
      `ROUTE POINTS\n\n${pointText}\n\nROUTE CONNECTIONS\n\n${connectionText}`;

    navigator.clipboard.writeText(
      finalText
    );

    alert(
      "Route data copied!"
    );
  };

  // ------------------------------------------------
  // GET POINT BY NAME
  // ------------------------------------------------

  const getPoint = (name) => {
    return points.find(
      (point) =>
        point.name === name
    );
  };

  // ------------------------------------------------
  // BUILD CONNECTION LINES
  // ------------------------------------------------

  const connectionLines =
    connections
      .map((connection) => {
        const from = getPoint(
          connection.from
        );

        const to = getPoint(
          connection.to
        );

        if (!from || !to) {
          return null;
        }

        return {
          ...connection,
          positions: [
            from.position,
            to.position,
          ],
        };
      })
      .filter(Boolean);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1565c0",
          marginBottom: "5px",
        }}
      >
        🛠️ Campus Route Editor
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#555",
        }}
      >
        Create campus roads and multiple
        navigation paths.
      </p>

      <div
        style={{
          maxWidth: "1250px",
          margin: "0 auto",
          display: "flex",
          gap: "15px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* MAP */}

        <div
          style={{
            flex: "1 1 700px",
            minWidth: "0",
          }}
        >
          <MapContainer
            center={[
              11.1084,
              77.3197,
            ]}
            zoom={20}
            style={{
              height: "650px",
              width: "100%",
              borderRadius: "12px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.2)",
            }}
          >
            <TileLayer
              attribution="&copy; Esri, Maxar, Earthstar Geographics"
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />

            <MapClickHandler
              onAddPoint={
                handleAddPoint
              }
            />

            {/* CONNECTION LINES */}

            {connectionLines.map(
              (connection) => (
                <Polyline
                  key={
                    connection.id
                  }
                  positions={
                    connection.positions
                  }
                  pathOptions={{
                    color:
                      connection.blocked
                        ? "#e53935"
                        : "#1565c0",

                    weight: 5,

                    opacity:
                      connection.blocked
                        ? 0.8
                        : 0.9,

                    dashArray:
                      connection.blocked
                        ? "10, 10"
                        : null,
                  }}
                >
                  <Popup>
                    <b>
                      {connection.from}
                      {" → "}
                      {connection.to}
                    </b>

                    <br />

                    {connection.blocked
                      ? "🚧 Road Blocked"
                      : "✅ Road Open"}
                  </Popup>
                </Polyline>
              )
            )}

            {/* POINT MARKERS */}

            {points.map(
              (point, index) => (
                <Marker
                  key={point.id}
                  position={
                    point.position
                  }
                  icon={createPointIcon(
                    index + 1
                  )}
                >
                  <Popup>
                    <b>
                      {point.name}
                    </b>

                    <br />

                    Latitude:{" "}
                    {
                      point.position[0]
                    }

                    <br />

                    Longitude:{" "}
                    {
                      point.position[1]
                    }
                  </Popup>
                </Marker>
              )
            )}
          </MapContainer>
        </div>

        {/* CONTROL PANEL */}

        <div
          style={{
            width: "330px",
            maxWidth: "100%",
            background: "white",
            borderRadius: "12px",
            padding: "20px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.15)",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              marginTop: "0",
              color: "#1565c0",
            }}
          >
            🔗 Route Connections
          </h2>

          <p
            style={{
              fontSize: "13px",
              color: "#666",
              lineHeight: "1.5",
            }}
          >
            Select two nearby route points
            to create a campus road.
          </p>

          {/* START POINT */}

          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Start Point
          </label>

          <select
            value={startPoint}
            onChange={(e) =>
              setStartPoint(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "9px",
              marginBottom: "12px",
              borderRadius: "6px",
              border:
                "1px solid #ccc",
            }}
          >
            <option value="">
              Select start point
            </option>

            {points.map(
              (point) => (
                <option
                  key={point.id}
                  value={point.name}
                >
                  {point.name}
                </option>
              )
            )}
          </select>

          {/* END POINT */}

          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            End Point
          </label>

          <select
            value={endPoint}
            onChange={(e) =>
              setEndPoint(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding: "9px",
              marginBottom: "12px",
              borderRadius: "6px",
              border:
                "1px solid #ccc",
            }}
          >
            <option value="">
              Select end point
            </option>

            {points.map(
              (point) => (
                <option
                  key={point.id}
                  value={point.name}
                >
                  {point.name}
                </option>
              )
            )}
          </select>

          <button
            onClick={
              addConnection
            }
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "18px",
              border: "none",
              borderRadius: "7px",
              background:
                "#1565c0",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ➕ Add Road Connection
          </button>

          {/* CONNECTION LIST */}

          <h3
            style={{
              color: "#333",
            }}
          >
            🛣️ Existing Roads
          </h3>

          <div
            style={{
              maxHeight: "250px",
              overflowY: "auto",
            }}
          >
            {connections.length ===
              0 && (
              <p
                style={{
                  color: "#777",
                  fontSize: "13px",
                }}
              >
                No connections yet.
              </p>
            )}

            {connections.map(
              (connection) => (
                <div
                  key={
                    connection.id
                  }
                  style={{
                    padding: "10px",
                    marginBottom: "8px",
                    borderRadius: "8px",
                    background:
                      connection.blocked
                        ? "#ffebee"
                        : "#f5f9ff",
                    border:
                      connection.blocked
                        ? "1px solid #ef9a9a"
                        : "1px solid #bbdefb",
                  }}
                >
                  <b
                    style={{
                      color:
                        connection.blocked
                          ? "#c62828"
                          : "#1565c0",
                    }}
                  >
                    {connection.from}
                    {" → "}
                    {connection.to}
                  </b>

                  <div
                    style={{
                      fontSize: "12px",
                      marginTop: "5px",
                    }}
                  >
                    {connection.blocked
                      ? "🚧 Blocked"
                      : "✅ Open"}
                  </div>

                  <button
                    onClick={() =>
                      toggleBlocked(
                        connection.id
                      )
                    }
                    style={{
                      marginTop: "7px",
                      marginRight: "5px",
                      padding:
                        "5px 8px",
                      border: "none",
                      borderRadius:
                        "5px",
                      background:
                        connection.blocked
                          ? "#43a047"
                          : "#ff9800",
                      color: "white",
                      cursor:
                        "pointer",
                    }}
                  >
                    {connection.blocked
                      ? "✅ Open"
                      : "🚧 Block"}
                  </button>

                  <button
                    onClick={() =>
                      deleteConnection(
                        connection.id
                      )
                    }
                    style={{
                      padding:
                        "5px 8px",
                      border: "none",
                      borderRadius:
                        "5px",
                      background:
                        "#d32f2f",
                      color: "white",
                      cursor:
                        "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              )
            )}
          </div>

          {/* POINT COUNT */}

          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background:
                "#e3f2fd",
              borderRadius: "8px",
              color: "#1565c0",
              fontWeight: "bold",
            }}
          >
            📍 Points:{" "}
            {points.length}
            <br />
            🛣️ Roads:{" "}
            {connections.length}
          </div>

          {/* ACTION BUTTONS */}

          <button
            onClick={
              deleteLastPoint
            }
            disabled={
              points.length === 0
            }
            style={{
              width: "100%",
              padding: "9px",
              marginTop: "10px",
              border: "none",
              borderRadius: "7px",
              background:
                "#757575",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            ↩️ Delete Last Point
          </button>

          <button
            onClick={
              copyRouteData
            }
            disabled={
              points.length === 0
            }
            style={{
              width: "100%",
              padding: "9px",
              marginTop: "10px",
              border: "none",
              borderRadius: "7px",
              background:
                "#00897b",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            📋 Copy Route Data
          </button>

          <button
            onClick={clearAll}
            style={{
              width: "100%",
              padding: "9px",
              marginTop: "10px",
              border: "none",
              borderRadius: "7px",
              background:
                "#d32f2f",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            🗑️ Clear All
          </button>
        </div>
      </div>
    </div>
  );
}

export default RouteEditor;