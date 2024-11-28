import React, { useEffect, useState } from 'react';
import { getArticles } from './helpers/get-articles';
import Card from './components/Card';
import styles from './App.module.scss';

function App() {
  const [articles, setArticles] = useState([]);
  const [newCard, setNewCard] = useState({ 
    title: '', 
    text: '', 
    currentLikes: 0, 
    commentsCount: 0 
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getArticles();
      // Добавляем дату создания, если её нет
      const enhancedData = data.map(article => ({
        ...article,
        createdAt: article.createdAt || new Date().toISOString()
      }));
      setArticles(enhancedData);
    };
    fetchData();
  }, []);

  const addCard = () => {
    if (newCard.title && newCard.text) {
      const newArticleId = articles.length ? Math.max(...articles.map(item => item.articleId)) + 1 : 1;
      const cardToAdd = {
        ...newCard,
        articleId: newArticleId,
        createdAt: new Date().toISOString()
      };
      setArticles([...articles, cardToAdd]);
      setNewCard({ title: '', text: '', currentLikes: 0, commentsCount: 0 });
    }
  };

  const handleCardUpdate = (updatedCard) => {
    setArticles(articles.map(article => 
      article.articleId === updatedCard.articleId ? updatedCard : article
    ));
  };

  const sortArticles = () => {
    const sortedArticles = [...articles].sort((a, b) => {
      const compareValue = sortBy === 'date'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : b.currentLikes - a.currentLikes;
      return sortOrder === 'desc' ? compareValue : -compareValue;
    });
    setArticles(sortedArticles);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  return (
    <div className={styles.app}>
      <header className={styles.app__header}>
        <h1>Card List</h1>
        <div className={styles.app__sortControls}>
          <button
            className={styles.app__sortButton}
            onClick={() => {
              setSortBy('date');
              sortArticles();
            }}
          >
            Sort by Date {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            className={styles.app__sortButton}
            onClick={() => {
              setSortBy('likes');
              sortArticles();
            }}
          >
            Sort by Likes {sortBy === 'likes' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            className={styles.app__sortButton}
            onClick={toggleSortOrder}
          >
            Toggle Order
          </button>
        </div>
      </header>

      <div className={styles.app__addForm}>
        <input
          type="text"
          value={newCard.title}
          onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
          placeholder="Title"
          className={styles.app__input}
        />
        <textarea
          value={newCard.text}
          onChange={(e) => setNewCard({ ...newCard, text: e.target.value })}
          placeholder="Text"
          className={styles.app__textarea}
        />
        <button 
          onClick={addCard}
          className={styles.app__addButton}
        >
          Add Card
        </button>
      </div>

      <div className={styles.cardContainer}>
        {articles.map((item) => (
          <Card 
            key={item.articleId} 
            data={item}
            onUpdate={handleCardUpdate}
          />
        ))}
      </div>
    </div>
  );
}

export default App;