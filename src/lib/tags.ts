export type Tags = "JAVASCRIPT" | "WEB API" | "HTML" | "CSS" | "HTTP" | "SVG";

export const TAG_COLORS: Record<
	Tags,
	{ bg: string; text: string; border: string; label: string }
> = {
	JAVASCRIPT: {
		bg: "bg-yellow-100",
		text: "text-yellow-800",
		border: "border-yellow-200",
		label: "JavaScript",
	},
	"WEB API": {
		bg: "bg-blue-100",
		text: "text-blue-800",
		border: "border-blue-200",
		label: "Web APIs",
	},
	HTML: {
		bg: "bg-red-100",
		text: "text-red-800",
		border: "border-red-200",
		label: "HTML",
	},
	CSS: {
		bg: "bg-purple-100",
		text: "text-purple-600",
		border: "border-purple-200",
		label: "CSS",
	},
	HTTP: {
		bg: "bg-orange-100",
		text: "text-orange-800",
		border: "border-orange-200",
		label: "HTTP",
	},
	SVG: {
		bg: "bg-green-100",
		text: "text-green-800",
		border: "border-green-200",
		label: "SVG",
	},
} as const;

export const TAG_OPTIONS: { value: Tags; label: string }[] = [
	{ value: "JAVASCRIPT", label: "JavaScript" },
	{ value: "WEB API", label: "Web APIs" },
	{ value: "HTML", label: "HTML" },
	{ value: "CSS", label: "CSS" },
	{ value: "HTTP", label: "HTTP" },
	{ value: "SVG", label: "SVG" },
] as const;
