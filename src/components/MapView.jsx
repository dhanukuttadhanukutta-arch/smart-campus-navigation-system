import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import locations from "../Data/location";

function ChangeMap({ location }) {
  const map = useMap();

  if (location) {
    map.flyTo(location.position, 18);
  }

  return null;
}

function MapView({ selectedLocation }) {
  const center = [11.107992, 77.320111];

  return (
    <MapContainer
      center={center}
      zoom={17}
      style={{
        height: "500px",
        width: "100%",
        borderRadius: "10px",
      }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeMap location={selectedLocation} />

      {locations.map((location) => (
        <Marker
          key={location.id}
          position={location.position}
        >
          <Popup>
            <h3>{location.name}</h3>
            <p>Chikkanna Government Arts College Tiruppur</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default MapView;