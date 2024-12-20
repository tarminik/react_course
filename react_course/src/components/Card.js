import React, { useState, useEffect } from 'react';
import { getComments } from '../helpers/get-comments-by-article';
import classNames from 'classnames';
import styles from './Card.module.scss';

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
    <div className={styles.card}>
      <h3 className={styles.card__title}>{data.title}</h3>
      <p className={styles.card__text}>{data.text}</p>
      <div>
        <span>Likes: {likes}</span>
        <button
          className={classNames(styles.card__button, styles['card__button--like'])}
          onClick={toggleLike}
        >
          {liked ? 'Unlike' : 'Like'}
        </button>
      </div>
      <div>
        <span>Comments: {data.commentsCount}</span>
        <button
          className={classNames(styles.card__button, styles['card__button--comment'])}
          onClick={toggleComments}
        >
          {commentsVisible ? 'Hide Comments' : 'Show Comments'}
        </button>
      </div>
      {commentsVisible && (
        <div className={styles.commentsSection}>
          {comments.map((comment, index) => (
            <div key={index} className={styles.comment}>
              <p><strong>{comment.author}:</strong> {comment.text}</p>
              <button
                className={classNames(styles.card__button, styles['card__button--delete'])}
                onClick={() => removeComment(index)}
              >
                Delete
              </button>
            </div>
          ))}
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button
            className={classNames(styles.card__button, styles['card__button--add'])}
            onClick={addComment}
          >
            Add Comment
          </button>
        </div>
      )}
    </div>
  );
}

export default Card;
