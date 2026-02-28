import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { createContext, useContext, useEffect, useState } from "react";

import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import TanStackQueryProvider from "../integrations/tanstack-query/root-provider";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const ThemeContext = createContext<{
	theme: string;
	toggle: () => void;
}>({ theme: "dark", toggle: () => {} });

export function useTheme() {
	return useContext(ThemeContext);
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState("dark");

	useEffect(() => {
		const saved = localStorage.getItem("theme") || "dark";
		setTheme(saved);
		document.documentElement.setAttribute("data-theme", saved);
	}, []);

	const toggle = () => {
		const next = theme === "dark" ? "light" : "dark";
		setTheme(next);
		localStorage.setItem("theme", next);
		document.documentElement.setAttribute("data-theme", next);
	};

	return (
		<html lang="en">
			<head>
				{/* biome-ignore lint/security/noDangerouslySetInnerHtml: flash prevention */}
				<script dangerouslySetInnerHTML={{ __html: "var t=localStorage.getItem('theme')||'dark';document.documentElement.setAttribute('data-theme',t);" }} />
				<HeadContent />
			</head>
			<body>
				<ThemeContext.Provider value={{ theme, toggle }}>
					<TanStackQueryProvider>
						{children}
						<TanStackDevtools
							config={{
								position: "bottom-right",
							}}
							plugins={[
								{
									name: "Tanstack Router",
									render: <TanStackRouterDevtoolsPanel />,
								},
								TanStackQueryDevtools,
							]}
						/>
					</TanStackQueryProvider>
				</ThemeContext.Provider>
				<Scripts />
			</body>
		</html>
	);
}
