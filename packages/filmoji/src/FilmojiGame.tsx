"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Coverflow from "./components/Coverflow/Coverflow";
import MovieCard, { Solver } from "./components/MovieCard/MovieCard";
import LoginModal from "./components/LoginModal/LoginModal";
import Header from "./components/Header/Header";
import Guess from "./components/Guess/Guess";
import CreatePuzzle from "./components/CreatePuzzle/CreatePuzzle";
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

type ApiPuzzle = {
  id: number;
  movieName: string;
  creator: string | null;
  posterUrl: string | null;
  puzzle: string;
  answer: string;
  rating: number | null;
  solves?: {
    puzzleId: number;
    userId: number;
    userName: string | null;
    rating: number | null;
  }[];
};

const randomColor = () => {
  const palette = ["#22d3ee", "#a855f7", "#f472b6", "#f59e0b", "#06b6d4", "#10b981"];
  return palette[Math.floor(Math.random() * palette.length)];
};

const toPuzzleStateFromApi = (puzzle: ApiPuzzle): PuzzleState => ({
  id: String(puzzle.id),
  emoji: puzzle.puzzle,
  answer: puzzle.answer,
  poster: puzzle.posterUrl ?? "",
  creator: puzzle.creator ?? "Unknown",
  rating: puzzle.rating ?? undefined,
  unlocked: false,
  solvedBy:
    puzzle.solves?.map((solve) => ({
      id: `${solve.puzzleId}-${solve.userId}`,
      name: solve.userName || "Player",
      color: randomColor(),
      timestamp: new Date(),
    })) ?? [],
  guess: "",
});

const FilmojiGame: React.FC = () => {
  const [playerName, setPlayerName] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [snackbar, setSnackbar] = useState<string | null>(null);
  const snackbarTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [puzzles, setPuzzles] = useState<PuzzleState[]>([]);

  const activePuzzle = puzzles[activeIndex];
  const isOverlayOpen = isNameModalOpen || isCreateOpen;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const cachedRaw = localStorage.getItem("filmoji-user");
    if (cachedRaw) {
      try {
        const parsed = JSON.parse(cachedRaw) as { id?: number; name?: string };
        if (parsed?.id && parsed?.name) {
          setUserId(parsed.id);
          setPlayerName(parsed.name);
          setIsNameModalOpen(false);
          return;
        }
      } catch (error) {
        console.error("Failed to parse cached user", error);
      }
    }
    setIsNameModalOpen(true);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    (async () => {
      try {
        const response = await fetch("/api/puzzles", { cache: "no-store" });
        if (!response.ok) throw new Error(`Failed to load puzzles: ${response.status}`);
        const data = (await response.json()) as { puzzles?: ApiPuzzle[] };
        const fetched = (data.puzzles ?? []).map((p) => {
          const base = toPuzzleStateFromApi(p);
          const solvedByUser = userId ? p.solves?.some((s) => s.userId === userId) : false;
          return solvedByUser ? { ...base, unlocked: true } : base;
        });
        setPuzzles(fetched);
        setActiveIndex(0);
      } catch (error) {
        console.warn("Falling back to empty puzzle list", error);
        setPuzzles([]);
      }
    })();
  }, [isMounted, userId]);

  useEffect(() => {
    if (!isMounted) return;
    if (!isNameModalOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMounted, isNameModalOpen]);

  useEffect(() => {
    if (!isMounted) return;
    if (!isCreateOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMounted, isCreateOpen]);

  const handleLoginSubmit = async () => {
    const trimmed = playerName.trim();
    if (!trimmed) return;
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      if (!response.ok) throw new Error(`User save failed: ${response.status}`);
      const data = (await response.json()) as { id: number; name: string };
      setPlayerName(data.name);
      setUserId(data.id);
      localStorage.setItem("filmoji-user", JSON.stringify({ id: data.id, name: data.name }));
      setIsNameModalOpen(false);
    } catch (error) {
      console.error("Failed to persist player", error);
      setSnackbar("Could not save player. Please try again.");
      snackbarTimer.current = setTimeout(() => setSnackbar(null), 3000);
    }
  };

  const handleGuess = (id: string, guess: string) => {
    setPuzzles((prev) =>
      prev.map((puzzle) => {
        if (puzzle.id !== id) return puzzle;
        const isCorrect = puzzle.answer.toLowerCase().trim() === guess.toLowerCase().trim();
        if (!isCorrect) {
          if (snackbarTimer.current) clearTimeout(snackbarTimer.current);
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
        const puzzleIdAsNumber = Number(id);
        if (userId && !Number.isNaN(puzzleIdAsNumber)) {
          fetch(`/api/puzzles/${puzzleIdAsNumber}/solves`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          }).catch((error) => console.error("Failed to record solve", error));
        }
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
    const puzzleIdAsNumber = Number(id);
    if (userId && !Number.isNaN(puzzleIdAsNumber)) {
      fetch(`/api/puzzles/${puzzleIdAsNumber}/solves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, rating }),
      }).catch((error) => console.error("Failed to record rating", error));
    }
  };

  const handleCreate = async (payload: { emoji: string; answer: string; poster: string; creator: string }) => {
    try {
      const response = await fetch("/api/puzzles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieName: payload.answer,
          creator: payload.creator,
          posterUrl: payload.poster,
          puzzle: payload.emoji,
          answer: payload.answer,
        }),
      });

      let newPuzzle: PuzzleState | null = null;
      if (response.ok) {
        const created = (await response.json()) as ApiPuzzle;
        newPuzzle = toPuzzleStateFromApi(created);
      }

      if (!newPuzzle) {
        newPuzzle = {
          id: `local-${Date.now()}`,
          emoji: payload.emoji,
          answer: payload.answer,
          poster: payload.poster,
          creator: payload.creator,
          unlocked: false,
          solvedBy: [],
          guess: "",
        };
      }

      setPuzzles((prev) => {
        const next = [...prev, newPuzzle!];
        setActiveIndex(next.length - 1);
        return next;
      });
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Failed to create puzzle", error);
      setSnackbar("Could not create puzzle. Please try again.");
      snackbarTimer.current = setTimeout(() => setSnackbar(null), 3000);
    }
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

      <div className="px-6 py-6">
        <Header playerName={playerName} onAddPuzzle={() => setIsCreateOpen(true)} />
      </div>

      <main
        className="relative mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-12"
        aria-hidden={isOverlayOpen}
      >
        <Coverflow items={coverItems} onActiveIndexChange={setActiveIndex} />

        {activePuzzle && !isCreateOpen ? (
          <motion.div key={activePuzzle.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <Guess
              value={activePuzzle.guess ?? ""}
              onChange={(value) =>
                setPuzzles((prev) => prev.map((p) => (p.id === activePuzzle.id ? { ...p, guess: value } : p)))
              }
              onSubmit={(guess) => handleGuess(activePuzzle.id, guess)}
            />
            {!activePuzzle.unlocked ? null : (
              <p className="mt-3 text-center text-xs text-emerald-200">
                Unlocked! Click the card to view poster, then creator & ratings.
              </p>
            )}
          </motion.div>
        ) : null}
      </main>

      <LoginModal
        isOpen={isNameModalOpen}
        gameName="Filmoji"
        playerName={playerName}
        onPlayerNameChange={setPlayerName}
        onSubmit={handleLoginSubmit}
        onClose={() => setIsNameModalOpen(false)}
      />

      <CreatePuzzle
        isOpen={isCreateOpen}
        defaultValues={{ emoji: "", answer: "", poster: "", creator: playerName || "You" }}
        onClose={() => setIsCreateOpen(false)}
        onSave={handleCreate}
      />

      {snackbar ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-fuchsia-400/40 bg-slate-950/90 px-4 py-2 text-sm text-fuchsia-100 shadow-[0_0_20px_rgba(255,0,204,0.3)]">
          {snackbar}
        </div>
      ) : null}
    </div>
  );
};

export default FilmojiGame;
