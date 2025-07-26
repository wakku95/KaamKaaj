import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<AuthProvider>
		<RouterProvider router={router} />
	</AuthProvider>
);
