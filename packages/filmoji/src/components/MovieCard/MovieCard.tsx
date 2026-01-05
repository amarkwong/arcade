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
		? firstEightSolvers
			? firstEightSolvers.length === 1
				? { backgroundColor: firstEightSolvers[0].color }
				: {
						background: `linear-gradient(to bottom, ${firstEightSolvers
							?.map(
								(solver, index) =>
									`${solver.color} ${index === 0 ? 0 : FibFrac(index, firstEightSolvers.length)}%, ${solver.color} ${FibFrac(
										index + 1,
										firstEightSolvers.length,
									)}%${index === firstEightSolvers.length - 1 ? ")" : ""}`,
							)
							.join(" ")}`,
					}
			: { background: "linear-gradient(135deg, #0ea5e9 0%, #7c3aed 100%)" }
		: {
				background: `url("/lock.svg")`,
				backgroundSize: "contain",
				backgroundColor: "gray",
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
						<span className="text-5xl leading-none">{emoji}</span>
						{unlocked ? <p className="text-sm text-cyan-100">Created by {riddler}</p> : null}
					</div>
				</div>

				<div
					className="absolute flex h-full w-full items-center justify-center bg-white"
					style={{
						backfaceVisibility: "hidden",
						transform: "rotateY(180deg)",
						zIndex: viewIndex === 1 ? 1 : 0,
					}}
				>
					<Image
						src={poster}
						alt="Movie"
						className="h-full w-full object-cover"
						width={150}
						height={226}
					/>
				</div>
			</div>
		</motion.div>
	);
};

export default MovieCard;
