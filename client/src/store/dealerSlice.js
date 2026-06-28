
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

/* ─────────────────────────── THUNKS ─────────────────────────── */

export const fetchDealers = createAsyncThunk(
	"dealers/fetchAll",
	async (_, { rejectWithValue }) => {
		try {
			const res = await api.get("/dealers");
			const payload = res.data;
			if (Array.isArray(payload)) return payload;
			if (Array.isArray(payload?.data)) return payload.data;
			return [];
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || "Failed to load dealers");
		}
	}
);

export const addDealer = createAsyncThunk(
	"dealers/add",
	async ({ dealerName, farmerDealerCode }, { rejectWithValue }) => {
		try {
			const res = await api.post("/dealers/add", { dealerName, farmerDealerCode });
			if (!res.data?.success) return rejectWithValue(res.data?.message || "Failed to add dealer");
			return res.data.data; // return the new dealer object
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || "Failed to add dealer");
		}
	}
);

export const updateDealer = createAsyncThunk(
	"dealers/update",
	async ({ id, dealerName, farmerDealerCode }, { rejectWithValue }) => {
		try {
			const res = await api.put(`/dealers/${id}`, { dealerName, farmerDealerCode });
			if (!res.data?.success) return rejectWithValue(res.data?.message || "Update failed");
			return { id, dealerName, farmerDealerCode };
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || "Update failed");
		}
	}
);

export const deleteDealer = createAsyncThunk(
	"dealers/delete",
	async (id, { rejectWithValue }) => {
		try {
			const res = await api.delete(`/dealers/${id}`);
			if (!res.data?.success) return rejectWithValue(res.data?.message || "Delete failed");
			return id;
		} catch (err) {
			return rejectWithValue(err.response?.data?.message || "Delete failed");
		}
	}
);

/* ─────────────────────────── SLICE ─────────────────────────── */

const dealerSlice = createSlice({
	name: "dealers",
	initialState: {
		list: [],
		loading: false,
		error: null,
		actionLoading: false,
		actionError: null,
	},
	reducers: {
		clearError: (state) => {
			state.error = null;
			state.actionError = null;
		},
	},
	extraReducers: (builder) => {
		/* fetchDealers */
		builder
			.addCase(fetchDealers.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDealers.fulfilled, (state, action) => {
				state.loading = false;
				state.list = action.payload;
			})
			.addCase(fetchDealers.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload;
			});

		/* ✅ CHANGE 1: addDealer — naya dealer seedha list mein push hoga
		   Pehle sirf actionLoading: false hoti thi, ab payload list mein add hoga
		   Isse dobara fetchDealers() call karne ki zarurat nahi */
		builder
			.addCase(addDealer.pending, (state) => {
				state.actionLoading = true;
				state.actionError = null;
			})
			.addCase(addDealer.fulfilled, (state, action) => {
				state.actionLoading = false;
				if (action.payload) {
					state.list.push(action.payload); // ← YE LINE ADD KI HAI
				}
			})
			.addCase(addDealer.rejected, (state, action) => {
				state.actionLoading = false;
				state.actionError = action.payload;
			});

		/* updateDealer — optimistically updates the item in the list */
		builder
			.addCase(updateDealer.pending, (state) => {
				state.actionLoading = true;
				state.actionError = null;
			})
			.addCase(updateDealer.fulfilled, (state, action) => {
				state.actionLoading = false;
				const { id, dealerName, farmerDealerCode } = action.payload;
				const dealer = state.list.find((d) => d._id === id || d.id === id);
				if (dealer) {
					dealer.dealerName = dealerName;
					dealer.farmerDealerCode = farmerDealerCode;
				}
			})
			.addCase(updateDealer.rejected, (state, action) => {
				state.actionLoading = false;
				state.actionError = action.payload;
			});

		/* deleteDealer — removes item directly from list */
		builder
			.addCase(deleteDealer.pending, (state) => {
				state.actionLoading = true;
				state.actionError = null;
			})
			.addCase(deleteDealer.fulfilled, (state, action) => {
				state.actionLoading = false;
				state.list = state.list.filter(
					(d) => d._id !== action.payload && d.id !== action.payload
				);
			})
			.addCase(deleteDealer.rejected, (state, action) => {
				state.actionLoading = false;
				state.actionError = action.payload;
			});
	},
});

/* ─────────────────────────── SELECTORS ─────────────────────────── */

export const selectDealers = (state) => state.dealers.list;
export const selectDealerLoading = (state) => state.dealers.loading;
export const selectDealerActionLoading = (state) => state.dealers.actionLoading;
export const selectDealerError = (state) => state.dealers.error;
export const selectDealerActionError = (state) => state.dealers.actionError;

export const { clearError } = dealerSlice.actions;
export default dealerSlice.reducer;