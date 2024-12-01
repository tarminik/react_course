import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from './slices/articlesSlice';
import commentsReducer from './slices/commentsSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    comments: commentsReducer,
    auth: authReducer,
  },
});

export default store;
