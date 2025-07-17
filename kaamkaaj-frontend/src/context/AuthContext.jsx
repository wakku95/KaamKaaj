import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [token, setToken] = useState(localStorage.getItem("token") || null);
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (token) {
			localStorage.setItem("token", token);
		} else {
			localStorage.removeItem("token");
			setUser(null);
		}
	}, [token]);

	// Fetch user when token changes
	useEffect(() => {
		const fetchUser = async () => {
			if (token) {
				try {
					const res = await axios.get("/api/user/get-profile", {
						headers: { Authorization: `Bearer ${token}` },
					});
					setUser(res.data);
				} catch (err) {
					console.error("Failed to fetch user", err);
					setToken(null);
				}
			}
			setLoading(false);
		};
		fetchUser();
	}, [token]);
	const login = (newToken) => setToken(newToken);
	const logout = () => setToken(null);

	return (
		<AuthContext.Provider
			value={{
				token,
				isLoggedIn: !!token,
				user,
				setUser,
				loading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
