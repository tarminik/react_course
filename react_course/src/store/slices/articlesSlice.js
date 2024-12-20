import { createSlice } from '@reduxjs/toolkit';
import { getArticles } from '../../helpers/get-articles';
import articles from '../../data/articles.json';
import comments from '../../data/comments.json';

// Подсчитываем количество комментариев для каждой статьи
const initialArticles = articles.map(article => ({
  ...article,
  commentsCount: comments.filter(comment => comment.articleId === article.id).length
}));

const initialState = {
  articles: initialArticles,
  status: 'idle',
  error: null
};

export const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
      state.status = 'succeeded';
    },
    addArticle: (state, action) => {
      state.articles.unshift(action.payload);
    },
    toggleArticleLike: (state, action) => {
      const article = state.articles.find(a => a.id === action.payload);
      if (article) {
        article.isLiked = !article.isLiked;
        article.likes = article.isLiked ? article.likes + 1 : article.likes - 1;
      }
    },
    updateCommentsCount: (state, action) => {
      const { articleId, count } = action.payload;
      const article = state.articles.find(a => a.id === articleId);
      if (article) {
        article.commentsCount = count;
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    }
  }
});

export const { setArticles, addArticle, toggleArticleLike, updateCommentsCount, setStatus, setError } = articlesSlice.actions;

// Thunk для асинхронной загрузки статей
export const fetchArticles = () => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const articles = await getArticles();
    dispatch(setArticles(articles));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export default articlesSlice.reducer;
