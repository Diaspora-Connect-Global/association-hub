import { createRoot } from "react-dom/client";
import { initGraphQLClient } from "@/core/graphql-client";
import {
	clearAdminSession,
	getAdminAccessToken,
	getAdminRefreshToken,
	updateAdminTokens,
} from "@/stores/adminAuthStore";
import App from "./App.tsx";
import "./index.css";

initGraphQLClient({
	getAccessToken: getAdminAccessToken,
	getRefreshToken: getAdminRefreshToken,
	onAuthRefresh: updateAdminTokens,
	onUnauthenticated: clearAdminSession,
});

createRoot(document.getElementById("root")!).render(<App />);
