import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '../components/Card';
import Comments from '../components/Comments';
import styles from './Pages.module.scss';

function ArticlePage() {
  const { articleId } = useParams();
  const article = useSelector(state => 
    state.articles.articles.find(a => a.articleId === articleId)
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
      <Card data={article} showFullContent={true} />
      <Comments articleId={articleId} />
    </div>
  );
}

export default ArticlePage;
