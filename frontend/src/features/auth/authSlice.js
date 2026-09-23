import { createSlice } from '@reduxjs/toolkit';

/**
 * Auth Slice — Manages authentication state for CareConnect.
 *
 * Stores the JWT token and user object from the backend.
 * Token is persisted in localStorage so sessions survive page refresh.
 */

const storedToken = localStorage.getItem('careconnect_token');
const storedUser = (() => {
  try {
    const raw = localStorage.getItem('careconnect_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

if (storedToken && !storedUser) {
  localStorage.removeItem('careconnect_token');
}
if (storedUser && !storedToken) {
  localStorage.removeItem('careconnect_user');
}

const hasSession = Boolean(storedToken && storedUser);

const initialState = {
  token: hasSession ? storedToken : null,
  user: hasSession ? storedUser : null,
  isAuthenticated: hasSession,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user } = action.payload || {};

      if (!token || !user) {
        return;
      }

      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      localStorage.setItem('careconnect_token', token);
      localStorage.setItem('careconnect_user', JSON.stringify(user));
    },
    updateUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('careconnect_user', JSON.stringify(action.payload));
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('careconnect_token');
      localStorage.removeItem('careconnect_user');
    },
  },
});

export const { setCredentials, updateUser, clearCredentials } = authSlice.actions;

/* Selectors */
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectUserRole = (state) => state.auth.user?.role || null;

export default authSlice.reducer;
