import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const CACHE_DURATION_MS = 5 * 60 * 1000;

const isStale = (lastFetchedAt) => {
  if (!lastFetchedAt) return true;

  return Date.now() - lastFetchedAt > CACHE_DURATION_MS;
};

export const initializeAppData = createAsyncThunk(
  "app/initializeAppData",
  async (_, { getState }) => {
    const state = getState();

    // Future API calls here
    // Example:
    // if (isStale(state.users.lastFetchedAt)) { ... }

    return true;
  }
);

const initialState = {
  initialized: false,
  loading: false,
  error: null
};

const appSlice = createSlice({
  name: "app",

  initialState,

  reducers: {
    resetAppData: (state) => {
      state.initialized = false;
      state.loading = false;
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder

      .addCase(initializeAppData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(initializeAppData.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
      })

      .addCase(initializeAppData.rejected, (state, action) => {
        state.loading = false;
        state.initialized = false;
        state.error = action.error.message;
      });
  }
});

export const { resetAppData } = appSlice.actions;

export { isStale };

export default appSlice.reducer;