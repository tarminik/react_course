import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import Card from './components/Card';
import styles from './App.module.scss';
import { 
  fetchArticles,
  setSortBy,
  setSortOrder,
  sortArticles,
  addArticle,
} from './store/slices/articlesSlice';

function App() {
  const dispatch = useDispatch();
  const articles = useSelector(state => state.articles.articles);
  const sortBy = useSelector(state => state.articles.sortBy);
  const sortOrder = useSelector(state => state.articles.sortOrder);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleAddArticle = () => {
    const title = prompt('Enter article title:');
    const text = prompt('Enter article text:');
    
    if (title && text) {
      dispatch(addArticle({
        title,
        text,
        currentLikes: 0,
      }));
    }
  };

  const handleSort = (newSortBy) => {
    dispatch(setSortBy(newSortBy));
    dispatch(sortArticles());
  };

  const toggleSortOrder = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    dispatch(setSortOrder(newOrder));
    dispatch(sortArticles());
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>React Course Blog</h1>
        <div className={styles.controls}>
          <button
            className={classNames(styles.button, styles['button--add'])}
            onClick={handleAddArticle}
          >
            Add Article
          </button>
          <div className={styles.sortControls}>
            <button
              className={styles.button}
              onClick={() => handleSort('date')}
            >
              Sort by Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              className={styles.button}
              onClick={() => handleSort('likes')}
            >
              Sort by Likes {sortBy === 'likes' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              className={styles.button}
              onClick={toggleSortOrder}
            >
              Toggle Order
            </button>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        {articles.map((article) => (
          <Card
            key={article.articleId}
            data={article}
          />
        ))}
      </main>
    </div>
  );
}

export default App;