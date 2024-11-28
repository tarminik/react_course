import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import styles from './Card.module.scss';
import { toggleArticleLike } from '../store/slices/articlesSlice';
import Comments from './Comments';

function Card({ data, showFullContent = false }) {
  const [showComments, setShowComments] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const isArticlePage = location.pathname.includes('/articles/');

  const handleLikeClick = (e) => {
    e.preventDefault();
    dispatch(toggleArticleLike({ articleId: data.articleId }));
  };

  const toggleComments = (e) => {
    e.preventDefault();
    setShowComments(!showComments);
  };

  const displayText = showFullContent 
    ? data.text 
    : data.text.length > 100 
      ? `${data.text.slice(0, 100)}...` 
      : data.text;

  const formattedDate = data.createdAt 
    ? new Date(data.createdAt).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Дата не указана';

  return (
    <article className={styles.card}>
      <Link to={`/articles/${data.articleId}`} className={styles.cardLink}>
        <h2 className={styles.title}>{data.title}</h2>
        <p className={styles.text}>{displayText}</p>
        
        <div className={styles.footer}>
          <div className={styles.meta}>
            <span className={styles.date}>{formattedDate}</span>
            {!isArticlePage && (
              <button 
                className={styles.commentsButton}
                onClick={toggleComments}
              >
                💬 Комментарии
              </button>
            )}
          </div>
          <button
            className={classNames(styles.likeButton, {
              [styles.liked]: data.isLiked,
            })}
            onClick={handleLikeClick}
          >
            ❤ {data.currentLikes}
          </button>
        </div>
      </Link>
      
      {showComments && !isArticlePage && (
        <div className={styles.commentsSection}>
          <Comments articleId={data.articleId} />
        </div>
      )}
    </article>
  );
}

export default Card;
