import { createRoot } from "react-dom/client";
import { initGraphQLClient } from "@/core/graphql-client";
import { clearAdminSession, getAdminAccessToken } from "@/stores/adminAuthStore";
import App from "./App.tsx";
import "./index.css";

initGraphQLClient({
	getAccessToken: getAdminAccessToken,
	onUnauthenticated: clearAdminSession,
});

createRoot(document.getElementById("root")!).render(<App />);
