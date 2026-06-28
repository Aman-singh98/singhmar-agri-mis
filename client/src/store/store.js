import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice";
import dealerReducer from "./dealerSlice";
import userReducer from "./userSlice";
import authReducer from "./authSlice";

const store = configureStore({
	reducer: {
		app: appReducer,
		dealers: dealerReducer,
		user: userReducer,
		auth: authReducer,
	}
});

export default store;