import React, { useState } from "react";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Correct username and password
    const correctUsername = "admin";
    const correctPassword = "1234";

    if (username.trim() === "" || password.trim() === "") {
      setError("⚠️ Please enter username and password.");
      return;
    }

    if (username !== correctUsername) {
      setError("❌ Invalid Username.");
      return;
    }

    if (password !== correctPassword) {
      setError("❌ Invalid Password.");
      return;
    }

    // Login success
    setError("");
    onLogin();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: "url('/login-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "30px",
          background: "rgba(255,255,255,0.95)",
          borderRadius: "15px",
          boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#1565c0",
            marginBottom: "25px",
          }}
        >
          🔐 Login
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "15px",
              borderRadius: "7px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "7px",
              border: "1px solid #ccc",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <p
              style={{
                color: "#d32f2f",
                textAlign: "center",
                fontWeight: "bold",
                margin: "10px 0",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "12px",
              background: "#1565c0",
              color: "white",
              border: "none",
              borderRadius: "7px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;