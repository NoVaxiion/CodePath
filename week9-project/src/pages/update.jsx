import { useState } from "react";
import "../App.css";

function Create() {
  return (
    <div className="update-page">
      <div className="home-card-post">
        {/* Create New Post*/}
        <h2 className="home-h1">Update Post</h2>
        <div className="form-section">
          <h4>Post Title</h4>
          <input
            className="input-box"
            type="text"
            placeholder="Enter your post title..."
          />
        </div>

        <div className="form-section">
          <h4>Content</h4>
          <textarea
            className="textarea-box"
            placeholder="Write your post content here..."
          />
        </div>

        <div className="form-section">
          <h4>Image</h4>
          <input
            className="input-box"
            type="text"
            placeholder="Paste your image URL..."
          />
        </div>

        <div>
          <button className="button">Post</button>
          <button className="button">Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default Create;
