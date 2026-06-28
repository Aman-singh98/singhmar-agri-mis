// authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

export const loginUser = createAsyncThunk(
   "auth/loginUser",
   async ({ email, password, role }, { rejectWithValue }) => {
      try {
         const res = await api.post("/auth/login", { email, password, role });
         return res.data; 
      } catch (err) {
         return rejectWithValue(err?.response?.data?.message ?? "Login failed. Please try again.");
      }
   }
);

export const fetchCurrentUser = createAsyncThunk(
   "auth/fetchCurrentUser",
   async (_, { rejectWithValue }) => {
      try {
         const res = await api.get("/auth/me");
         return res.data.user;
      } catch (err) {
         return rejectWithValue(err?.response?.data?.message ?? "Failed to fetch current user.");
      }
   }
);

const storedToken = localStorage.getItem("token");
const storedUser  = localStorage.getItem("user");

const initialState = {
   token: storedToken || null,
   user: storedUser ? JSON.parse(storedUser) : null,

   loginLoading: false,
   loginError: "",

   meLoading: false,
   meError: "",
};

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      logout(state) {
         state.token = null;
         state.user = null;
         localStorage.removeItem("token");
         localStorage.removeItem("user");
      },
      resetLoginError(state) {
         state.loginError = "";
      },
   },
   extraReducers: (builder) => {
      builder
         // loginUser
         .addCase(loginUser.pending, (state) => {
            state.loginLoading = true;
            state.loginError = "";
         })
         .addCase(loginUser.fulfilled, (state, action) => {
            state.loginLoading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("user", JSON.stringify(action.payload.user));
         })
         .addCase(loginUser.rejected, (state, action) => {
            state.loginLoading = false;
            state.loginError = action.payload;
         })

         // fetchCurrentUser
         .addCase(fetchCurrentUser.pending, (state) => {
            state.meLoading = true;
            state.meError = "";
         })
         .addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.meLoading = false;
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
         })
         .addCase(fetchCurrentUser.rejected, (state, action) => {
            state.meLoading = false;
            state.meError = action.payload;
         });
   },
});

export const { logout, resetLoginError } = authSlice.actions;
export default authSlice.reducer;