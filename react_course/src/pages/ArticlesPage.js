import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import styles from './Pages.module.scss';
import Card from '../components/Card';
import { 
  setSortBy,
  setSortOrder,
  sortArticles,
  addArticle,
} from '../store/slices/articlesSlice';

function ArticlesPage() {
  const dispatch = useDispatch();
  const articles = useSelector(state => state.articles.articles);
  const sortBy = useSelector(state => state.articles.sortBy);
  const sortOrder = useSelector(state => state.articles.sortOrder);

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
    <div className={styles.page}>
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

      <div className={styles.articlesGrid}>
        {articles.map(article => (
          <Link 
            key={article.articleId}
            to={`/articles/${article.articleId}`}
            className={styles.articleLink}
          >
            <Card data={article} showFullContent={false} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ArticlesPage;
