import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useEffect, useState } from "react";
import "../App.css";

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, title, created_at, upvotes")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString(); // date + time
  };

  return (
    <div className="home-container">
      {/* Purple Banner */}
      <div className="home-card-a">
        <h1 className="home-h1">Welcome to the Community Space</h1>
        <p className="home-p">
          Share your thoughts, stories, and ideas with the world. Create
          beautiful posts with the moments!
        </p>
        <button className="home-button" onClick={() => navigate("/create")}>
          Start Creating
        </button>
      </div>

      {/*Posts feed*/}
      <div className="home-card-post">
        <h1 className="home-h1">Latest Post</h1>
        <p className="home-p">
          Discover the most recent post from our community
        </p>
      </div>
    </div>
  );
}

export default Home;
