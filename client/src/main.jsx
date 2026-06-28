import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

const rootElement = document.getElementById("root");

if (!rootElement) {
	throw new Error("Root container missing in index.html");
}
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<Provider store={store}>
			<AuthProvider>
				<ThemeProvider>
					<App />
				</ThemeProvider>
			</AuthProvider>
		</Provider>
	</StrictMode>,
);
