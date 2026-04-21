import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: []
};

const toastSlice = createSlice({
  name: "toasts",
  initialState,
  reducers: {
    pushToast: (state, action) => {
      state.items.push({
        id: Date.now() + Math.random(),
        type: action.payload.type || "info",
        message: action.payload.message
      });
    },
    removeToast: (state, action) => {
      state.items = state.items.filter((toast) => toast.id !== action.payload);
    }
  }
});

export const { pushToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
