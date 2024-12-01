import { createSlice } from '@reduxjs/toolkit';
import { login, logout, getCurrentUser } from '../../utils/auth';

const initialState = {
  user: getCurrentUser(),
  status: 'idle',
  error: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = 'idle';
      state.error = null;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'idle';
    }
  }
});

export const { setUser, setStatus, setError } = authSlice.actions;

// Thunks
export const loginUser = (username, password) => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const user = await login(username, password);
    dispatch(setUser(user));
  } catch (error) {
    dispatch(setError(error.message));
  }
};

export const logoutUser = () => (dispatch) => {
  logout();
  dispatch(setUser(null));
};

export default authSlice.reducer;
