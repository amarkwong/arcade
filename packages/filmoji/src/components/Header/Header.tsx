import Link from "next/link";
import type React from "react";

interface HeaderProps {
	playerName: string;
	onAddPuzzle: () => void;
}

const Header: React.FC<HeaderProps> = ({ playerName, onAddPuzzle }) => {
	return (
		<div className="relative mx-auto w-full max-w-4xl px-4">
			<div className="flex items-center justify-between gap-3">
				<Link
					href="/GameSelector"
					className="rounded-full border border-sky-400/30 bg-slate-700/70 px-3 py-2 text-xs font-semibold tracking-wide text-sky-100 shadow-sm transition hover:border-sky-300/50 hover:text-white"
				>
					Back to Arcade
				</Link>
				<div className="relative group">
					<button
						type="button"
						title="Create your own puzzle"
						aria-label="Create your own puzzle"
						className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-teal-500 text-xl font-bold text-white shadow-[0_0_12px_rgba(56,189,248,0.25)] transition-transform hover:scale-110"
						onClick={onAddPuzzle}
					>
						+
					</button>
					<span className="pointer-events-none absolute -left-3 top-full mt-2 hidden whitespace-nowrap rounded-md bg-slate-700/90 px-3 py-1 text-xs text-sky-50 shadow-lg ring-1 ring-sky-400/20 group-hover:block">
						Create your own puzzle
					</span>
				</div>
				<div className="flex items-center gap-2 rounded-md bg-slate-700/70 px-3 py-2 text-sm shadow-sm">
					<span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.5)]" />
					<span className="text-sky-100/90">{playerName || "Unknown"}</span>
				</div>
			</div>

			<div className="mt-16 text-center">
				<h2 className="mt-2 text-3xl font-black tracking-tight text-sky-200 drop-shadow-[0_4px_14px_rgba(56,189,248,0.25)] md:text-4xl">
					Guess the movie by Emoji
				</h2>
			</div>
		</div>
	);
};

export default Header;
