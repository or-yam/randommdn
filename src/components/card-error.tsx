import { Button } from "./ui/button";
import { CardContent } from "./ui/card";

export const CardError = ({ onRetryClick }: { onRetryClick: () => void }) => {
	return (
		<CardContent className="text-center py-8">
			<p className="text-destructive mb-4">Failed to load content</p>
			<Button variant="outline" onClick={onRetryClick}>
				Try again
			</Button>
		</CardContent>
	);
};
