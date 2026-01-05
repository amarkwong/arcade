"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { GameSlot } from "../GameSlot/GameSlot";

export const GameSelector = () => {
	const router = useRouter();
	const [activeIndex, setActiveIndex] = useState(0);

	const games = useMemo(
		() => [
			{
				href: "/filmoji",
				src: "/filmoji.png",
				caption: "Filmoji",
			},
			{
				href: "https://garticphone.com/",
				src: "https://garticphone.com/images/thumb.png",
				caption: "Gartic Phone",
			},
			{
				href: "https://skribbl.io/",
				src: "https://athletesforkids.org/wp-content/uploads/2020/04/Skribble-image2.png",
				caption: "Skribbl",
			},
		],
		[],
	);

	const handleLaunch = useCallback(
		(index: number) => {
			setActiveIndex(index);
			const game = games[index];

			if (!game) return;

			if (game.href.startsWith("http")) {
				window.open(game.href, "_blank", "noopener,noreferrer");
			} else {
				router.push(game.href);
			}
		},
		[games, router],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent) => {
			if (event.key === "ArrowRight") {
				setActiveIndex((prev) => (prev + 1) % games.length);
			} else if (event.key === "ArrowLeft") {
				setActiveIndex((prev) => (prev - 1 + games.length) % games.length);
			} else if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				handleLaunch(activeIndex);
			}
		},
		[activeIndex, games.length, handleLaunch],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	const activeGame = games[activeIndex];

	return (
		<div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-50">
			<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.08),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(255,0,204,0.07),transparent_40%)]" />
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:160px_160px] opacity-60" />

			<div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-6 py-8 md:py-12">
				<header className="text-center space-y-4">
					<h1 className="text-4xl font-black tracking-tight text-fuchsia-200 drop-shadow-[0_4px_20px_rgba(255,0,204,0.5)] md:text-5xl">
						Choose Your Game
					</h1>
				</header>

				<div className="flex flex-col items-center gap-6">
					<div className="flex flex-wrap justify-center gap-6 md:gap-8">
						{games.map((game, index) => (
							<GameSlot
								key={game.caption}
								href={game.href}
								src={game.src}
								caption={game.caption}
								active={index === activeIndex}
								onActivate={() => handleLaunch(index)}
							/>
						))}
					</div>

					{activeGame ? (
						<div className="flex items-center gap-3 rounded-full border border-cyan-400/40 bg-slate-900/70 px-4 py-2 text-xs tracking-[0.3em] text-cyan-100/90 shadow-[0_0_20px_rgba(0,255,255,0.25)]">
							<span className="h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(255,0,204,0.8)]" />
							{activeGame.caption}
							<span className="text-cyan-200/80">(Enter to launch)</span>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};
