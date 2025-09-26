import { useQuery } from "@tanstack/react-query";

export type LinkMetaData = {
	tag: string;
	title: string;
	description: string;
	url: string;
};

async function getRandomLink(): Promise<LinkMetaData> {
	const response = await fetch("/api/getRandomLink");
	if (!response.ok) {
		console.warn("API request failed, falling back to local data:");
		throw new Error(`HTTP ${response.status}: ${response.statusText}`);
	}
	const linkMetaData: LinkMetaData = await response.json();
	return linkMetaData;
}

export const useGetRandomLink = () => {
	return useQuery({
		queryKey: ["randomLink"],
		queryFn: getRandomLink,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		refetchOnMount: false,
	});
};
