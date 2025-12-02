import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>🌤️ Weather</h2>
        <p>Stamford, CT</p>
      </div>

      <nav className="sidebar-nav">
        <Link
          to="/"
          className={location.pathname === "/" ? "nav-link active" : "nav-link"}
        >
          📊 Dashboard
        </Link>

        <div className="nav-section">
          <span className="nav-label">Quick Stats</span>
          <div className="sidebar-info">
            <small>48-hour forecast</small>
            <small>Updated hourly</small>
          </div>
        </div>
      </nav>

      <div className="sidebar-footer">
        <small>Data from Open-Meteo API</small>
      </div>
    </aside>
  );
}
