import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import crewmates from "../assets/crewmates.png";
import "../App.css";

function Create() {
  const [name, setName] = useState("");
  const [speed, setSpeed] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name || !speed || !color) return;
    setLoading(true);

    const { error } = await supabase.from("crewmates").insert([
      {
        name,
        speed: Number(speed),
        color,
      },
    ]);

    setLoading(false);
    if (error) {
      console.error(error);
      return;
    }

    navigate("/gallery");
  };

  const colors = [
    "red",
    "green",
    "blue",
    "purple",
    "yellow",
    "orange",
    "pink",
    "rainbow",
  ];

  return (
    <>
      <div className="main-content">
        <h1>Create a New Crew Member!</h1>
        <img
          src={crewmates}
          className="Crew"
          style={{ width: "300px", height: "auto" }}
        />
      </div>

      <div className="container">
        <div className="box">
          Name:
          <input
            type="text"
            placeholder="Enter crewmate's name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="box">
          Speed (mph):
          <input
            type="number"
            placeholder="Enter speed in mph"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
        </div>

        <div className="box box-color">
          Color
          {colors.map((c) => (
            <label key={c}>
              <input
                type="radio"
                name="color"
                value={c}
                checked={color === c}
                onChange={(e) => setColor(e.target.value)}
              />
              {c[0].toUpperCase() + c.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <input
        type="button"
        value={loading ? "Creating..." : "Create Crewmate"}
        onClick={handleCreate}
        disabled={loading}
      />
    </>
  );
}

export default Create;
