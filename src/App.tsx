import { DicesIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { replaceXmlSpecialChars } from "@/lib/utils";
import { useGetRandomLink } from "@/queries/useGetRandomLink";
import { CardError } from "./components/card-error";
import { CardLoading } from "./components/card-loading";
import { Header } from "./components/header";
import { TagBadge } from "./components/tag-badge";
import { TagSelect } from "./components/tag-select";
import { ThemeToggleButton } from "./components/theme-toggle-button";
import { TAG_COLORS, type Tags } from "./lib/tags";

function App() {
	const [selectedTags, setSelectedTags] = useState<Tags[]>([]);
	const [appliedTags, setAppliedTags] = useState<Tags[]>([]);
	const [open, setOpen] = useState(false);
	const {
		data: randomLinkData,
		isFetching,
		error,
		refetch,
	} = useGetRandomLink(appliedTags.length > 0 ? appliedTags : undefined);

	const handleOpenSelectChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (newOpen) {
			setSelectedTags([...appliedTags]);
		} else {
			setAppliedTags([...selectedTags]);
		}
	};

	return (
		<main className="min-h-screen bg-background text-foreground p-4 flex flex-col items-center justify-center">
			<Header />

			<motion.div
				className="w-full max-w-md mb-6"
				initial={{ y: 20, opacity: 0 }}
				animate={{ y: 0, opacity: 1 }}
				transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
			>
				<TagSelect
					open={open}
					handleOpenSelectChange={handleOpenSelectChange}
					appliedTags={appliedTags}
					selectedTags={selectedTags}
					setSelectedTags={setSelectedTags}
				/>
				{appliedTags.length > 0 && (
					<div className="flex flex-wrap gap-1 mt-2">
						{appliedTags.map((tagValue) => (
							<TagBadge
								key={tagValue}
								tagValue={tagValue}
								onClick={() => {
									const newTags = appliedTags.filter((t) => t !== tagValue);
									setAppliedTags(newTags);
									setSelectedTags(newTags);
								}}
							/>
						))}
					</div>
				)}
			</motion.div>

			<ThemeToggleButton />

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
							<CardLoading />
						) : error ? (
							<CardError onRetryClick={() => refetch()} />
						) : (
							<>
								<CardHeader>
									<div className="flex items-center justify-between">
										{randomLinkData?.tag && (
											<Badge
												className={`mb-2 text-xs ${
													TAG_COLORS[
														randomLinkData.tag as keyof typeof TAG_COLORS
													]?.bg || "bg-gray-100"
												} ${
													TAG_COLORS[
														randomLinkData.tag as keyof typeof TAG_COLORS
													]?.text || "text-gray-800"
												} ${
													TAG_COLORS[
														randomLinkData.tag as keyof typeof TAG_COLORS
													]?.border || "border-gray-200"
												} border`}
											>
												{randomLinkData.tag}
											</Badge>
										)}
									</div>
									<CardTitle className="text-xl font-bold break-words hyphens-auto overflow-hidden">
										{replaceXmlSpecialChars(randomLinkData?.title)}
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
