import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Pages.module.scss';

function NotFoundPage() {
  return (
    <div className={styles.page}>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className={styles.link}>
        Return to Home Page
      </Link>
    </div>
  );
}

export default NotFoundPage;
