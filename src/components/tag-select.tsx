import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { TAG_COLORS, TAG_OPTIONS, type Tags } from "@/lib/tags";

type TagSelectProps = {
	open: boolean;
	handleOpenSelectChange: (open: boolean) => void;
	appliedTags: string[];
	selectedTags: string[];
	setSelectedTags: Dispatch<SetStateAction<Tags[]>>;
};

export const TagSelect = ({
	open,
	handleOpenSelectChange,
	appliedTags,
	selectedTags,
	setSelectedTags,
}: TagSelectProps) => {
	return (
		<Popover open={open} onOpenChange={handleOpenSelectChange}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{appliedTags.length === 0
						? "Filter by topics (optional)"
						: `${appliedTags.length} topic${appliedTags.length > 1 ? "s" : ""} selected`}
					<ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0" align="start">
				<Command>
					<CommandList>
						<CommandGroup>
							{TAG_OPTIONS.map((tag) => {
								const isSelected = selectedTags.includes(tag.value);
								const tagColors =
									TAG_COLORS[tag.value as keyof typeof TAG_COLORS];
								return (
									<CommandItem
										key={tag.value}
										onSelect={() => {
											setSelectedTags((prev) =>
												isSelected
													? prev.filter((t) => t !== tag.value)
													: [...prev, tag.value],
											);
										}}
									>
										<div className="flex items-center flex-1">
											<Checkbox checked={isSelected} className="mr-2" />
											<span
												className={`px-2 py-0.5 rounded text-xs font-medium ${tagColors?.bg} ${tagColors?.text}`}
											>
												{tag.label}
											</span>
										</div>
										{isSelected && <CheckIcon className="ml-auto h-4 w-4" />}
									</CommandItem>
								);
							})}
						</CommandGroup>
						{selectedTags.length > 0 && (
							<>
								<Separator />
								<CommandGroup>
									<CommandItem
										onSelect={() => setSelectedTags([])}
										className="justify-center text-center"
									>
										Clear all
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
};
