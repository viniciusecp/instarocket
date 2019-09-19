import React, { useState, useEffect } from "react";
import api from "../services/api";
import io from "socket.io-client";

import AddComment from "../components/AddComment";

import "./Feed.css";

import moreImage from "../assets/more.svg";
import likeImage from "../assets/like.svg";
import commentImage from "../assets/comment.svg";
import sendImage from "../assets/send.svg";

export default function Feed() {
  const [feed, setFeed] = useState([]);
  const [newPost, setNewPost] = useState(null);
  const [likedPost, setLikedPost] = useState(null);
  const [commentedPost, setCommentedPost] = useState(null);

  useEffect(() => {
    async function loadPosts() {
      const response = await api.get("/posts");

      setFeed(response.data);
    }

    loadPosts();
  }, []);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);

    socket.on("post", newPost => setNewPost(newPost));
    socket.on("like", likedPost => setLikedPost(likedPost));
    socket.on("comment", commentedPost => setCommentedPost(commentedPost));
  }, []);

  useEffect(() => {
    if (newPost) {
      setFeed([newPost, ...feed]);
      setNewPost(null);
    }
  }, [newPost, feed]);

  useEffect(() => {
    if (likedPost) {
      setFeed(
        feed.map(post => (post._id === likedPost._id ? likedPost : post))
      );
      setLikedPost(null);
    }
  }, [likedPost, feed]);

  useEffect(() => {
    if (commentedPost) {
      setFeed(
        feed.map(post =>
          post._id === commentedPost._id ? commentedPost : post
        )
      );
      setCommentedPost(null);
    }
  }, [commentedPost, feed]);

  async function handleLike(id) {
    await api.post(`/posts/${id}/like`);
  }

  async function handleAddComment(postId, comment) {
    await api.post(`/posts/${postId}/comment`, comment);
  }

  return (
    <section id="post-list">
      {!!feed.length &&
        feed.map(post => (
          <article key={post._id}>
            <header>
              <div className="user-info">
                <span>{post.author}</span>
                <span className="place">{post.place}</span>
              </div>

              <img src={moreImage} alt="Mais" />
            </header>

            <img src={post.image_url} alt="" />

            <footer>
              <div className="actions">
                <button type="button" onClick={() => handleLike(post._id)}>
                  <img src={likeImage} alt="" />
                </button>
                <img src={commentImage} alt="" />
                <img src={sendImage} alt="" />
              </div>

              <strong>{post.likes} curtidas</strong>

              <p>
                {post.description}
                <span>{post.hashtags}</span>
              </p>

              {!!post.comments.length &&
                post.comments.map(comment => (
                  <div className="comment" key={comment._id}>
                    <strong>{comment.author}: </strong>
                    <span>{comment.comment}</span>
                  </div>
                ))}

              <AddComment onAddComment={handleAddComment} postId={post._id} />
            </footer>
          </article>
        ))}
    </section>
  );
}
