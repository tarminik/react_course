import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../store/slices/authSlice';
import styles from './Pages.module.scss';

function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(loginUser(formData.username, formData.password));
    navigate('/');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Авторизация</h1>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        <div className={styles.formGroup}>
          <input
            type="text"
            name="username"
            placeholder="Имя пользователя"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>
        <button 
          type="submit" 
          className={styles.button}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Вход...' : 'Войти'}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
