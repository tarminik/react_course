import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  articles: [
    {
      articleId: '1',
      title: 'Введение в React',
      text: 'React - это библиотека JavaScript для создания пользовательских интерфейсов. React позволяет создавать сложные UI из маленьких и изолированных частей кода, называемых "компонентами".',
      createdAt: new Date('2023-06-10').toISOString(),
      isLiked: false,
      currentLikes: 5
    },
    {
      articleId: '2',
      title: 'React Router',
      text: 'React Router - это стандартная библиотека для маршрутизации в React. Она позволяет создавать многостраничные приложения с навигацией без перезагрузки страницы.',
      createdAt: new Date('2023-06-11').toISOString(),
      isLiked: false,
      currentLikes: 3
    },
    {
      articleId: '3',
      title: 'Redux Toolkit',
      text: 'Redux Toolkit - это официальный набор инструментов для эффективной разработки с Redux. Он упрощает наиболее распространенные варианты использования Redux, включая настройку хранилища, создание редюсеров и выполнение иммутабельных обновлений.',
      createdAt: new Date('2023-06-12').toISOString(),
      isLiked: false,
      currentLikes: 7
    }
  ],
  sortBy: 'date',
  sortOrder: 'desc',
};

export const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    addArticle: (state, action) => {
      const newArticle = {
        ...action.payload,
        articleId: uuidv4(),
        createdAt: new Date().toISOString(),
        isLiked: false,
        currentLikes: 0,
      };
      state.articles.push(newArticle);
    },
    toggleArticleLike: (state, action) => {
      const article = state.articles.find(
        (article) => article.articleId === action.payload.articleId
      );
      if (article) {
        article.isLiked = !article.isLiked;
        article.currentLikes += article.isLiked ? 1 : -1;
      }
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    sortArticles: (state) => {
      const { sortBy, sortOrder } = state;
      state.articles.sort((a, b) => {
        let comparison = 0;
        if (sortBy === 'date') {
          comparison = new Date(b.createdAt) - new Date(a.createdAt);
        } else if (sortBy === 'likes') {
          comparison = b.currentLikes - a.currentLikes;
        }
        return sortOrder === 'desc' ? comparison : -comparison;
      });
    },
    fetchArticles: (state) => {
      // Здесь можно добавить начальные статьи для тестирования
      if (state.articles.length === 0) {
        state.articles = [
          {
            articleId: uuidv4(),
            title: 'React Router',
            text: 'React Router - это стандартная библиотека для маршрутизации в React. Она позволяет создавать многостраничные приложения с навигацией без перезагрузки страницы.',
            createdAt: new Date().toISOString(),
            isLiked: false,
            currentLikes: 0,
          },
          {
            articleId: uuidv4(),
            title: 'Redux Toolkit',
            text: 'Redux Toolkit - это официальный набор инструментов для эффективной разработки с Redux. Он упрощает наиболее распространенные варианты использования Redux, включая настройку хранилища, создание редюсеров и выполнение иммутабельных обновлений.',
            createdAt: new Date(Date.now() - 86400000).toISOString(), // вчера
            isLiked: false,
            currentLikes: 0,
          },
        ];
      }
    },
  },
});

export const {
  addArticle,
  toggleArticleLike,
  setSortBy,
  setSortOrder,
  sortArticles,
  fetchArticles,
} = articlesSlice.actions;

export default articlesSlice.reducer;
