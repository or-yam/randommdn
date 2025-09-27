import { useQuery } from "@tanstack/react-query";

type LinkMetaData = {
	tag: string;
	title: string;
	description: string;
	url: string;
};

export const useGetRandomLink = (tags?: string[]) => {
	const tagsParam = tags && tags.length > 0 ? tags.join(",") : "";
	return useQuery({
		queryKey: ["randomLink", tags?.sort()?.join(",") || ""],
		queryFn: async () => {
			const response = await fetch(`/api/getRandomLink?tags=${tagsParam}`);
			if (!response.ok) {
				console.warn("API request failed, falling back to local data:");
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}
			const linkMetaData: LinkMetaData = await response.json();
			return linkMetaData;
		},
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
	});
};
