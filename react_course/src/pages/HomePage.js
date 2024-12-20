import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Pages.module.scss';

function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.homeContent}>
        <h1>Welcome to React Course Blog</h1>
        <p className={styles.description}>
          This is a simple blog application built with React, featuring:
        </p>
        <ul className={styles.featureList}>
          <li>React Router for navigation</li>
          <li>Redux Toolkit for state management</li>
          <li>Article creation and management</li>
          <li>Like system</li>
          <li>Comment system</li>
          <li>Sorting functionality</li>
        </ul>
        <Link to="/articles" className={styles.button}>
          View All Articles
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
