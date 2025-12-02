import { Outlet } from "react-router-dom";
import "./App.css";
import Sidebar from "./components/Sidebar.jsx";

/**
 * App is a layout with sidebar + main content area.
 * Dashboard and Detail each render their own .page container.
 */
export default function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
