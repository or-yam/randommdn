import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export const ThemeToggleButton = () => {
	const { theme, setTheme } = useTheme();

	return (
		<Button
			aria-label="Toggle theme"
			variant="ghost"
			size="icon"
			className="absolute top-4 right-4"
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
		>
			{theme === "dark" ? (
				<SunIcon className="h-5 w-5" />
			) : (
				<MoonIcon className="h-5 w-5" />
			)}
		</Button>
	);
};
