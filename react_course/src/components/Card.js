import React, { useState, useEffect } from 'react';
import { getComments } from '../helpers/get-comments-by-article';
import './Card.css';

function Card({ data }) {
  const [likes, setLikes] = useState(data.currentLikes);
  const [liked, setLiked] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const toggleLike = () => {
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked(!liked);
  };

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  useEffect(() => {
    if (commentsVisible) {
      const fetchComments = async () => {
        const commentsData = await getComments(data.articleId);
        setComments(commentsData);
      };
      fetchComments();
    }
  }, [commentsVisible, data.articleId]);

  const addComment = () => {
    if (newComment) {
      setComments([...comments, { author: 'Admin', text: newComment, articleId: data.articleId }]);
      setNewComment('');
    }
  };

  const removeComment = (indexToRemove) => {
    setComments(comments.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="card">
      <h3>{data.title}</h3>
      <p>{data.text}</p>
      <div>
        <span>Likes: {likes}</span>
        <button onClick={toggleLike}>
          {liked ? 'Unlike' : 'Like'}
        </button>
      </div>
      <div>
        <span>Comments: {data.commentsCount}</span>
        <button onClick={toggleComments}>
          {commentsVisible ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>
      {commentsVisible && (
        <div className="comments-section">
          {comments.map((comment, index) => (
            <div key={index} className="comment">
              <p><strong>{comment.author}:</strong> {comment.text}</p>
              <button onClick={() => removeComment(index)}>Delete</button>
            </div>
          ))}
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={addComment}>Add Comment</button>
        </div>
      )}
    </div>
  );
}

export default Card;
