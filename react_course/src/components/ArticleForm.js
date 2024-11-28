import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addArticle } from '../store/slices/articlesSlice';
import styles from './ArticleForm.module.scss';
import defaultImage from '../assets/images/default-article.svg';

function ArticleForm({ onClose }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  const [formData, setFormData] = useState({
    title: '',
    text: '',
    imageUrl: ''
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.text.trim()) return;

    const newArticle = {
      id: Date.now().toString(),
      title: formData.title,
      text: formData.text,
      imageUrl: formData.imageUrl || defaultImage,
      author: user ? user.displayName : 'Аноним',
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      commentsCount: 0
    };

    dispatch(addArticle(newArticle));
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div 
        className={`${styles.imageUpload} ${dragActive ? styles.dragActive : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {imagePreview ? (
          <img src={imagePreview} alt="Preview" className={styles.preview} />
        ) : (
          <>
            <img src={defaultImage} alt="Default" className={styles.defaultImage} />
            <p>Перетащите изображение сюда или кликните для выбора</p>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className={styles.fileInput}
        />
      </div>

      <div className={styles.formGroup}>
        <input
          type="text"
          name="title"
          placeholder="Заголовок статьи"
          value={formData.title}
          onChange={handleChange}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <textarea
          name="text"
          placeholder="Текст статьи"
          value={formData.text}
          onChange={handleChange}
          className={styles.textarea}
          required
        />
      </div>

      <div className={styles.buttons}>
        <button type="submit" className={styles.submitButton}>
          Создать
        </button>
        <button 
          type="button" 
          onClick={onClose}
          className={styles.cancelButton}
        >
          Отмена
        </button>
      </div>
    </form>
  );
}

export default ArticleForm;
