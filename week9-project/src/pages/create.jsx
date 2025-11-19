import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import "../App.css";

function Create() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({
    title: "",
    content: "",
    imageFile: null, // only file upload
  });

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!post.title.trim() || !post.content.trim()) return;

    setLoading(true);

    let imageUrl = null;

    // upload file if it exists
    if (post.imageFile) {
      const fileExt = post.imageFile.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const bucket = "post";

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, post.imageFile);

      if (uploadError) {
        console.error(uploadError);
        setLoading(false);
        return;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    const { error } = await supabase.from("posts").insert([
      {
        title: post.title,
        content: post.content,
        image: imageUrl,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }

    navigate("/");
  };

  return (
    <div className="create-page">
      <div className="home-card-post">
        <h2 className="home-h1">Create New Post</h2>

        <form onSubmit={handleCreate}>
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

          <div className="form-section">
            <h4>Upload an image file</h4>
            <input
              className="input-box"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPost({ ...post, imageFile: file });
                }
              }}
            />
            {post.imageFile && <p>Selected: {post.imageFile.name}</p>}
          </div>

          <div>
            <button className="button" type="submit" disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
            <button
              className="button"
              type="button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create;
