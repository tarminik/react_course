import React, { useReducer, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import styles from './Comments.module.scss';
import { addComment, toggleCommentLike, fetchComments } from '../store/slices/commentsSlice';
import { apiRequest } from '../utils/api';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTHOR':
      return { ...state, author: action.payload };
    case 'SET_TEXT':
      return { ...state, text: action.payload };
    case 'RESET':
      return { author: '', text: '' };
    default:
      return state;
  }
};

const initialFormState = {
  author: '',
  text: ''
};

function Comments({ articleId }) {
  const dispatch = useDispatch();
  const [formState, formDispatch] = useReducer(formReducer, initialFormState);
  
  const comments = useSelector(state => 
    state.comments.commentsByArticle[articleId] || []
  );
  const [sortBy, setSortBy] = React.useState('date');

  useEffect(() => {
    dispatch(fetchComments(articleId));
  }, [dispatch, articleId]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!formState.author.trim() || !formState.text.trim()) return;

    try {
      const newComment = {
        id: Date.now().toString(),
        articleId,
        author: formState.author,
        text: formState.text,
        createdAt: new Date().toISOString(),
      };

      await apiRequest(async () => {
        // Имитация задержки API
        await new Promise(resolve => setTimeout(resolve, 500));
        dispatch(addComment({ articleId, comment: newComment }));
      });

      formDispatch({ type: 'RESET' });
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }, [articleId, dispatch, formState]);

  const handleLike = useCallback((commentIndex) => {
    dispatch(toggleCommentLike({ articleId, commentIndex }));
  }, [dispatch, articleId]);

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes - a.likes;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className={styles.comments}>
      <div className={styles.header}>
        <h3>Комментарии ({comments.length})</h3>
        <div className={styles.sortButtons}>
          <button
            className={classNames(styles.sortButton, { [styles.active]: sortBy === 'date' })}
            onClick={() => setSortBy('date')}
          >
            По дате ↓
          </button>
          <button
            className={classNames(styles.sortButton, { [styles.active]: sortBy === 'likes' })}
            onClick={() => setSortBy('likes')}
          >
            По лайкам
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Ваше имя"
          value={formState.author}
          onChange={(e) => formDispatch({ 
            type: 'SET_AUTHOR', 
            payload: e.target.value 
          })}
          className={styles.input}
        />
        <textarea
          placeholder="Ваш комментарий"
          value={formState.text}
          onChange={(e) => formDispatch({ 
            type: 'SET_TEXT', 
            payload: e.target.value 
          })}
          className={styles.textarea}
        />
        <button type="submit" className={styles.submitButton}>
          Отправить
        </button>
      </form>

      <div className={styles.list}>
        {sortedComments.map((comment, index) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <span className={styles.author}>{comment.author}</span>
              <span className={styles.date}>
                {new Date(comment.createdAt).toLocaleDateString('ru-RU', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            <p className={styles.text}>{comment.text}</p>
            <button
              className={classNames(styles.likeButton, {
                [styles.liked]: comment.isLiked,
              })}
              onClick={() => handleLike(index)}
            >
              ❤ {comment.likes}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Comments;
