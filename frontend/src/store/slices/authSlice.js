import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../../services/api";

const persistedUser = localStorage.getItem("issue-tracker-user");

const initialState = {
  user: persistedUser ? JSON.parse(persistedUser) : null,
  loading: false,
  error: null
};

const getApiErrorMessage = (error, fallback) => {
  return error.response?.data?.message || fallback;
};

export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.register(payload);
      localStorage.setItem("issue-tracker-user", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Registration failed"));
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.login(payload);
      localStorage.setItem("issue-tracker-user", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Login failed"));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
      localStorage.removeItem("issue-tracker-user");
    },
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
