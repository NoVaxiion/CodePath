import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../App.css";

function Update() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState({
    title: "",
    content: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // load existing post
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("title, content")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error);
      } else if (data) {
        setPost({
          title: data.title ?? "",
          content: data.content ?? "",
        });
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!post.title.trim() || !post.content.trim()) return;

    setSaving(true);

    const { error } = await supabase
      .from("posts")
      .update({
        title: post.title,
        content: post.content,
      })
      .eq("id", id);

    setSaving(false);

    if (error) {
      console.error(error);
      return;
    }

    navigate(`/post/${id}`);
  };

  if (loading) {
    return (
      <div className="update-page">
        <div className="home-card-post">
          <h2 className="home-h1">Update Post</h2>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="update-page">
      <div className="home-card-post">
        <h2 className="home-h1">Update Post</h2>

        <form onSubmit={handleUpdate}>
          <div className="form-section">
            <h4>Post Title</h4>
            <input
              className="input-box"
              type="text"
              placeholder="Enter your post title..."
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
            />
          </div>

          <div className="form-section">
            <h4>Content</h4>
            <textarea
              className="textarea-box"
              placeholder="Write your post content here..."
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
            />
          </div>

          <div>
            <button className="button" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Update"}
            </button>
            <button
              className="button"
              type="button"
              onClick={() => navigate(`/post/${id}`)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Update;
