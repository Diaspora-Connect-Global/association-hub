import { createRoot } from "react-dom/client";
import { initGraphQLClient } from "@/core/graphql-client";
import { getAdminAccessToken } from "@/stores/adminAuthStore";
import App from "./App.tsx";
import "./index.css";

initGraphQLClient(getAdminAccessToken);

createRoot(document.getElementById("root")!).render(<App />);
