import { Outlet } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Header from "./components/Header";

function App() {
	return (
		<div className="min-h-screen pb-16 md:pb-0 bg-[#0f172a] text-white">
			<Header />

			{/* This renders the page based on current route */}
			<main className="px-4 py-6">
				<Outlet />
			</main>

			{/* Bottom navigation for mobile */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
				<BottomNav />
			</div>
		</div>
	);
}

export default App;
