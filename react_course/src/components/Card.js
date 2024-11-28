import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import styles from './Card.module.scss';
import {
  updateArticle,
  toggleArticleLike,
} from '../store/slices/articlesSlice';
import {
  fetchComments,
  addComment,
  updateComment,
  removeComment,
  toggleCommentLike,
  setSortBy as setCommentsSortBy,
  setSortOrder as setCommentsSortOrder,
  sortComments,
} from '../store/slices/commentsSlice';

function Card({ data }) {
  const dispatch = useDispatch();
  const comments = useSelector(state => state.comments.commentsByArticle[data.articleId] || []);
  const commentsSortBy = useSelector(state => state.comments.sortBy);
  const commentsSortOrder = useSelector(state => state.comments.sortOrder);

  const [liked, setLiked] = useState(false);
  const [commentsVisible, setCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(data.title);
  const [editedText, setEditedText] = useState(data.text);

  useEffect(() => {
    if (commentsVisible) {
      dispatch(fetchComments(data.articleId));
    }
  }, [commentsVisible, data.articleId, dispatch]);

  const toggleLike = () => {
    dispatch(toggleArticleLike({ articleId: data.articleId, liked }));
    setLiked(!liked);
  };

  const toggleComments = () => {
    setCommentsVisible(!commentsVisible);
  };

  const handleAddComment = () => {
    if (newComment) {
      dispatch(addComment({
        articleId: data.articleId,
        comment: {
          author: 'Admin',
          text: newComment,
          articleId: data.articleId,
        },
      }));
      setNewComment('');
    }
  };

  const handleRemoveComment = (index) => {
    dispatch(removeComment({ articleId: data.articleId, commentIndex: index }));
  };

  const handleToggleCommentLike = (index) => {
    dispatch(toggleCommentLike({ articleId: data.articleId, commentIndex: index }));
  };

  const handleEditComment = (index, newText) => {
    dispatch(updateComment({
      articleId: data.articleId,
      commentIndex: index,
      text: newText,
    }));
  };

  const handleSaveCardEdits = () => {
    dispatch(updateArticle({
      ...data,
      title: editedTitle,
      text: editedText,
    }));
    setIsEditing(false);
  };

  const handleCommentSort = (sortBy) => {
    dispatch(setCommentsSortBy(sortBy));
    dispatch(sortComments({ articleId: data.articleId }));
  };

  const toggleCommentSortOrder = () => {
    const newOrder = commentsSortOrder === 'desc' ? 'asc' : 'desc';
    dispatch(setCommentsSortOrder(newOrder));
    dispatch(sortComments({ articleId: data.articleId }));
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
        <span>Likes: {data.currentLikes}</span>
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
                onClick={() => handleCommentSort('date')}
              >
                Sort by Date {commentsSortBy === 'date' && (commentsSortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                className={styles.card__button}
                onClick={() => handleCommentSort('likes')}
              >
                Sort by Likes {commentsSortBy === 'likes' && (commentsSortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                className={styles.card__button}
                onClick={toggleCommentSortOrder}
              >
                Toggle Order
              </button>
            </div>

            {comments.map((comment, index) => (
              <div key={index} className={styles.comment}>
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
                    onClick={() => handleToggleCommentLike(index)}
                  >
                    {comment.isLiked ? 'Unlike' : 'Like'} ({comment.likes})
                  </button>
                  <button
                    className={styles.card__button}
                    onClick={() => handleEditComment(index, prompt('Edit comment:', comment.text))}
                  >
                    Edit
                  </button>
                  <button
                    className={classNames(styles.card__button, styles['card__button--delete'])}
                    onClick={() => handleRemoveComment(index)}
                  >
                    Delete
                  </button>
                </div>
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
                onClick={handleAddComment}
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
