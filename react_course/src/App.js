import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import ArticlesPage from './pages/ArticlesPage';
import ArticlePage from './pages/ArticlePage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';
import styles from './App.module.scss';

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <Header />
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<ArticlesPage />} />
            <Route path="/articles/:id" element={<ArticlePage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;