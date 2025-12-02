// src/pages/home.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../App.css";

function Home() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("created_at"); // "created_at" | "upvotes"
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);

      let query = supabase
        .from("posts")
        .select("id, title, image, created_at, upvotes");

      if (sortBy === "created_at") {
        query = query.order("created_at", { ascending: false });
      } else if (sortBy === "upvotes") {
        query = query.order("upvotes", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        setPosts([]);
      } else {
        setPosts(data || []);
      }

      setLoading(false);
    };

    fetchPosts();
  }, [sortBy]);

  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleString();
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      {/* Banner */}
      <div className="home-card-a">
        <h1 className="home-h1">Welcome to the Community Space</h1>
        <p className="home-p">
          Share your thoughts, stories, and ideas with the world.
        </p>
        <button className="home-button" onClick={() => navigate("/create")}>
          Start Creating
        </button>
      </div>

      {/* Feed */}
      <div className="home-card-post">
        <h1 className="home-h1">Latest Posts</h1>

        {/* Controls: search + sort */}
        <div className="feed-controls">
          <input
            className="input-box"
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="input-box"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="created_at">Newest</option>
            <option value="upvotes">Most upvoted</option>
          </select>
        </div>

        {loading && <p className="home-p">Loading posts...</p>}

        {!loading && filteredPosts.length === 0 && (
          <p className="home-p">No posts match that search.</p>
        )}

        {!loading && filteredPosts.length > 0 && (
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="post-card-grid"
                onClick={() => navigate(`/post/${post.id}`)}
              >
                {/* top image area */}
                {post.image ? (
                  <img
                    src={post.image}
                    alt={post.title}
                    className="post-card-image"
                  />
                ) : (
                  <div className="post-card-image placeholder">
                    <span>No image</span>
                  </div>
                )}

                <div className="post-card-body">
                  <div className="post-card-header">
                    <span className="post-card-date">
                      {formatDate(post.created_at)}
                    </span>
                    <span className="post-card-upvotes">
                      ⬆ {post.upvotes ?? 0}
                    </span>
                  </div>
                  <h3 className="post-card-title">{post.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
