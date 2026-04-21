import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import issueReducer from "./slices/issueSlice";
import toastReducer from "./slices/toastSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issueReducer,
    toasts: toastReducer
  }
});

export default store;
