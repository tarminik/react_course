import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toggleArticleLike } from '../store/slices/articlesSlice';
import styles from './Card.module.scss';
import { ReactComponent as LikeIcon } from '../assets/icons/like.svg';
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg';
import defaultImage from '../assets/images/default-article.svg';

function Card({ data }) {
  const dispatch = useDispatch();

  const handleLikeClick = (e) => {
    e.preventDefault();
    dispatch(toggleArticleLike(data.id));
  };

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  return (
    <Link to={`/articles/${data.id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={data.imageUrl || defaultImage} 
          alt={data.title} 
          className={styles.image}
          onError={handleImageError}
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{data.title}</h2>
        <div className={styles.meta}>
          <span className={styles.author}>{data.author}</span>
          <span className={styles.date}>
            {new Date(data.createdAt).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <p className={styles.text}>{data.text}</p>
        <div className={styles.actions}>
          <button 
            className={`${styles.actionButton} ${data.isLiked ? styles.liked : ''}`}
            onClick={handleLikeClick}
          >
            <LikeIcon className={styles.icon} />
            <span>{data.likes}</span>
          </button>
          <div className={styles.actionButton}>
            <CommentIcon className={styles.icon} />
            <span>{data.commentsCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Card;
