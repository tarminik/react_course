import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import styles from './Header.module.scss';

function Header() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>
        Блог
      </Link>
      <div className={styles.auth}>
        {user ? (
          <>
            <span className={styles.username}>
              {user.displayName}
            </span>
            <button 
              onClick={handleLogout}
              className={styles.button}
            >
              Выйти
            </button>
          </>
        ) : (
          <Link to="/auth" className={styles.button}>
            Войти
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
