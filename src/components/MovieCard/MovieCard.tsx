"use client";
import React, { useState } from "react";
import Image from "next/image";
import "./MovieCard.module.css";
import { motion } from "framer-motion";

export type Solver = {
  name: string;
  id: string;
  color: string;
  timestamp: Date;
};
export interface MovieCardProps {
  emoji: string;
  movie: string;
  riddler: string;
  solvedBy?: Solver[];
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

// const shake = {
//   0: { transform: 'translateX(-10px)' },
//   0.1: { transform: 'translateX(10px)' },
//   0.2: { transform: 'translateX(-10px)' },
//   0.3: { transform: 'translateX(10px)' },
//   0.4: { transform: 'translateX(0px)' }
// }

const shake = {
  rotateY: [0, -10, 10, -10, 10, 0],
  transition: {
    duration: 0.5,
  },
};

const MovieCard: React.FC<MovieCardProps> = ({
  emoji,
  movie,
  riddler,
  solvedBy,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [flippable, setFlippable] = useState(solvedBy ? true : false);
  const [clicked, setClicked] = useState(false);

  const firstEightSolvers = solvedBy?.slice(0, 8);

  const handleCardClick = () => {
    if (flippable) {
      setIsFlipped(!isFlipped);
    } else {
      setClicked(true);

      setTimeout(() => {
        setClicked(false);
      }, 500);
    }
  };

  const background = firstEightSolvers
    ? firstEightSolvers.length === 1
      ? {
          backgroundColor: firstEightSolvers[0].color,
        }
      : {
          // * ensure we only display the color of the first 10 solvers
          // background: `linear-gradient(to bottom, ${firstEightSolvers?.map((solver, index) => `${solver.color} ${index === 0 ? 0 : FibFrac(index+1, firstEightSolvers.length)}%, ${solver.color} ${FibFrac(index+1, firstEightSolvers.length)}%${index === firstEightSolvers.length - 1 ? ')' : ''}`)}`
          background: `linear-gradient(to bottom, ${firstEightSolvers?.map((solver, index) => `${solver.color} ${index === 0 ? 0 : FibFrac(index, firstEightSolvers.length)}%, ${solver.color} ${FibFrac(index + 1, firstEightSolvers.length)}%${index === firstEightSolvers.length - 1 ? ")" : ""}`)}`,
        }
    : {
        background: `url("/lock.svg")`,
        backgroundSize: "contain",
        backgroundColor: "gray",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };

  return (
      <motion.div
        onClick={handleCardClick}
        animate={clicked ? shake : {}}
        className="w-48 h-72"
      >
        <div
          className={`w-full h-full transition-transform duration-500 ${isFlipped ? "rotate-y-180" : ""}`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front Side */}
          <div
            className="absolute w-full h-full flex items-center justify-center text-4xl bg-opacity-60 backdrop-blur-md rounded-lg shadow-xl"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(0deg)",
              zIndex: isFlipped ? 0 : 1,
              ...background,
            }}
          >
            {emoji}
          </div>

          {/* Back Side */}
          <div
            className="absolute w-full h-full bg-white flex items-center justify-center transform rotate-y-180"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              zIndex: isFlipped ? 1 : 0,
            }}
          >
            <Image
              src={movie}
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
