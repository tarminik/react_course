import React, { useEffect, useState } from 'react';
import { getArticles } from './helpers/get-articles';
import Card from './components/Card';
import styles from './App.module.scss';

function App() {
  const [articles, setArticles] = useState([]);
  const [newCard, setNewCard] = useState({ title: '', text: '', currentLikes: 0, commentsCount: 0 });

  // Асинхронная загрузка статей при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      const data = await getArticles();
      setArticles(data);
    };
    fetchData();
  }, []);

  // Функция для добавления новой карточки
  const addCard = () => {
    if (newCard.title && newCard.text) {
      const newArticleId = articles.length ? Math.max(...articles.map(item => item.articleId)) + 1 : 1;
      const cardToAdd = { ...newCard, articleId: newArticleId };
      setArticles([...articles, cardToAdd]);
      setNewCard({ title: '', text: '', currentLikes: 0, commentsCount: 0 });
    }
  };

  return (
    <div className={styles.app}>
      <header className={styles.app__header}>
        <h1>Card List</h1>
      </header>
      <div className={styles.cardContainer}>
        {articles.map((item) => (
          <Card key={item.articleId} data={item} />
        ))}
      </div>
      <div className={styles.app__addForm}>
        <input
          type="text"
          value={newCard.title}
          onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
          placeholder="Title"
        />
        <input
          type="text"
          value={newCard.text}
          onChange={(e) => setNewCard({ ...newCard, text: e.target.value })}
          placeholder="Text"
        />
        <button onClick={addCard}>Add Card</button>
      </div>
    </div>
  );
}

export default App;