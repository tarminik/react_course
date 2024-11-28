import { createSlice } from '@reduxjs/toolkit';
import { getComments } from '../../helpers/get-comments-by-article';

const initialState = {
  commentsByArticle: {},
  sortBy: 'date',
  sortOrder: 'desc',
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action) => {
      const { articleId, comments } = action.payload;
      state.commentsByArticle[articleId] = comments.map(comment => ({
        ...comment,
        createdAt: comment.createdAt || new Date().toISOString(),
        likes: comment.likes || 0,
        isLiked: false,
      }));
    },
    addComment: (state, action) => {
      const { articleId, comment } = action.payload;
      if (!state.commentsByArticle[articleId]) {
        state.commentsByArticle[articleId] = [];
      }
      state.commentsByArticle[articleId].push({
        ...comment,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      });
    },
    updateComment: (state, action) => {
      const { articleId, commentIndex, text } = action.payload;
      if (state.commentsByArticle[articleId]?.[commentIndex]) {
        state.commentsByArticle[articleId][commentIndex].text = text;
      }
    },
    removeComment: (state, action) => {
      const { articleId, commentIndex } = action.payload;
      if (state.commentsByArticle[articleId]) {
        state.commentsByArticle[articleId] = state.commentsByArticle[articleId]
          .filter((_, index) => index !== commentIndex);
      }
    },
    toggleCommentLike: (state, action) => {
      const { articleId, commentIndex } = action.payload;
      const comment = state.commentsByArticle[articleId]?.[commentIndex];
      if (comment) {
        comment.likes = comment.isLiked ? comment.likes - 1 : comment.likes + 1;
        comment.isLiked = !comment.isLiked;
      }
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    sortComments: (state, action) => {
      const { articleId } = action.payload;
      if (state.commentsByArticle[articleId]) {
        state.commentsByArticle[articleId].sort((a, b) => {
          const compareValue = state.sortBy === 'date'
            ? new Date(b.createdAt) - new Date(a.createdAt)
            : b.likes - a.likes;
          return state.sortOrder === 'desc' ? compareValue : -compareValue;
        });
      }
    },
  },
});

// Thunk для асинхронной загрузки комментариев
export const fetchComments = (articleId) => async (dispatch) => {
  try {
    const comments = await getComments(articleId);
    dispatch(setComments({ articleId, comments }));
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

export const {
  setComments,
  addComment,
  updateComment,
  removeComment,
  toggleCommentLike,
  setSortBy,
  setSortOrder,
  sortComments,
} = commentsSlice.actions;

export default commentsSlice.reducer;
