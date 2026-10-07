import React, { useState } from "react";

function SearchBar({ onSearch }) {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    onSearch(search);
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "20px" }}>
      <input
        type="text"
        placeholder="Search Building..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid gray",
        }}
      />

      <button
        onClick={handleSearch}
        style={{
          marginLeft: "10px",
          padding: "10px 20px",
          background: "#1565c0",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Search
      </button>
    </div>
  );
}

export default SearchBar;