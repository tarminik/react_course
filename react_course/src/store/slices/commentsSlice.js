import { createSlice } from '@reduxjs/toolkit';
import { getComments } from '../../helpers/get-comments-by-article';

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
    toggleCommentLike: (state, action) => {
      const { articleId, commentIndex } = action.payload;
      const comment = state.commentsByArticle[articleId]?.[commentIndex];
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likes = comment.isLiked ? comment.likes + 1 : comment.likes - 1;
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

// Thunk для асинхронной загрузки комментариев
export const fetchComments = (articleId) => async (dispatch) => {
  try {
    dispatch({ type: 'comments/setStatus', payload: 'loading' });
    const comments = await getComments(articleId);
    dispatch(setComments({ articleId, comments }));
    dispatch({ type: 'comments/setStatus', payload: 'succeeded' });
  } catch (error) {
    console.error('Error fetching comments:', error);
    dispatch({ type: 'comments/setStatus', payload: 'failed' });
    dispatch({ type: 'comments/setError', payload: error.message });
  }
};

export const { setComments, addComment, toggleCommentLike, setStatus, setError } = commentsSlice.actions;

export default commentsSlice.reducer;
