import React from "react";
import Link from "next/link";

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
          className="rounded-full border border-cyan-500/40 bg-slate-900/70 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-cyan-100 shadow-sm transition hover:border-cyan-300/70 hover:text-white"
        >
          Back to games
        </Link>
        <div className="relative group">
          <button
            type="button"
            title="Create your own puzzle"
            aria-label="Create your own puzzle"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-xl font-bold text-white shadow-[0_0_16px_rgba(0,255,255,0.38)] transition-transform hover:scale-110"
            onClick={onAddPuzzle}
          >
            +
          </button>
          <span className="pointer-events-none absolute -left-3 top-full mt-2 hidden whitespace-nowrap rounded-md bg-slate-900/90 px-3 py-1 text-xs text-cyan-50 shadow-lg ring-1 ring-cyan-500/30 group-hover:block">
            Create your own puzzle
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-slate-900/70 px-3 py-2 text-sm shadow-sm">
          <span className="h-2 w-2 rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(255,0,204,0.7)]" />
          <span className="text-cyan-100/90">{playerName || "Unknown"}</span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h1 className="tracking-[1em] text-cyan-200/80">Filmoji</h1>
        <h2 className="mt-2 text-3xl font-black tracking-tight text-fuchsia-200 drop-shadow-[0_4px_18px_rgba(255,0,204,0.45)] md:text-4xl">
          Guess the movie by Emoji
        </h2>
      </div>
    </div>
  );
};

export default Header;
