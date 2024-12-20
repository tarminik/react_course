import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../store/slices/articlesSlice';
import Articles from '../components/Articles';
import styles from './Pages.module.scss';

function ArticlesPage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  return (
    <div className={styles.page}>
      <Articles />
    </div>
  );
}

export default ArticlesPage;
