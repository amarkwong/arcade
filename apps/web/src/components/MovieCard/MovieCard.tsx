"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type React from "react";
import { useState } from "react";

export type Solver = {
	name: string;
	id: string;
	color: string;
	timestamp: Date;
};
export interface MovieCardProps {
	emoji: string;
	poster: string;
	riddler: string;
	unlocked: boolean;
	solvedBy?: Solver[];
	rating?: number;
	onRate?: (rating: number) => void;
}

const Fibbonaci = [1, 2, 3, 5, 8, 13, 21, 34];
const FibSum = [1, 3, 6, 11, 19, 32, 53, 87];

// * both the index and n should be less than 8
const FibFrac = (index: number, n: number) => {
	if (index < 0 || n < 0 || index > 7 || n > 7) return 0;

	const numerator = Fibbonaci.slice(n - index, n).reduce((a, b) => a + b, 0);
	const denominator = FibSum[n - 1];
	return Math.round((numerator / denominator) * 100);
};

const shake = {
	rotateY: [0, -10, 10, -10, 10, 0],
	transition: {
		duration: 0.5,
	},
};

const MovieCard: React.FC<MovieCardProps> = ({
	emoji,
	poster,
	riddler,
	unlocked,
	solvedBy,
	rating,
	onRate,
}) => {
	const [viewIndex, setViewIndex] = useState(0); // 0 emoji, 1 poster, 2 info
	const [clicked, setClicked] = useState(false);

	const firstEightSolvers = solvedBy?.slice(0, 8);

	const handleCardClick = () => {
		if (!unlocked) {
			setClicked(true);
			setTimeout(() => setClicked(false), 500);
			return;
		}
		setViewIndex((prev) => (prev + 1) % 3);
	};

	const background = unlocked
		? firstEightSolvers
			? firstEightSolvers.length === 1
				? {
						backgroundColor: firstEightSolvers[0].color,
					}
				: {
						background: `linear-gradient(to bottom, ${firstEightSolvers?.map((solver, index) => `${solver.color} ${index === 0 ? 0 : FibFrac(index, firstEightSolvers.length)}%, ${solver.color} ${FibFrac(index + 1, firstEightSolvers.length)}%${index === firstEightSolvers.length - 1 ? ")" : ""}`)}`,
					}
			: {
					background: "linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)",
				}
		: {
				background: `url("/lock.svg")`,
				backgroundSize: "contain",
				backgroundColor: "gray",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			};

	const infoFace = (
		<div
			className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg bg-slate-950/90 px-3 text-center text-slate-100 shadow-inner shadow-fuchsia-500/40"
			style={{ backfaceVisibility: "hidden", transform: "rotateY(0deg)" }}
		>
			<p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Created by {riddler}</p>
			<p className="text-sm text-fuchsia-100">Rate this puzzle</p>
			<div className="flex gap-2">
				{[1, 2, 3, 4, 5].map((score) => (
					<button
						type="button"
						key={score}
						onClick={(event) => {
							event.stopPropagation();
							onRate?.(score);
						}}
						className={`h-8 w-8 rounded-full border border-cyan-400/40 text-xs font-bold ${rating === score ? "bg-fuchsia-500 text-white" : "bg-slate-800 text-cyan-100"}`}
					>
						{score}
					</button>
				))}
			</div>
		</div>
	);

	return (
		<motion.div onClick={handleCardClick} animate={clicked ? shake : {}} className="w-48 h-72">
			<div
				className={`w-full h-full transition-transform duration-500 ${viewIndex === 1 ? "rotate-y-180" : ""}`}
				style={{
					transformStyle: "preserve-3d",
					transform: viewIndex === 1 ? "rotateY(180deg)" : "rotateY(0deg)",
				}}
			>
				{/* Front Side */}
				<div
					className="absolute w-full h-full flex items-center justify-center text-4xl bg-opacity-60 backdrop-blur-md rounded-lg shadow-xl"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(0deg)",
						zIndex: viewIndex === 1 ? 0 : 1,
						...background,
					}}
				>
					{viewIndex === 2 ? infoFace : emoji}
				</div>

				{/* Back Side */}
				<div
					className="absolute w-full h-full bg-white flex items-center justify-center transform rotate-y-180"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
						zIndex: viewIndex === 1 ? 1 : 0,
					}}
				>
					<Image
						src={poster}
						alt="Movie"
						className="w-full h-full object-cover"
						width={150}
						height={226}
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default MovieCard;
