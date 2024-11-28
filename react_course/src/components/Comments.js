import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import styles from './Comments.module.scss';
import {
  fetchComments,
  addComment,
  updateComment,
  removeComment,
  toggleCommentLike,
  setSortBy,
  setSortOrder,
  sortComments,
} from '../store/slices/commentsSlice';

function Comments({ articleId }) {
  const dispatch = useDispatch();
  const comments = useSelector(state => state.comments.commentsByArticle[articleId] || []);
  const sortBy = useSelector(state => state.comments.sortBy);
  const sortOrder = useSelector(state => state.comments.sortOrder);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    dispatch(fetchComments(articleId));
  }, [articleId, dispatch]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      dispatch(addComment({
        articleId,
        comment: {
          author: 'Пользователь',
          text: newComment,
          articleId,
        },
      }));
      setNewComment('');
    }
  };

  const handleSort = (newSortBy) => {
    dispatch(setSortBy(newSortBy));
    dispatch(sortComments({ articleId }));
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch(setSortOrder(newOrder));
    dispatch(sortComments({ articleId }));
  };

  return (
    <div className={styles.comments}>
      <h3 className={styles.title}>Комментарии ({comments.length})</h3>
      
      <div className={styles.controls}>
        <button
          className={styles.button}
          onClick={() => handleSort('date')}
        >
          По дате {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
        </button>
        <button
          className={styles.button}
          onClick={() => handleSort('likes')}
        >
          По лайкам {sortBy === 'likes' && (sortOrder === 'desc' ? '↓' : '↑')}
        </button>
        <button
          className={styles.button}
          onClick={toggleSortOrder}
        >
          {sortOrder === 'desc' ? '↓ По убыванию' : '↑ По возрастанию'}
        </button>
      </div>

      <div className={styles.addComment}>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Напишите комментарий..."
          className={styles.textarea}
        />
        <button
          className={styles.button}
          onClick={handleAddComment}
          disabled={!newComment.trim()}
        >
          Добавить комментарий
        </button>
      </div>

      <div className={styles.commentsList}>
        {comments.map((comment, index) => (
          <div key={index} className={styles.commentItem}>
            <div className={styles.commentHeader}>
              <span className={styles.author}>{comment.author}</span>
              <span className={styles.date}>
                {new Date(comment.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <p className={styles.commentText}>{comment.text}</p>
            <div className={styles.commentActions}>
              <button
                className={classNames(styles.actionButton, {
                  [styles.liked]: comment.isLiked
                })}
                onClick={() => dispatch(toggleCommentLike({ articleId, commentIndex: index }))}
              >
                ❤ {comment.likes}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
