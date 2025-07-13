// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import UsersPage from "./admin/UsersPage";
import WorkersPage from "./admin/WorkersPage";
import RequestsPage from "./admin/RequestsPage";

// Create routes
const router = createBrowserRouter([
	{
		path: "*",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			// Add other public/user routes here
		],
	},
	{
		path: "/admin",
		element: <AdminLayout />, // Admin sidebar layout
		children: [
			{ index: true, element: <UsersPage /> },
			{ path: "users", element: <UsersPage /> },
			{ path: "workers", element: <WorkersPage /> },
			{ path: "requests", element: <RequestsPage /> },
		],
	},
	{
		path: "/admin-login",
		element: <AdminLogin />,
	},
]);

export default router;
