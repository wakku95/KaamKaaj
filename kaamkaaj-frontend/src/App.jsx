import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Requests from "./pages/Requests";
import Profile from "./pages/Profile";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";

function App() {
	return (
		<div className="min-h-screen pb-16 md:pb-0">
			<Header />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/search" element={<Search />} />
				<Route path="/requests" element={<Requests />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>

			<div className="md:hidden">
				<BottomNav />
			</div>
		</div>
	);
}

export default App;
