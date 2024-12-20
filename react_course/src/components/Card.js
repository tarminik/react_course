import React, { useState, useEffect } from 'react';
import { getComments } from '../helpers/get-comments-by-article';
import classNames from 'classnames';
import styles from './Card.module.scss';

function Card({ data, onUpdate }) {
  const [likes, setLikes] = useState(data.currentLikes);
  const [liked, setLiked] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' or 'likes'
  const [sortOrder, setSortOrder] = useState('desc');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(data.title);
  const [editedText, setEditedText] = useState(data.text);

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
        // Добавляем дату создания и лайки к существующим комментариям
        const enhancedComments = commentsData.map(comment => ({
          ...comment,
          createdAt: comment.createdAt || new Date().toISOString(),
          likes: comment.likes || 0,
          isLiked: false,
          isEditing: false
        }));
        setComments(enhancedComments);
      };
      fetchComments();
    }
  }, [commentsVisible, data.articleId]);

  const addComment = () => {
    if (newComment) {
      const newCommentObj = {
        author: 'Admin',
        text: newComment,
        articleId: data.articleId,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
    }
  };

  const removeComment = (indexToRemove) => {
    setComments(comments.filter((_, index) => index !== indexToRemove));
  };

  const toggleCommentLike = (index) => {
    setComments(comments.map((comment, i) => {
      if (i === index) {
        return {
          ...comment,
          likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          isLiked: !comment.isLiked
        };
      }
      return comment;
    }));
  };

  const sortComments = () => {
    const sortedComments = [...comments].sort((a, b) => {
      const compareValue = sortBy === 'date'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : b.likes - a.likes;
      return sortOrder === 'desc' ? compareValue : -compareValue;
    });
    setComments(sortedComments);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const handleEditComment = (index, newText) => {
    setComments(comments.map((comment, i) => {
      if (i === index) {
        return { ...comment, text: newText, isEditing: false };
      }
      return comment;
    }));
  };

  const toggleCommentEdit = (index) => {
    setComments(comments.map((comment, i) => {
      if (i === index) {
        return { ...comment, isEditing: !comment.isEditing };
      }
      return { ...comment, isEditing: false };
    }));
  };

  const handleSaveCardEdits = () => {
    onUpdate?.({
      ...data,
      title: editedTitle,
      text: editedText
    });
    setIsEditing(false);
  };

  return (
    <div className={styles.card}>
      {isEditing ? (
        <div className={styles.card__editForm}>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className={styles.card__editInput}
          />
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className={styles.card__editTextarea}
          />
          <div className={styles.card__editButtons}>
            <button
              className={classNames(styles.card__button, styles['card__button--save'])}
              onClick={handleSaveCardEdits}
            >
              Save
            </button>
            <button
              className={classNames(styles.card__button, styles['card__button--cancel'])}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.card__header}>
            <h3 className={styles.card__title}>{data.title}</h3>
            <button
              className={classNames(styles.card__button, styles['card__button--edit'])}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          </div>
          <p className={styles.card__text}>{data.text}</p>
          <p className={styles.card__date}>Created: {new Date(data.createdAt).toLocaleString()}</p>
        </>
      )}
      
      <div className={styles.card__actions}>
        <span>Likes: {likes}</span>
        <button
          className={classNames(styles.card__button, styles['card__button--like'])}
          onClick={toggleLike}
        >
          {liked ? 'Unlike' : 'Like'}
        </button>
      </div>

      <div className={styles.card__comments}>
        <div className={styles.card__commentsHeader}>
          <span>Comments: {comments.length}</span>
          <button
            className={classNames(styles.card__button, styles['card__button--comment'])}
            onClick={toggleComments}
          >
            {commentsVisible ? 'Hide Comments' : 'Show Comments'}
          </button>
        </div>

        {commentsVisible && (
          <div className={styles.commentsSection}>
            <div className={styles.commentsSortControls}>
              <button
                className={styles.card__button}
                onClick={() => {
                  setSortBy('date');
                  sortComments();
                }}
              >
                Sort by Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                className={styles.card__button}
                onClick={() => {
                  setSortBy('likes');
                  sortComments();
                }}
              >
                Sort by Likes {sortBy === 'likes' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                className={styles.card__button}
                onClick={toggleSortOrder}
              >
                Toggle Order
              </button>
            </div>

            {comments.map((comment, index) => (
              <div key={index} className={styles.comment}>
                {comment.isEditing ? (
                  <div className={styles.comment__editForm}>
                    <textarea
                      value={comment.text}
                      onChange={(e) => handleEditComment(index, e.target.value)}
                      className={styles.comment__editTextarea}
                    />
                    <button
                      className={styles.card__button}
                      onClick={() => toggleCommentEdit(index)}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <>
                    <div className={styles.comment__header}>
                      <strong>{comment.author}</strong>
                      <span className={styles.comment__date}>
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className={styles.comment__text}>{comment.text}</p>
                    <div className={styles.comment__actions}>
                      <button
                        className={classNames(styles.card__button, styles['card__button--like'])}
                        onClick={() => toggleCommentLike(index)}
                      >
                        {comment.isLiked ? 'Unlike' : 'Like'} ({comment.likes})
                      </button>
                      <button
                        className={styles.card__button}
                        onClick={() => toggleCommentEdit(index)}
                      >
                        Edit
                      </button>
                      <button
                        className={classNames(styles.card__button, styles['card__button--delete'])}
                        onClick={() => removeComment(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            
            <div className={styles.addComment}>
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment"
                className={styles.addComment__input}
              />
              <button
                className={classNames(styles.card__button, styles['card__button--add'])}
                onClick={addComment}
              >
                Add Comment
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
