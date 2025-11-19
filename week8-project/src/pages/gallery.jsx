import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../App.css";

function Gallery() {
  const [crewmates, setCrewmates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCrewmates = async () => {
      const { data, error } = await supabase
        .from("crewmates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase select error:", error);
      } else {
        setCrewmates(data);
      }
      setLoading(false);
    };

    fetchCrewmates();
  }, []);

  if (loading) return <h2>Loading Crewmates...</h2>;

  return (
    <div className="gallery-page">
      <h1 className="gallery-title">Your Crewmate Gallery!</h1>

      {crewmates.length === 0 && (
        <>
          <h3>You haven't made a crewmate yet!</h3>
          <input
            type="button"
            value="Create one here!"
            onClick={() => navigate("/create")}
          />
        </>
      )}

      <div className="crewmate-grid">
        {crewmates.map((c) => (
          <div
            key={c.id}
            className={`crewmate-card glow-${c.color.toLowerCase()}`}
          >
            {/* CLICK CARD → DETAILS */}
            <div
              className="crewmate-click-area"
              onClick={() => navigate(`/crewmates/${c.id}`)}
              style={{ cursor: "pointer" }}
            >
              <div className="crewmate-silhouette" />

              <p className="crewmate-stat">
                <span className="crewmate-label">Name of Crewmate:</span>{" "}
                <span className="crewmate-value">{c.name}</span>
              </p>

              <p className="crewmate-stat">
                <span className="crewmate-label">Speed of Crewmate:</span>{" "}
                <span className="crewmate-value">
                  {Number(c.speed).toFixed(1)} mph
                </span>
              </p>

              <p className="crewmate-stat">
                <span className="crewmate-label">Color of Crewmate:</span>{" "}
                <span className="crewmate-value">
                  {c.color[0].toUpperCase() + c.color.slice(1)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;
