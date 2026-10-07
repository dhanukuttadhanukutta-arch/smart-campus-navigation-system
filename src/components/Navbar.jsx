import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar({ onLogout }) {
  return (
    <nav className="navbar">
      <div className="logo">Smart Campus Navigation</div>

      <ul className="nav-links">
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/buildings">Buildings</Link>
        </li>

        <li>
          <Link to="/events">Events</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <button
            onClick={onLogout}
            style={{
              background: "none",
              border: "none",
              color: "inherit",
              fontSize: "inherit",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;