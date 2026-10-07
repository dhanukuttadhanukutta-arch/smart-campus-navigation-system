import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Buildings from "./pages/Buildings";
import Events from "./pages/Events";
import About from "./pages/About";
import Login from "./pages/Login";
import RouteEditor from "./pages/RouteEditor";
import Rooms from "./pages/Rooms";

function App() {
  const [isLoggedIn, setIsLoggedIn] =
    useState(
      localStorage.getItem("isLoggedIn") ===
        "true"
    );

  // -----------------------------
  // LOGIN
  // -----------------------------
  const handleLogin = () => {
    localStorage.setItem(
      "isLoggedIn",
      "true"
    );

    setIsLoggedIn(true);
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const handleLogout = () => {
    localStorage.removeItem(
      "isLoggedIn"
    );

    setIsLoggedIn(false);
  };

  return (
    <>
      {/* NAVBAR */}
      {isLoggedIn && (
        <Navbar
          onLogout={handleLogout}
        />
      )}

      <Routes>

        {/* -------------------------
            LOGIN PAGE
        ------------------------- */}
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate
                to="/"
                replace
              />
            ) : (
              <Login
                onLogin={
                  handleLogin
                }
              />
            )
          }
        />

        {/* -------------------------
            HOME
        ------------------------- */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Home />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* -------------------------
            BUILDINGS
        ------------------------- */}
        <Route
          path="/buildings"
          element={
            isLoggedIn ? (
              <Buildings />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* -------------------------
            EVENTS
        ------------------------- */}
        <Route
          path="/events"
          element={
            isLoggedIn ? (
              <Events />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* -------------------------
            ABOUT
        ------------------------- */}
        <Route
          path="/about"
          element={
            isLoggedIn ? (
              <About />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* -------------------------
            ROUTE EDITOR
        ------------------------- */}
        <Route
          path="/route-editor"
          element={
            isLoggedIn ? (
              <RouteEditor />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* -------------------------
            ROOMS / CLASSES
        ------------------------- */}
        <Route
          path="/rooms"
          element={
            isLoggedIn ? (
              <Rooms />
            ) : (
              <Navigate
                to="/login"
                replace
              />
            )
          }
        />

        {/* -------------------------
            UNKNOWN URL
        ------------------------- */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                isLoggedIn
                  ? "/"
                  : "/login"
              }
              replace
            />
          }
        />

      </Routes>
    </>
  );
}

export default App;