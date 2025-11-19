import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/home.jsx";
import Create from "./pages/create.jsx";
import Update from "./pages/update.jsx";
import "./App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
        <Route path="/update" element={<Update />} />
      </Routes>
    </div>
  );
}

export default App;
