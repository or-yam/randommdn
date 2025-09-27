import { XIcon } from "lucide-react";
import { TAG_COLORS, type Tags } from "@/lib/tags";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export const TagBadge = ({
	tagValue,
	onClick,
}: {
	tagValue: Tags;
	onClick: () => void;
}) => {
	return (
		<Badge
			className={`text-xs ${TAG_COLORS[tagValue].bg} ${TAG_COLORS[tagValue].text} ${TAG_COLORS[tagValue].border} border`}
		>
			{TAG_COLORS[tagValue].label}
			<Button
				variant="ghost"
				size="sm"
				className="ml-1 h-auto p-0 text-muted-foreground hover:text-foreground"
				onClick={onClick}
			>
				<XIcon className="h-3 w-3" />
			</Button>
		</Badge>
	);
};
