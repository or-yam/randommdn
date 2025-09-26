import { DicesIcon, MoonIcon, SunIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "@/components/theme-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { replaceXmlSpecialChars } from "@/lib/utils";
import { useGetRandomLink } from "@/queries/useGetRandomLink";

function App() {
	const {
		data: randomLinkData,
		isFetching,
		error,
		refetch,
	} = useGetRandomLink();
	const { theme, setTheme } = useTheme();

	return (
		<main className="min-h-screen bg-background text-foreground p-4 flex flex-col items-center justify-center">
			<div className="text-center mb-8 flex flex-col items-center">
				<motion.img
					src="/logo.png"
					alt="Random MDN Logo"
					className="w-16 h-16 mb-4"
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				/>
				<motion.h1
					className="text-3xl font-bold tracking-tight"
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
				>
					Random MDN
				</motion.h1>
			</div>
			<Button
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

			<AnimatePresence mode="wait">
				<motion.div
					key={randomLinkData?.url || "loading"}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className="w-full max-w-md overflow-hidden"
				>
					<Card className="border-2 shadow-lg">
						{isFetching ? (
							<>
								<CardHeader>
									<Skeleton className="h-4 w-32" />
									<Skeleton className="h-8 w-full mt-2" />
								</CardHeader>
								<CardContent>
									<Skeleton className="h-20 w-full" />
								</CardContent>
							</>
						) : error ? (
							<CardContent className="text-center py-8">
								<p className="text-destructive mb-4">Failed to load content</p>
								<Button variant="outline" onClick={() => refetch()}>
									Try again
								</Button>
							</CardContent>
						) : (
							<>
								<CardHeader>
									<div className="flex items-center justify-between">
										<Badge variant="outline" className="mb-2">
											{randomLinkData?.tag}
										</Badge>
									</div>
									<CardTitle className="text-xl font-bold break-words hyphens-auto overflow-hidden">
										{randomLinkData?.title}
									</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground break-words hyphens-auto overflow-hidden">
										{replaceXmlSpecialChars(randomLinkData?.description)}
									</p>
								</CardContent>
							</>
						)}
						<CardFooter className="flex justify-between pt-6">
							<Button
								variant="outline"
								onClick={() => refetch()}
								className="w-1/2 mr-2"
								disabled={isFetching}
							>
								{isFetching ? (
									<>
										<motion.div
											className="mr-2"
											animate={{ rotate: 360 }}
											transition={{
												duration: 1,
												repeat: Infinity,
												ease: "linear",
											}}
										>
											<DicesIcon className="h-4 w-4" />
										</motion.div>
										Rolling...
									</>
								) : (
									<>
										<DicesIcon className="mr-2 h-4 w-4" />
										Roll again
									</>
								)}
							</Button>
							<Button variant="default" className="w-1/2 ml-2" asChild>
								<a
									href={randomLinkData?.url}
									target="_blank"
									rel="noopener noreferrer"
									className={`inline-flex items-center justify-center ${isFetching || !randomLinkData?.url ? "pointer-events-none opacity-50" : ""}`}
								>
									Read more
								</a>
							</Button>
						</CardFooter>
					</Card>
				</motion.div>
			</AnimatePresence>
		</main>
	);
}

export default App;
