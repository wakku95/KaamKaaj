// src/router.jsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import UsersPage from "./admin/UsersPage";
import WorkersPage from "./admin/WorkersPage";
import RequestsPage from "./admin/RequestsPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import MyWorkerProfile from "./pages/WorkerProfile";
import CreateOrUpdateWorkerProfile from "./pages/CreateOrUpdateWorkerProfile";
import EditUserProfile from "./pages/EditUserProfile";

// Create routes
const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <Home /> },
			{ path: "verify-email", element: <VerifyEmailPage /> },
			{ path: "search", element: <Search /> },
			{
				path: "requests",
				element: (
					<ProtectedRoute>
						<Requests />
					</ProtectedRoute>
				),
			},
			{
				path: "profile",
				element: (
					<ProtectedRoute>
						<Profile />
					</ProtectedRoute>
				),
			},
			{
				path: "my-worker-profile",
				element: (
					<ProtectedRoute>
						<MyWorkerProfile />
					</ProtectedRoute>
				),
			},
			{
				path: "create-update-worker-profile",
				element: (
					<ProtectedRoute>
						<CreateOrUpdateWorkerProfile />
					</ProtectedRoute>
				),
			},
			{
				path: "edit-profile",
				element: (
					<ProtectedRoute>
						<EditUserProfile />
					</ProtectedRoute>
				),
			},
			{ path: "login", element: <LoginPage /> },
			{ path: "register", element: <RegisterPage /> },
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
