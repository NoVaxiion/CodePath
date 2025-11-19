// src/pages/details.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../App.css";

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crewmate, setCrewmate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCrewmate = async () => {
      const { data, error } = await supabase
        .from("crewmates")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Detail fetch error:", error);
      } else {
        setCrewmate(data);
      }
      setLoading(false);
    };

    fetchCrewmate();
  }, [id]);

  if (loading) return <h2>Loading...</h2>;
  if (!crewmate) return <h2>Crewmate not found.</h2>;

  const speedNum = Number(crewmate.speed);
  let speedMessage = "Solid crewmate!";
  if (speedNum < 2) {
    speedMessage =
      "You may want to find a crewmate with more speed... this one is a bit slow 😅";
  } else if (speedNum > 5) {
    speedMessage = "Wow, this crewmate is super fast! 🚀";
  }

  return (
    <div className="detail-page">
      <h1 className="detail-title">Crewmate: {crewmate.name}</h1>

      <h2 className="detail-stats-heading">Stats:</h2>

      <p className="detail-stat-line">Color: {crewmate.color}</p>
      <p className="detail-stat-line">Speed: {speedNum.toFixed(1)} mph</p>

      <p className="detail-extra">{speedMessage}</p>

      <button
        className="detail-edit-btn"
        onClick={() => navigate(`/crewmates/${crewmate.id}/edit`)}
      >
        Edit or Delete this Crewmate
      </button>
    </div>
  );
}

export default Detail;
