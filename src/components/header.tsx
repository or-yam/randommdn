import { motion } from "motion/react";

export const Header = () => {
	return (
		<header className="text-center mb-8 flex flex-col items-center">
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
		</header>
	);
};
