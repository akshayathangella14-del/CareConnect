import { createSlice } from '@reduxjs/toolkit';

/**
 * Realtime Slice — connection status, live toasts and freshness metadata.
 */
const MAX_TOASTS = 4;

const initialState = {
  status: 'idle', // idle | connecting | open | reconnecting | offline | closed
  lastEventAt: null,
  toasts: [],
};

const realtimeSlice = createSlice({
  name: 'realtime',
  initialState,
  reducers: {
    setRealtimeStatus: (state, action) => {
      state.status = action.payload;
    },
    markRealtimeEvent: (state) => {
      state.lastEventAt = new Date().toISOString();
    },
    pushToast: (state, action) => {
      const toast = action.payload;
      if (!toast?.id || state.toasts.some((item) => item.id === toast.id)) return;
      state.toasts = [toast, ...state.toasts].slice(0, MAX_TOASTS);
    },
    dismissToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    resetRealtime: () => initialState,
  },
});

export const {
  setRealtimeStatus,
  markRealtimeEvent,
  pushToast,
  dismissToast,
  resetRealtime,
} = realtimeSlice.actions;

export const selectRealtimeStatus = (state) => state.realtime.status;
export const selectRealtimeToasts = (state) => state.realtime.toasts;
export const selectLastRealtimeEventAt = (state) => state.realtime.lastEventAt;

export default realtimeSlice.reducer;
