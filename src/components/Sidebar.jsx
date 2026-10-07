import locations from "../Data/location";
import "./Sidebar.css";

function Sidebar({ onSelect }) {
  const blocks = locations.filter(
    (location) => location.type === "block"
  );

  const specialLocations = locations.filter(
    (location) => location.type === "special"
  );

  const importantLocations = locations.filter(
    (location) => location.type === "location"
  );

  return (
    <div
      style={{
        width: "220px",
        background: "#1565c0",
        color: "white",
        padding: "15px",
        borderRadius: "10px",
      }}
    >
      <h2 style={{ marginTop: "0" }}>Campus Blocks</h2>

      {blocks.map((block) => (
        <button
          key={block.id}
          onClick={() => onSelect(block)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "10px",
            padding: "10px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            background: "white",
            color: "#1565c0",
            fontWeight: "bold",
          }}
        >
          📍 {block.name}
        </button>
      ))}

      <h3 style={{ marginTop: "20px" }}>
        Important Locations
      </h3>

      {importantLocations.map((location) => (
        <button
          key={location.id}
          onClick={() => onSelect(location)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "8px",
            padding: "9px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            background: "#fff",
            color: "#1565c0",
            fontWeight: "bold",
          }}
        >
          📌 {location.name}
        </button>
      ))}

      <h3 style={{ marginTop: "20px" }}>
        Campus
      </h3>

      {specialLocations.map((location) => (
        <button
          key={location.id}
          onClick={() => onSelect(location)}
          style={{
            display: "block",
            width: "100%",
            marginBottom: "8px",
            padding: "9px",
            cursor: "pointer",
            borderRadius: "5px",
            border: "none",
            background: "#fff",
            color: "#1565c0",
            fontWeight: "bold",
          }}
        >
          📍 {location.name}
        </button>
      ))}
    </div>
  );
}

export default Sidebar;