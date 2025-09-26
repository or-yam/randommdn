import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.tailwind.css";
import "./styles/themes.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="system">
				<App />
			</ThemeProvider>
		</QueryClientProvider>
	</StrictMode>,
);
