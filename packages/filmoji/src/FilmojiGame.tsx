"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Coverflow from "./components/Coverflow/Coverflow";
import MovieCard, { Solver } from "./components/MovieCard/MovieCard";
import LoginModal from "./components/LoginModal/LoginModal";
import { motion } from "framer-motion";

export type FilmojiPuzzle = {
  id: string;
  emoji: string;
  answer: string;
  poster: string;
  creator: string;
  rating?: number;
};

type PuzzleState = FilmojiPuzzle & {
  unlocked: boolean;
  solvedBy: Solver[];
  guess: string;
};

const starterPuzzles: FilmojiPuzzle[] = [
  {
    id: "filmoji-1",
    emoji: "👨‍🚀🌕",
    answer: "Interstellar",
    poster: "https://m.media-amazon.com/images/M/MV5BMjIxMjgxNzM2M15BMl5BanBnXkFtZTgwNjUxNjM3MjE@._V1_.jpg",
    creator: "Filmoji Team",
  },
  {
    id: "filmoji-2",
    emoji: "🧛‍♂️🦇🏰",
    answer: "Dracula",
    poster: "https://m.media-amazon.com/images/M/MV5BMTc0MzE2NTQxM15BMl5BanBnXkFtZTgwMjUxNzAwMjE@._V1_.jpg",
    creator: "Filmoji Team",
  },
  {
    id: "filmoji-3",
    emoji: "🧙‍♂️💍🌋",
    answer: "The Lord of the Rings",
    poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWFmNTEtODM1ZmRlY2RhZWRiXkEyXkFqcGc@._V1_.jpg",
    creator: "Filmoji Team",
  },
];

const randomColor = () => {
  const palette = ["#22d3ee", "#a855f7", "#f472b6", "#f59e0b", "#06b6d4", "#10b981"];
  return palette[Math.floor(Math.random() * palette.length)];
};

const FilmojiGame: React.FC = () => {
  const [playerName, setPlayerName] = useState("");
  const [isNameModalOpen, setIsNameModalOpen] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const snackbarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [createForm, setCreateForm] = useState({
    emoji: "",
    answer: "",
    poster: "",
    creator: "You",
  });
  const [puzzles, setPuzzles] = useState<PuzzleState[]>(
    starterPuzzles.map((puzzle) => ({
      ...puzzle,
      unlocked: false,
      solvedBy: [],
      guess: "",
    }))
  );

  const activePuzzle = puzzles[activeIndex];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!isNameModalOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMounted, isNameModalOpen]);

  const handleGuess = (id: string, guess: string) => {
    setPuzzles((prev) =>
      prev.map((puzzle) => {
        if (puzzle.id !== id) return puzzle;
        const isCorrect = puzzle.answer.toLowerCase().trim() === guess.toLowerCase().trim();
        if (!isCorrect) {
          if (snackbarTimer.current) {
            clearTimeout(snackbarTimer.current);
          }
          setSnackbar("Incorrect guesses shake the card, but you can try as many times as you like.");
          snackbarTimer.current = setTimeout(() => setSnackbar(null), 3000);
          return { ...puzzle, guess };
        }
        const solver: Solver = {
          id: `${id}-${Date.now()}`,
          name: playerName || "Player",
          color: randomColor(),
          timestamp: new Date(),
        };
        return {
          ...puzzle,
          unlocked: true,
          solvedBy: [...(puzzle.solvedBy ?? []), solver],
          guess: "",
        };
      })
    );
  };

  const handleRate = (id: string, rating: number) => {
    setPuzzles((prev) => prev.map((p) => (p.id === id ? { ...p, rating } : p)));
  };

  const handleCreate = (payload: { emoji: string; answer: string; poster: string; creator: string }) => {
    setPuzzles((prev) => [
      ...prev,
      {
        id: `filmoji-${prev.length + 1}`,
        emoji: payload.emoji,
        answer: payload.answer,
        poster: payload.poster,
        creator: payload.creator,
        unlocked: false,
        solvedBy: [],
        guess: "",
      },
    ]);
    setIsCreateOpen(false);
    setActiveIndex(puzzles.length);
    setCreateForm({ emoji: "", answer: "", poster: "", creator: playerName || "You" });
  };

  const renderCreateModal = () => {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
        <div className="w-full max-w-lg rounded-2xl bg-slate-900 p-6 text-slate-50 shadow-xl shadow-cyan-500/30">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Create a Filmoji</h2>
            <button className="text-sm text-slate-300" onClick={() => setIsCreateOpen(false)}>
              Close
            </button>
          </div>
          <div className="mt-4 space-y-3">
            <input
              className="w-full rounded-lg border border-cyan-400/40 bg-slate-800 px-3 py-2 text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              value={createForm.emoji}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, emoji: e.target.value }))}
              placeholder="Emoji story (e.g., 👨‍🚀🌕)"
            />
            <input
              className="w-full rounded-lg border border-cyan-400/40 bg-slate-800 px-3 py-2 text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              value={createForm.answer}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, answer: e.target.value }))}
              placeholder="Answer movie title"
            />
            <input
              className="w-full rounded-lg border border-cyan-400/40 bg-slate-800 px-3 py-2 text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              value={createForm.poster}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, poster: e.target.value }))}
              placeholder="Poster URL"
            />
            <input
              className="w-full rounded-lg border border-cyan-400/40 bg-slate-800 px-3 py-2 text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              value={createForm.creator}
              onChange={(e) => setCreateForm((prev) => ({ ...prev, creator: e.target.value }))}
              placeholder="Creator name"
            />
          </div>
          <button
            className="mt-5 w-full rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 font-semibold disabled:opacity-50"
            disabled={!createForm.emoji || !createForm.answer || !createForm.poster}
            onClick={() => handleCreate(createForm)}
          >
            Save Puzzle
          </button>
        </div>
      </div>
    );
  };

  const coverItems = useMemo(
    () =>
      puzzles.map((puzzle) => (
        <div className="mx-4" key={puzzle.id}>
          <MovieCard
            emoji={puzzle.emoji}
            poster={puzzle.poster}
            riddler={puzzle.creator}
            unlocked={Boolean(puzzle.unlocked)}
            solvedBy={puzzle.solvedBy}
            rating={puzzle.rating}
            onRate={(score) => handleRate(puzzle.id, score)}
          />
        </div>
      )),
    [puzzles]
  );

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-950 via-slate-900 to-black text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.08),transparent_38%),radial-gradient(circle_at_80%_0%,rgba(255,0,204,0.07),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:160px_160px] opacity-60" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-xs tracking-[0.3em] text-cyan-200/80">Filmoji</p>
          <h1 className="text-3xl font-black uppercase tracking-tight text-fuchsia-200 drop-shadow-[0_4px_20px_rgba(255,0,204,0.5)] md:text-4xl">
            Guess the Movie by Emoji
          </h1>
        </div>
        <button
          className="rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold shadow-[0_0_20px_rgba(0,255,255,0.35)]"
          onClick={() => setIsCreateOpen(true)}
        >
          + Add Puzzle
        </button>
      </header>

      <main className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12">
        <div className="flex items-center justify-between rounded-2xl border border-cyan-500/30 bg-slate-900/60 px-4 py-3 text-sm">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-fuchsia-500 shadow-[0_0_12px_rgba(255,0,204,0.8)]" />
            <span>Player: {playerName || "Unknown"}</span>
          </div>
          {activePuzzle ? <span className="text-cyan-100/80">Current: {activePuzzle.emoji}</span> : null}
        </div>

        <Coverflow items={coverItems} onActiveIndexChange={setActiveIndex} />

        {activePuzzle ? (
          <motion.div
            key={activePuzzle.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-cyan-500/30 bg-slate-900/70 p-4"
          >
            <p className="text-sm text-cyan-100/80">Guess what's the movie name?</p>
            <form
              className="mt-3 flex w-full max-w-3xl flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const formData = new FormData(form);
                const guess = (formData.get("guess") as string) ?? "";
                handleGuess(activePuzzle.id, guess);
              }}
            >
              <input
                name="guess"
                value={activePuzzle.guess ?? ""}
                className="w-full max-w-xl rounded-lg border border-cyan-400/40 bg-slate-800 px-3 py-2 text-slate-100 focus:border-fuchsia-400 focus:outline-none"
                placeholder="Movie name"
                onChange={(event) => {
                  const value = event.target.value;
                  setPuzzles((prev) => prev.map((p) => (p.id === activePuzzle.id ? { ...p, guess: value } : p)));
                }}
              />
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 font-semibold"
              >
                Guess
              </button>
            </form>
            {!activePuzzle.unlocked ? null : (
              <p className="mt-2 text-xs text-emerald-200">Unlocked! Click the card to view poster, then creator & ratings.</p>
            )}
          </motion.div>
        ) : null}
      </main>

      {isMounted ? (
        <LoginModal
          isOpen={isNameModalOpen}
          gameName="Filmoji"
          playerName={playerName}
          onPlayerNameChange={setPlayerName}
          onSubmit={() => {
            if (!playerName.trim()) return;
            setIsNameModalOpen(false);
          }}
        />
      ) : null}
      {isCreateOpen && renderCreateModal()}

      {snackbar ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-fuchsia-400/40 bg-slate-950/90 px-4 py-2 text-sm text-fuchsia-100 shadow-[0_0_20px_rgba(255,0,204,0.3)]">
          {snackbar}
        </div>
      ) : null}
    </div>
  );
};

export default FilmojiGame;
