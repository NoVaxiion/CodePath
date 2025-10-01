import "./App.css";
import Vendors from "../components/Vendors";

function App() {
  return (
    <div className="App">
      <div className="Header">
        <img
          src="https://heroic-pixie-6d7f91.netlify.app/awning.png"
          alt="Awning"
        />
        <h5>Food and Desert Vendors</h5>
        <Vendors />
      </div>
    </div>
  );
}

export default App;
