import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../App.css";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [speed, setSpeed] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrewmate = async () => {
      const { data, error } = await supabase
        .from("crewmates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching crewmate:", error);
      } else {
        setName(data.name);
        setSpeed(data.speed);
        setColor(data.color);
      }
      setLoading(false);
    };

    fetchCrewmate();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    const { error } = await supabase
      .from("crewmates")
      .update({ name, speed, color })
      .eq("id", id);

    if (error) {
      console.error("Error updating crewmate:", error);
      alert("Failed to update crewmate");
    } else {
      alert("Crewmate updated successfully!");
      navigate(`/crewmates/${id}`);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this crewmate?")) {
      const { error } = await supabase.from("crewmates").delete().eq("id", id);

      if (error) {
        console.error("Error deleting crewmate:", error);
        alert("Failed to delete crewmate");
      } else {
        alert("Crewmate deleted successfully!");
        navigate("/gallery");
      }
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="edit-page">
      <h1>Edit Crewmate</h1>

      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Speed (mph):</label>
          <input
            type="number"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Color:</label>
          <select
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
          >
            <option value="">Select a color</option>
            <option value="red">Red</option>
            <option value="green">Green</option>
            <option value="blue">Blue</option>
            <option value="purple">Purple</option>
            <option value="yellow">Yellow</option>
            <option value="orange">Orange</option>
            <option value="pink">Pink</option>
            <option value="rainbow">Rainbow</option>
          </select>
        </div>

        <button type="submit">Update Crewmate</button>
        <button type="button" onClick={handleDelete} className="delete-btn">
          Delete Crewmate
        </button>
      </form>
    </div>
  );
}

export default Edit;
