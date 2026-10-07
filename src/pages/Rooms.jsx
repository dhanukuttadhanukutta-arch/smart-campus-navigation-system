import React, { useState } from "react";
import rooms from "../Data/rooms";

function Rooms() {
  const [search, setSearch] = useState("");
  const [selectedBlock, setSelectedBlock] =
    useState("All");

  const blocks = [
    "All",
    "A Block",
    "B Block",
    "C Block",
    "D Block",
    "E Block",
    "F Block",
    "G Block",
  ];

  const filteredRooms = rooms.filter((item) => {
    const matchesSearch =
      item.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.room
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesBlock =
      selectedBlock === "All" ||
      item.block === selectedBlock;

    return matchesSearch && matchesBlock;
  });

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#1565c0",
          marginBottom: "8px",
        }}
      >
        🏫 Campus Classrooms & Rooms
      </h1>

      <p
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        Find classrooms, labs and rooms inside
        each campus block.
      </p>

      {/* SEARCH */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "center",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="🔎 Search room or class..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={{
            width: "300px",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #bbb",
            fontSize: "15px",
          }}
        />

        <select
          value={selectedBlock}
          onChange={(e) =>
            setSelectedBlock(e.target.value)
          }
          style={{
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #bbb",
            fontSize: "15px",
          }}
        >
          {blocks.map((block) => (
            <option
              key={block}
              value={block}
            >
              {block}
            </option>
          ))}
        </select>
      </div>

      {/* ROOM COUNT */}
      <p
        style={{
          textAlign: "center",
          fontWeight: "bold",
          color: "#555",
        }}
      >
        {filteredRooms.length} room(s) found
      </p>

      {/* ROOM CARDS */}
      {filteredRooms.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {filteredRooms.map((item) => (
            <div
              key={item.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                border:
                  "1px solid #e0e0e0",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              <h2
                style={{
                  marginTop: "0",
                  color: "#1565c0",
                }}
              >
                📚 {item.room}
              </h2>

              <p>
                <b>Class / Room:</b>{" "}
                {item.name}
              </p>

              <p>
                <b>🏢 Block:</b>{" "}
                {item.block}
              </p>

              <p>
                <b>🏬 Floor:</b>{" "}
                {item.floor}
              </p>

              <button
                onClick={() => {
                  alert(
                    `Navigation to ${item.name} in ${item.block} will be available from the campus map.`
                  );
                }}
                style={{
                  width: "100%",
                  padding: "11px",
                  marginTop: "10px",
                  background:
                    "#1565c0",
                  color: "white",
                  border: "none",
                  borderRadius: "7px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                📍 Navigate
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p
          style={{
            textAlign: "center",
            marginTop: "40px",
            color: "red",
            fontWeight: "bold",
          }}
        >
          ❌ No classroom or room found.
        </p>
      )}
    </div>
  );
}

export default Rooms;