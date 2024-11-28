import { createSlice } from '@reduxjs/toolkit';
import { getComments } from '../../helpers/get-comments-by-article';
import { updateCommentsCount } from './articlesSlice';

const initialState = {
  commentsByArticle: {},
  status: 'idle',
  error: null
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setComments: (state, action) => {
      const { articleId, comments } = action.payload;
      state.commentsByArticle[articleId] = comments.map(comment => ({
        ...comment,
        id: comment.id || Date.now().toString(),
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
        id: comment.id || Date.now().toString(),
        articleId: articleId.toString(),
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false,
      });
    },
    toggleCommentLike: (state, action) => {
      const { articleId, commentId } = action.payload;
      const comments = state.commentsByArticle[articleId];
      if (comments) {
        const comment = comments.find(c => c.id === commentId);
        if (comment) {
          comment.isLiked = !comment.isLiked;
          comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1;
        }
      }
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const fetchComments = (articleId) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const comments = await getComments(articleId);
    dispatch(setComments({ articleId, comments }));
    dispatch(updateCommentsCount({ articleId, count: comments.length }));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    console.error('Error fetching comments:', error);
    dispatch(setStatus('failed'));
    dispatch(setError(error.message));
  }
};

export const addCommentWithCount = (articleId, comment) => (dispatch, getState) => {
  dispatch(addComment({ articleId, comment }));
  const comments = getState().comments.commentsByArticle[articleId] || [];
  dispatch(updateCommentsCount({ articleId, count: comments.length }));
};

export const { setComments, addComment, toggleCommentLike, setStatus, setError } = commentsSlice.actions;

export default commentsSlice.reducer;
