import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../App.css";

function Post() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingComment, setSavingComment] = useState(false);
  const [upvoting, setUpvoting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sortBy, setSortBy] = useState("created_at"); // or "upvotes"
  const [search, setSearch] = useState("");

  // just fetch data here
  useEffect(() => {
    const fetchData = async () => {
      // fetch post
      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("id, title, content, image, created_at, upvotes")
        .eq("id", id)
        .single();

      if (postError) {
        console.error(postError);
      } else {
        setPost(postData);
      }

      // fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("id, content, created_at")
        .eq("post_id", id)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error(commentsError);
      } else {
        setComments(commentsData || []);
      }

      setLoading(false);
    };

    fetchData();
  }, [id]);

  const formatDate = (iso) => {
    if (!iso) return "";
    return new Date(iso).toLocaleString();
  };

  const handleUpvote = async () => {
    if (!post) return;
    setUpvoting(true);

    const current = post.upvotes ?? 0;

    const { data, error } = await supabase
      .from("posts")
      .update({ upvotes: current + 1 })
      .eq("id", id)
      .select("id, title, content, image, created_at, upvotes")
      .single();

    setUpvoting(false);

    if (error) {
      console.error(error);
      return;
    }

    setPost(data);
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSavingComment(true);

    const { data, error } = await supabase
      .from("comments")
      .insert([{ post_id: id, content: newComment.trim() }])
      .select("id, content, created_at")
      .single();

    setSavingComment(false);

    if (error) {
      console.error(error);
      return;
    }

    setComments((prev) => [...prev, data]);
    setNewComment("");
  };

  const handleEdit = () => {
    navigate(`/update/${id}`);
  };

  const handleDelete = async () => {
    const ok = window.confirm("Delete this post? This cannot be undone.");
    if (!ok) return;

    setDeleting(true);

    const { error } = await supabase.from("posts").delete().eq("id", id);

    setDeleting(false);

    if (error) {
      console.error(error);
      return;
    }

    navigate("/");
  };

  if (loading) {
    return (
      <div className="post-page">
        <div className="post-detail-container">
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-page">
        <div className="post-detail-container">
          <p>Post not found.</p>
          <button className="button" onClick={() => navigate("/")}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-page">
      <div className="post-detail-container">
        <div className="post-actions">
          <button className="action-button" onClick={() => navigate("/")}>
            ← Back
          </button>
          <div style={{ marginLeft: "auto", display: "flex", gap: "12px" }}>
            <button className="button" onClick={handleEdit}>
              Edit
            </button>
            <button
              className="button delete-button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>

        <h1 className="post-detail-title">{post.title}</h1>

        <div className="post-detail-header">
          <div className="post-detail-meta">
            <span className="post-detail-date">
              📅 {formatDate(post.created_at)}
            </span>
          </div>

          <button
            className={`upvote-button ${upvoting ? "upvoting" : ""}`}
            onClick={handleUpvote}
            disabled={upvoting}
          >
            ⬆ {post.upvotes ?? 0}
          </button>
        </div>

        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className="post-detail-image"
          />
        )}

        <p className="post-detail-content">{post.content}</p>

        {/* Comments Section */}
        <div className="comments-section">
          <h3 className="comments-title">Comments ({comments.length})</h3>

          {comments.length === 0 && (
            <p className="no-comments">
              💬 No comments yet. Be the first to share your thoughts!
            </p>
          )}

          {comments.length > 0 && (
            <ul className="comments-list">
              {comments.map((c) => (
                <li key={c.id} className="comment-item">
                  <p className="comment-date">🕒 {formatDate(c.created_at)}</p>
                  <p className="comment-text">{c.content}</p>
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleAddComment} className="comment-form">
            <h3>Add a Comment</h3>
            <textarea
              className="comment-input"
              placeholder="Share your thoughts..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            <button
              className="comment-submit"
              type="submit"
              disabled={savingComment || !newComment.trim()}
            >
              {savingComment ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Post;
