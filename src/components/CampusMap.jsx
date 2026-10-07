import { useState, useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Routing from "./Routing";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const blockIcon = (blockName) =>
  L.divIcon({
    className: "block-label",
    html: `
      <div style="
        background:#1565c0;
        color:white;
        padding:4px 7px;
        border-radius:6px;
        font-weight:600;
        font-size:11px;
        border:1.5px solid white;
        box-shadow:0 2px 5px rgba(0,0,0,0.35);
        text-align:center;
        white-space:nowrap;
      ">
        ${blockName}
      </div>
    `,
    iconSize: [70, 28],
    iconAnchor: [35, 14],
  });

const specialIcon = (name) =>
  L.divIcon({
    className: "special-label",
    html: `
      <div style="
        background:white;
        color:#1565c0;
        padding:5px 8px;
        border-radius:6px;
        font-weight:600;
        font-size:11px;
        border:2px solid #1565c0;
        box-shadow:0 2px 6px rgba(0,0,0,0.3);
        text-align:center;
        white-space:nowrap;
      ">
        ${name}
      </div>
    `,
    iconSize: [110, 30],
    iconAnchor: [55, 15],
  });

const destinationIcon = L.divIcon({
  className: "destination-marker",
  html: `
    <div style="
      width:24px;
      height:24px;
      background:#e53935;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 2px 6px rgba(0,0,0,0.4);
      display:flex;
      align-items:center;
      justify-content:center;
    ">
      <div style="
        width:8px;
        height:8px;
        background:white;
        border-radius:50%;
      "></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

const currentLocationIcon = L.divIcon({
  className: "current-location-marker",
  html: `
    <div style="
      width:18px;
      height:18px;
      background:#1e88e5;
      border:4px solid white;
      border-radius:50%;
      box-shadow:0 0 0 4px rgba(30,136,229,0.25), 0 2px 8px rgba(0,0,0,0.4);
    "></div>
  `,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

function MapController({ selectedLocation, currentLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedLocation) return;

    map.stop();

    map.setView(selectedLocation.position, 20, {
      animate: false,
    });

    setTimeout(() => {
      map.invalidateSize();

      map.setView(selectedLocation.position, 20, {
        animate: false,
      });
    }, 300);
  }, [selectedLocation, map]);

  useEffect(() => {
    if (!currentLocation || selectedLocation) return;

    map.setView(currentLocation, 20, {
      animate: true,
    });
  }, [currentLocation, selectedLocation, map]);

  return null;
}

function CampusMap({ buildings, selectedLocation }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [gpsMessage, setGpsMessage] = useState("");

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setGpsMessage("❌ GPS is not supported by this browser.");
      return;
    }

    setGpsMessage("📡 Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const location = [latitude, longitude];

        setCurrentLocation(location);

        setGpsMessage(
          `📍 Location found: ${latitude.toFixed(
            6
          )}, ${longitude.toFixed(6)}`
        );
      },
      (error) => {
        setGpsMessage(
          "❌ Unable to get location. Please allow browser location permission."
        );

        console.log("GPS ERROR:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const blocks = buildings.filter(
    (building) => building.type === "block"
  );

  const specialLocations = buildings.filter(
    (building) => building.type === "special"
  );

  const importantLocations = buildings.filter(
    (building) =>
      building.type === "location" &&
      building.id !== selectedLocation?.id
  );

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "15px",
          zIndex: 1000,
          background: "white",
          padding: "10px",
          borderRadius: "10px",
          boxShadow: "0 3px 12px rgba(0,0,0,0.25)",
        }}
      >
        <button
          onClick={getCurrentLocation}
          style={{
            border: "none",
            borderRadius: "8px",
            padding: "10px 14px",
            background:
              "linear-gradient(90deg, #1565c0, #42a5f5)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          📍 Use My Location
        </button>

        {gpsMessage && (
          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#0d47a1",
              maxWidth: "220px",
            }}
          >
            {gpsMessage}
          </div>
        )}
      </div>

      <MapContainer
        center={[11.107992, 77.320111]}
        zoom={22}
        style={{
          height: "800px",
          width: "100%",
          borderRadius: "10px",
        }}
      >
        <TileLayer
          attribution="&copy; Esri, Maxar, Earthstar Geographics"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />

        <MapController
          selectedLocation={selectedLocation}
          currentLocation={currentLocation}
        />

        {blocks.map((block) => (
          <Marker
            key={block.id}
            position={block.position}
            icon={blockIcon(block.name)}
          >
            <Popup>
              <h3>{block.name}</h3>

              <p>
                Chikkanna Government Arts College,
                Tiruppur
              </p>
            </Popup>
          </Marker>
        ))}

        {specialLocations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
            icon={specialIcon(location.name)}
          >
            <Popup>
              <h3>{location.name}</h3>

              <p>
                Chikkanna Government Arts College,
                Tiruppur
              </p>

              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${location.position[0]},${location.position[1]}`,
                    "_blank"
                  );
                }}
                style={{
                  padding: "7px 10px",
                  background: "#1565c0",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                📍 Open in Google Maps
              </button>
            </Popup>
          </Marker>
        ))}

        {importantLocations.map((location) => (
          <Marker
            key={location.id}
            position={location.position}
          >
            <Popup>
              <h3>{location.name}</h3>

              {location.block && (
                <p>
                  <b>Block:</b> {location.block}
                </p>
              )}

              <p>
                Chikkanna Government Arts College,
                Tiruppur
              </p>

              <button
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${location.position[0]},${location.position[1]}`,
                    "_blank"
                  );
                }}
                style={{
                  padding: "7px 10px",
                  background: "#1565c0",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                📍 Open in Google Maps
              </button>
            </Popup>
          </Marker>
        ))}

        {selectedLocation && (
          <Marker
            position={selectedLocation.position}
            icon={destinationIcon}
            zIndexOffset={1000}
          >
            <Popup>
              <h3
                style={{
                  margin: 0,
                  color: "#e53935",
                }}
              >
                📍 {selectedLocation.name}
              </h3>

              {selectedLocation.block && (
                <p>
                  <b>Block:</b> {selectedLocation.block}
                </p>
              )}

              <p>
                <b>Destination</b>
              </p>
            </Popup>
          </Marker>
        )}

        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={currentLocationIcon}
            zIndexOffset={900}
          >
            <Popup>
              <h3>📍 Your Current Location</h3>

              <p>
                GPS location detected successfully.
              </p>

              <p>
                <b>Latitude:</b>{" "}
                {currentLocation[0].toFixed(6)}
              </p>

              <p>
                <b>Longitude:</b>{" "}
                {currentLocation[1].toFixed(6)}
              </p>
            </Popup>
          </Marker>
        )}

        {selectedLocation && (
          <Routing
            from={currentLocation}
            to={selectedLocation.position}
            destinationName={selectedLocation.name}
          />
        )}
      </MapContainer>
    </div>
  );
}

export default CampusMap;