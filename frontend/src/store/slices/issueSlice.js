import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { issueApi } from "../../services/api";

const initialState = {
  items: [],
  currentIssue: null,
  stats: {
    Open: 0,
    InProgress: 0,
    Resolved: 0,
    Closed: 0
  },
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  detailsLoading: false,
  statsLoading: false,
  actionLoading: false,
  error: null,
  lastQuery: {
    search: "",
    status: "",
    priority: "",
    severity: "",
    page: 1,
    limit: 6
  }
};

const getApiErrorMessage = (error, fallback) => {
  return error.response?.data?.message || fallback;
};

const normalizeQuery = (query) => {
  const normalized = {};
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      normalized[key] = value;
    }
  });
  return normalized;
};

export const fetchIssues = createAsyncThunk(
  "issues/fetchIssues",
  async (query, { rejectWithValue }) => {
    try {
      const normalized = normalizeQuery(query);
      const { data } = await issueApi.getIssues(normalized);
      return { ...data, query: normalized };
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch issues"));
    }
  }
);

export const fetchStats = createAsyncThunk(
  "issues/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await issueApi.getStats();
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch stats"));
    }
  }
);

export const fetchIssueById = createAsyncThunk(
  "issues/fetchIssueById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await issueApi.getIssueById(id);
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to fetch issue"));
    }
  }
);

export const createIssue = createAsyncThunk(
  "issues/createIssue",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await issueApi.createIssue(payload);
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to create issue"));
    }
  }
);

export const editIssue = createAsyncThunk(
  "issues/editIssue",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await issueApi.updateIssue(id, payload);
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to update issue"));
    }
  }
);

export const changeIssueStatus = createAsyncThunk(
  "issues/changeIssueStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await issueApi.updateStatus(id, status);
      return data;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to update status"));
    }
  }
);

export const removeIssue = createAsyncThunk(
  "issues/removeIssue",
  async (id, { rejectWithValue }) => {
    try {
      await issueApi.deleteIssue(id);
      return id;
    } catch (error) {
      return rejectWithValue(getApiErrorMessage(error, "Failed to delete issue"));
    }
  }
);

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    clearIssueError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssues.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.issues;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.lastQuery = {
          ...state.lastQuery,
          ...action.payload.query,
          page: action.payload.page,
          limit: action.payload.query.limit || state.lastQuery.limit
        };
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchStats.pending, (state) => {
        state.statsLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state) => {
        state.statsLoading = false;
      })
      .addCase(fetchIssueById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchIssueById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentIssue = action.payload;
      })
      .addCase(fetchIssueById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      })
      .addCase(createIssue.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createIssue.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(createIssue.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(editIssue.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(editIssue.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentIssue = action.payload;
      })
      .addCase(editIssue.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(changeIssueStatus.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(changeIssueStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.currentIssue = action.payload;
      })
      .addCase(changeIssueStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(removeIssue.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(removeIssue.fulfilled, (state) => {
        state.actionLoading = false;
      })
      .addCase(removeIssue.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearIssueError } = issueSlice.actions;
export default issueSlice.reducer;
