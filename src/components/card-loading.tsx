import { CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const CardLoading = () => {
	return (
		<>
			<CardHeader>
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-8 w-full mt-2" />
			</CardHeader>
			<CardContent>
				<Skeleton className="h-20 w-full" />
			</CardContent>
		</>
	);
};
