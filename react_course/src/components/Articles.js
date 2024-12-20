import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchArticles } from '../store/slices/articlesSlice';
import ArticleForm from './ArticleForm';
import Card from './Card';
import Modal from './Modal';
import styles from './Articles.module.scss';

function Articles() {
  const dispatch = useDispatch();
  const { articles, status } = useSelector(state => state.articles);
  const user = useSelector(state => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const sortedArticles = [...articles].sort((a, b) => {
    if (sortBy === 'likes') {
      return b.likes - a.likes;
    }
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (status === 'loading') {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (status === 'failed') {
    return <div className={styles.error}>Ошибка при загрузке статей</div>;
  }

  return (
    <div className={styles.articles}>
      <div className={styles.controls}>
        <div className={styles.sortControls}>
          <button
            className={`${styles.button} ${sortBy === 'date' ? styles.active : ''}`}
            onClick={() => setSortBy('date')}
          >
            По дате
          </button>
          <button
            className={`${styles.button} ${sortBy === 'likes' ? styles.active : ''}`}
            onClick={() => setSortBy('likes')}
          >
            По лайкам
          </button>
        </div>
        {user && (
          <button
            className={`${styles.button} ${styles.addButton}`}
            onClick={handleOpenModal}
          >
            Добавить статью
          </button>
        )}
      </div>

      <div className={styles.grid}>
        {sortedArticles.map(article => (
          <Card key={article.id} data={article} />
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <ArticleForm onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}

export default Articles;
