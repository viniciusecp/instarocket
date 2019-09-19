import React, { useState } from "react";

import { MdComment } from "react-icons/md";

import "./AddComment.css";

export default function({ onAddComment, postId }) {
  const [author, setAuthor] = useState("");
  const [comment, setComment] = useState("");

  function handleAddComment(event) {
    if (event.keyCode === 13) {
      onAddComment(postId, {
        author,
        comment
      });

      setAuthor("");
      setComment("");
    }
  }

  return (
    <div className="add-comment-container">
      <MdComment size={24} color="#333" />
      <input
        className="add-comment-author"
        placeholder="Nome"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        onKeyDown={e => handleAddComment(e)}
      />
      <input
        className="add-comment-comment"
        placeholder="Comente aqui..."
        value={comment}
        onChange={e => setComment(e.target.value)}
        onKeyDown={e => handleAddComment(e)}
      />
    </div>
  );
}
