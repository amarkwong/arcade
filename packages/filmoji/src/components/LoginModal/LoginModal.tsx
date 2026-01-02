"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface LoginModalProps {
  isOpen: boolean;
  gameName: string;
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onSubmit: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, gameName, playerName, onPlayerNameChange, onSubmit }) => {
  const [mounted, setMounted] = useState(false);
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const createdRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let el = document.getElementById("arcade-login-modal-root");
    if (!el) {
      el = document.createElement("div");
      el.id = "arcade-login-modal-root";
      document.body.appendChild(el);
      createdRef.current = true;
    }
    setContainer(el);

    return () => {
      if (createdRef.current && el?.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, [mounted]);

  if (!mounted || !container || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-slate-900 p-6 text-slate-50 shadow-xl shadow-cyan-500/30">
        <h2 className="text-xl font-bold">Welcome to {gameName}</h2>
        <p className="mt-2 text-sm text-slate-200">Enter a player name to start</p>
        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
          }}
        >
          <label className="block text-xs uppercase tracking-[0.2em] text-cyan-200/80">
            Player name
            <input
              autoFocus
              className="mt-2 w-full rounded-lg border border-cyan-400/40 bg-slate-800 px-3 py-2 text-slate-100 focus:border-fuchsia-400 focus:outline-none"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              placeholder="Player name"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 font-semibold disabled:opacity-60"
            disabled={!playerName.trim()}
          >
            Start
          </button>
        </form>
      </div>
    </div>,
    container
  );
};

export default LoginModal;
