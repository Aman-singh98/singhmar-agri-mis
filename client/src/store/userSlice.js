
// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// ── Async Thunks ──────────────────────────────────────────────────

export const fetchUsers = createAsyncThunk(
   "user/fetchUsers",
   async (_, { rejectWithValue }) => {
      try {
         const res = await api.get("/users");
         return res.data.users ?? res.data;
      } catch (err) {
         return rejectWithValue(err?.response?.data?.message ?? "Failed to fetch users.");
      }
   }
);

export const createUser = createAsyncThunk(
   "user/createUser",
   async (payload, { rejectWithValue }) => {
      try {
         const res = await api.post("/users", payload);
         return res.data.user;
      } catch (err) {
         return rejectWithValue(err?.response?.data?.message ?? "Failed to create user.");
      }
   }
);

export const updateUser = createAsyncThunk(
   "user/updateUser",
   async ({ id, payload }, { rejectWithValue }) => {
      try {
         const res = await api.put(`/users/${id}`, payload);
         return res.data.user;
      } catch (err) {
         return rejectWithValue(err?.response?.data?.message ?? "Failed to update user.");
      }
   }
);

export const deleteUser = createAsyncThunk(
   "user/deleteUser",
   async (id, { rejectWithValue }) => {
      try {
         await api.delete(`/users/${id}`);
         return id;
      } catch (err) {
         return rejectWithValue(err?.response?.data?.message ?? "Failed to delete user.");
      }
   }
);

export const resetUserPassword = createAsyncThunk(
   "user/resetUserPassword",
   async ({ id, newPassword }, { rejectWithValue }) => {
      try {
         const res = await api.put(`/users/${id}/reset-password`, { newPassword });
         return { id, message: res.data.message };
      } catch (err) {
         return rejectWithValue(err?.response?.data?.message ?? "Failed to reset password.");
      }
   }
);

// ── Slice ─────────────────────────────────────────────────────────

const initialState = {
   list: [],
   listLoading: false,
   listError: "",

   createLoading: false,
   createError: "",
   createSuccess: false,

   updateLoading: false,
   updateError: "",

   deleteLoadingId: null,
   deleteError: "",

   resetPasswordLoadingId: null,
   resetPasswordError: "",
   resetPasswordSuccess: false,
};

const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      resetCreateStatus(state) {
         state.createError = "";
         state.createSuccess = false;
      },
      resetUpdateStatus(state) {
         state.updateError = "";
      },
      resetDeleteStatus(state) {
         state.deleteError = "";
      },
      resetUserPasswordStatus(state) {
         state.resetPasswordError = "";
         state.resetPasswordSuccess = false;
      },
   },
   extraReducers: (builder) => {
      builder
         // fetchUsers
         .addCase(fetchUsers.pending, (state) => {
            state.listLoading = true;
            state.listError = "";
         })
         .addCase(fetchUsers.fulfilled, (state, action) => {
            state.listLoading = false;
            state.list = action.payload;
         })
         .addCase(fetchUsers.rejected, (state, action) => {
            state.listLoading = false;
            state.listError = action.payload;
         })

         // createUser
         .addCase(createUser.pending, (state) => {
            state.createLoading = true;
            state.createError = "";
            state.createSuccess = false;
         })
         .addCase(createUser.fulfilled, (state, action) => {
            state.createLoading = false;
            state.createSuccess = true;
            if (action.payload) state.list.unshift(action.payload);
         })
         .addCase(createUser.rejected, (state, action) => {
            state.createLoading = false;
            state.createError = action.payload;
         })

         // updateUser
         .addCase(updateUser.pending, (state) => {
            state.updateLoading = true;
            state.updateError = "";
         })
         .addCase(updateUser.fulfilled, (state, action) => {
            state.updateLoading = false;
            const idx = state.list.findIndex((u) => u._id === action.payload._id);
            if (idx !== -1) state.list[idx] = action.payload;
         })
         .addCase(updateUser.rejected, (state, action) => {
            state.updateLoading = false;
            state.updateError = action.payload;
         })

         // deleteUser
         .addCase(deleteUser.pending, (state, action) => {
            state.deleteLoadingId = action.meta.arg;
            state.deleteError = "";
         })
         .addCase(deleteUser.fulfilled, (state, action) => {
            state.deleteLoadingId = null;
            state.list = state.list.filter((u) => u._id !== action.payload);
         })
         .addCase(deleteUser.rejected, (state, action) => {
            state.deleteLoadingId = null;
            state.deleteError = action.payload;
         })

         // resetUserPassword
         .addCase(resetUserPassword.pending, (state, action) => {
            state.resetPasswordLoadingId = action.meta.arg.id;
            state.resetPasswordError = "";
            state.resetPasswordSuccess = false;
         })
         .addCase(resetUserPassword.fulfilled, (state) => {
            state.resetPasswordLoadingId = null;
            state.resetPasswordSuccess = true;
         })
         .addCase(resetUserPassword.rejected, (state, action) => {
            state.resetPasswordLoadingId = null;
            state.resetPasswordError = action.payload;
         });
   },
});

export const { resetCreateStatus, resetUpdateStatus, resetDeleteStatus, resetUserPasswordStatus } = userSlice.actions;
export default userSlice.reducer;