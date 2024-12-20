import React from 'react';
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
