import { createSlice } from '@reduxjs/toolkit';
import { getArticles } from '../../helpers/get-articles';

const initialState = {
  articles: [],
  sortBy: 'date',
  sortOrder: 'desc',
};

export const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    addArticle: (state, action) => {
      const newArticleId = state.articles.length 
        ? Math.max(...state.articles.map(item => item.articleId)) + 1 
        : 1;
      state.articles.push({
        ...action.payload,
        articleId: newArticleId,
        createdAt: new Date().toISOString(),
      });
    },
    updateArticle: (state, action) => {
      const index = state.articles.findIndex(article => article.articleId === action.payload.articleId);
      if (index !== -1) {
        state.articles[index] = action.payload;
      }
    },
    toggleArticleLike: (state, action) => {
      const article = state.articles.find(article => article.articleId === action.payload.articleId);
      if (article) {
        article.currentLikes = action.payload.liked 
          ? article.currentLikes - 1 
          : article.currentLikes + 1;
      }
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    sortArticles: (state) => {
      state.articles.sort((a, b) => {
        const compareValue = state.sortBy === 'date'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : b.currentLikes - a.currentLikes;
        return state.sortOrder === 'desc' ? compareValue : -compareValue;
      });
    },
  },
});

// Thunk для асинхронной загрузки статей
export const fetchArticles = () => async (dispatch) => {
  try {
    const articles = await getArticles();
    const enhancedArticles = articles.map(article => ({
      ...article,
      createdAt: article.createdAt || new Date().toISOString(),
    }));
    dispatch(setArticles(enhancedArticles));
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

export const {
  setArticles,
  addArticle,
  updateArticle,
  toggleArticleLike,
  setSortBy,
  setSortOrder,
  sortArticles,
} = articlesSlice.actions;

export default articlesSlice.reducer;
