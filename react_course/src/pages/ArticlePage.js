import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Comments from '../components/Comments';
import styles from './Pages.module.scss';

function ArticlePage() {
  const { id } = useParams();
  
  const article = useSelector(state => 
    state.articles.articles.find(a => a.id === id)
  );

  useEffect(() => {
    if (article) {
      console.info(
        `%cUser visited article: ${article.title} at ${new Date().toLocaleString('ru-RU')}`,
        'color: #2196F3; font-weight: bold;'
      );
    }
  }, [article]);

  if (!article) {
    return <Navigate to="/404" />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.articleContainer}>
        <div className={styles.imageContainer}>
          <img 
            src={article.imageUrl} 
            alt={article.title} 
            className={styles.image}
          />
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>{article.title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>{article.author}</span>
            <span className={styles.date}>
              {new Date(article.createdAt).toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <p className={styles.text}>{article.text}</p>
        </div>
      </div>
      <Comments articleId={id} />
    </div>
  );
}

export default ArticlePage;
