"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import type React from "react";
import { useState } from "react";

export type Solver = {
	name: string;
	id: string;
	userId?: number;
	color: string;
	timestamp: Date;
};

export interface MovieCardProps {
	emoji: string;
	poster: string;
	riddler: string;
	unlocked: boolean;
	solvedBy?: Solver[];
}

const Fibbonaci = [1, 2, 3, 5, 8, 13, 21, 34];
const FibSum = [1, 3, 6, 11, 19, 32, 53, 87];

const FibFrac = (index: number, n: number) => {
	if (index < 0 || n < 0 || index > 7 || n > 7) return 0;
	const numerator = Fibbonaci.slice(n - index, n).reduce((a, b) => a + b, 0);
	const denominator = FibSum[n - 1];
	return Math.round((numerator / denominator) * 100);
};

const shake = {
	rotateY: [0, -10, 10, -10, 10, 0],
	transition: { duration: 0.5 },
};

const MovieCard: React.FC<MovieCardProps> = ({ emoji, poster, riddler, unlocked, solvedBy }) => {
	const [viewIndex, setViewIndex] = useState(0);
	const [clicked, setClicked] = useState(false);
	const firstEightSolvers = solvedBy?.slice(0, 8);

	const handleCardClick = () => {
		if (!unlocked) {
			setClicked(true);
			setTimeout(() => setClicked(false), 500);
			return;
		}
		setViewIndex((prev) => (prev + 1) % 2);
	};

	const background = unlocked
		? {
				// Clean, muted teal/slate gradient for unlocked cards
				background: "linear-gradient(145deg, #5d8aa8 0%, #475569 50%, #3b5268 100%)",
			}
		: {
				background: `url("/lock.svg")`,
				backgroundSize: "40%",
				backgroundColor: "#64748b",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			};

	return (
		<motion.div onClick={handleCardClick} animate={clicked ? shake : {}} className="h-72 w-48">
			<div
				className={`h-full w-full transition-transform duration-500 ${viewIndex === 1 ? "rotate-y-180" : ""}`}
				style={{
					transformStyle: "preserve-3d",
					transform: viewIndex === 1 ? "rotateY(180deg)" : "rotateY(0deg)",
				}}
			>
				<div
					className="absolute flex h-full w-full items-center justify-center rounded-lg bg-opacity-60 text-4xl shadow-xl backdrop-blur-md"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(0deg)",
						zIndex: viewIndex === 1 ? 0 : 1,
						...background,
					}}
				>
					<div className="flex h-full w-full flex-col items-center justify-center gap-3 px-4 text-center text-slate-100">
						<span className="text-5xl leading-none drop-shadow-md">{emoji}</span>
						{unlocked ? <p className="text-sm text-sky-100/90">Created by {riddler}</p> : null}
					</div>
				</div>

				<div
					className="absolute flex h-full w-full items-center justify-center rounded-lg bg-slate-200"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
						zIndex: viewIndex === 1 ? 1 : 0,
					}}
				>
					{poster ? (
						<Image
							src={poster}
							alt="Movie"
							className="h-full w-full rounded-lg object-cover"
							width={150}
							height={226}
						/>
					) : (
						<div className="flex h-full w-full items-center justify-center text-slate-400">
							<span className="text-4xl">🎬</span>
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default MovieCard;
