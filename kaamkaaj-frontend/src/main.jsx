import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router"; // 👈 your routes file
import "./index.css";

createRoot(document.getElementById("root")).render(
	<RouterProvider router={router} />
);
