// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home";
import Create from "./pages/create";
import Gallery from "./pages/gallery";
import Detail from "./pages/details";
import Edit from "./pages/edit";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-layout">
        {/* SIDEBAR */}
        <div className="sidebar">
          <Link to="/" className="label">
            Home
          </Link>
          <Link to="/create" className="label">
            Create a Crewmate!
          </Link>
          <Link to="/gallery" className="label">
            Crewmate Gallery
          </Link>
        </div>

        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/crewmates/:id" element={<Detail />} />
            <Route path="/crewmates/:id/edit" element={<Edit />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
