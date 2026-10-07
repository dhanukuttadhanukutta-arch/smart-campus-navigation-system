import { useState } from "react";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/Sidebar";
import CampusMap from "../components/CampusMap";
import locations from "../Data/location";
import rooms from "../Data/rooms";

function Home() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [roomSearch, setRoomSearch] = useState("");
  const [roomBlock, setRoomBlock] = useState("All");

  const handleSearch = (searchText) => {
    const text = searchText.trim().toLowerCase();

    if (!text) {
      setMessage("🔍 Please enter a location to search.");
      return;
    }

    const foundLocation = locations.find((location) =>
      location.name.toLowerCase().includes(text)
    );

    if (foundLocation) {
      setSelectedLocation(foundLocation);
      setMessage("📍 Location found: " + foundLocation.name);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setSelectedLocation(null);
      setMessage("❌ Location not found.");
    }
  };

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setMessage("📍 Selected: " + location.name);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filteredRooms = rooms.filter((room) => {
    const searchText = roomSearch.toLowerCase();

    const matchesSearch =
      room.name.toLowerCase().includes(searchText) ||
      room.room.toLowerCase().includes(searchText) ||
      room.department.toLowerCase().includes(searchText) ||
      room.block.toLowerCase().includes(searchText);

    const matchesBlock =
      roomBlock === "All" || room.block === roomBlock;

    return matchesSearch && matchesBlock;
  });

  const handleRoomNavigation = (room) => {
    const blockLocation = locations.find(
      (location) => location.name === room.block
    );

    if (blockLocation) {
      setSelectedLocation(blockLocation);

      setMessage(
        "📍 " +
          room.department +
          " | " +
          room.block +
          " | " +
          room.floor
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      setMessage("❌ Block location not found.");
    }
  };

  const blockNames = [
    "All",
    ...locations
      .filter((location) => location.type === "block")
      .map((location) => location.name),
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #eef6ff, #ffffff, #e8f1ff)",
      }}
    >
      <header
        style={{
          background:
            "linear-gradient(135deg, #0d47a1, #1565c0, #42a5f5)",
          color: "white",
          textAlign: "center",
          padding: "35px 20px",
          boxShadow: "0 5px 18px rgba(13,71,161,0.25)",
        }}
      >
        <div style={{ fontSize: "45px" }}>🏫</div>

        <h1
          style={{
            margin: "5px 0",
            fontSize: "34px",
          }}
        >
          Smart Campus Navigation System
        </h1>

        <p
          style={{
            margin: "10px 0 0",
            fontSize: "16px",
          }}
        >
          Find Buildings, Departments, Classrooms and Campus Locations
        </p>
      </header>

      <main
        style={{
          width: "95%",
          maxWidth: "1500px",
          margin: "auto",
          padding: "25px 0 50px",
        }}
      >
        <section
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "16px",
            boxShadow: "0 5px 18px rgba(21,101,192,0.12)",
            marginBottom: "20px",
            border: "1px solid #dbeafe",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              color: "#0d47a1",
              marginTop: 0,
            }}
          >
            🔎 Search Campus Location
          </h2>

          <SearchBar onSearch={handleSearch} />

          {message && (
            <div
              style={{
                marginTop: "12px",
                padding: "12px",
                background: "#e3f2fd",
                color: "#0d47a1",
                border: "1px solid #90caf9",
                borderRadius: "10px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {message}
            </div>
          )}
        </section>

        <section
          style={{
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              flex: "0 0 240px",
              background:
                "linear-gradient(180deg, #1565c0, #0d47a1)",
              borderRadius: "15px",
              padding: "10px",
              boxShadow: "0 5px 18px rgba(13,71,161,0.25)",
            }}
          >
            <Sidebar onSelect={handleLocationSelect} />
          </div>

          <div
            style={{
              flex: 1,
              minWidth: 0,
              background: "white",
              padding: "10px",
              borderRadius: "15px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.15)",
              border: "2px solid #bbdefb",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(90deg, #0d47a1, #1565c0)",
                color: "white",
                padding: "12px 16px",
                borderRadius: "10px 10px 0 0",
                fontWeight: "bold",
              }}
            >
              🗺️ Interactive Campus Map
            </div>

            <CampusMap
              buildings={locations}
              selectedLocation={selectedLocation}
            />
          </div>
        </section>

        {selectedLocation && (
          <section
            style={{
              background:
                "linear-gradient(135deg, white, #e3f2fd)",
              padding: "20px",
              borderRadius: "15px",
              marginBottom: "30px",
              border: "2px solid #90caf9",
            }}
          >
            <h2
              style={{
                color: "#0d47a1",
                marginTop: 0,
              }}
            >
              📍 Selected Location
            </h2>

            <p>
              <b>Location:</b> {selectedLocation.name}
            </p>

            <p>
              <b>Latitude:</b> {selectedLocation.position[0]}
            </p>

            <p>
              <b>Longitude:</b> {selectedLocation.position[1]}
            </p>
          </section>
        )}

        <section
          style={{
            background: "white",
            borderRadius: "18px",
            overflow: "hidden",
            boxShadow: "0 5px 20px rgba(0,0,0,0.12)",
            border: "1px solid #dbeafe",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg, #0d47a1, #1565c0, #42a5f5)",
              color: "white",
              padding: "25px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "38px" }}>🎓</div>

            <h2
              style={{
                margin: "5px 0",
                fontSize: "27px",
              }}
            >
              Campus Departments & Classrooms
            </h2>

            <p style={{ margin: "8px 0 0" }}>
              Search department, classroom, block or floor
            </p>
          </div>

          <div style={{ padding: "25px" }}>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginBottom: "25px",
              }}
            >
              <input
                type="text"
                placeholder="🔍 Search department / room / block..."
                value={roomSearch}
                onChange={(e) => setRoomSearch(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: "250px",
                  padding: "14px 16px",
                  border: "2px solid #bbdefb",
                  borderRadius: "10px",
                  fontSize: "15px",
                }}
              />

              <select
                value={roomBlock}
                onChange={(e) => setRoomBlock(e.target.value)}
                style={{
                  padding: "14px 18px",
                  border: "2px solid #bbdefb",
                  borderRadius: "10px",
                  fontSize: "15px",
                  background: "white",
                  color: "#0d47a1",
                  fontWeight: "bold",
                }}
              >
                {blockNames.map((block) => (
                  <option key={block} value={block}>
                    {block}
                  </option>
                ))}
              </select>
            </div>

            <div
              style={{
                marginBottom: "20px",
                color: "#1565c0",
                fontWeight: "bold",
              }}
            >
              📚 {filteredRooms.length} location(s) found
            </div>

            {filteredRooms.length === 0 ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  background: "#f8fbff",
                  borderRadius: "12px",
                  color: "#777",
                }}
              >
                <div style={{ fontSize: "40px" }}>🔍</div>

                <h3>No department or classroom found</h3>

                <p>
                  Try another department, room or block name.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "20px",
                }}
              >
                {filteredRooms.map((room) => (
                  <div
                    key={room.id}
                    style={{
                      background:
                        "linear-gradient(145deg, white, #f3f8ff)",
                      borderRadius: "15px",
                      padding: "20px",
                      border: "1px solid #c5ddf7",
                      boxShadow:
                        "0 4px 12px rgba(21,101,192,0.10)",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        background:
                          "linear-gradient(90deg, #1565c0, #42a5f5)",
                        color: "white",
                        padding: "7px 13px",
                        borderRadius: "20px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        marginBottom: "12px",
                      }}
                    >
                      🏢 {room.block}
                    </div>

                    <h3
                      style={{
                        margin: "5px 0 15px",
                        color: "#0d47a1",
                        fontSize: "21px",
                      }}
                    >
                      🎓 {room.department}
                    </h3>

                    <div
                      style={{
                        background: "#eef6ff",
                        padding: "12px",
                        borderRadius: "10px",
                        marginBottom: "15px",
                      }}
                    >
                      <p style={{ margin: "6px 0" }}>
                        🏬 <b>Floor:</b> {room.floor}
                      </p>

                      <p style={{ margin: "6px 0" }}>
                        🚪 <b>Room:</b> {room.room}
                      </p>

                      <p style={{ margin: "6px 0" }}>
                        📚 <b>Name:</b> {room.name}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRoomNavigation(room)}
                      style={{
                        width: "100%",
                        padding: "12px",
                        background:
                          "linear-gradient(90deg, #1565c0, #42a5f5)",
                        color: "white",
                        border: "none",
                        borderRadius: "9px",
                        cursor: "pointer",
                        fontSize: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      📍 Navigate to Block
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer
        style={{
          background:
            "linear-gradient(90deg, #0d47a1, #1565c0)",
          color: "white",
          textAlign: "center",
          padding: "22px",
        }}
      >
        <h3 style={{ margin: "0 0 5px" }}>
          🏫 Smart Campus Navigation System
        </h3>

        <p style={{ margin: 0 }}>
          BCA | Chikkanna Government Arts College, Tiruppur
        </p>
      </footer>
    </div>
  );
}

export default Home;