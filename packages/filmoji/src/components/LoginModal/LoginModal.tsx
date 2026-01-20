"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface LoginModalProps {
	isOpen: boolean;
	gameName: string;
	playerName: string;
	onPlayerNameChange: (name: string) => void;
	onSubmit: () => void;
	onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
	isOpen,
	gameName,
	playerName,
	onPlayerNameChange,
	onSubmit,
	onClose,
}) => {
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
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
			<div className="mx-4 w-full max-w-sm rounded-2xl bg-slate-800 p-6 text-slate-50 shadow-xl shadow-sky-500/15">
				<div className="flex items-center justify-between gap-3">
					<h2 className="text-xl font-bold">Welcome to {gameName}</h2>
					<button
						type="button"
						aria-label="Close login"
						className="rounded-full px-2 py-1 text-sm text-slate-300 hover:text-slate-100"
						onClick={onClose}
					>
						✕
					</button>
				</div>
				<p className="mt-2 text-sm text-slate-200">Enter a player name to start</p>
				<form
					className="mt-4 space-y-3"
					onSubmit={(event) => {
						event.preventDefault();
						onSubmit();
					}}
				>
					<label className="block text-xs uppercase tracking-[0.2em] text-sky-200/80">
						Player name
						<input
							className="mt-2 w-full rounded-lg border border-sky-400/30 bg-slate-700 px-3 py-2 text-slate-100 focus:border-sky-300 focus:outline-none"
							value={playerName}
							onChange={(e) => onPlayerNameChange(e.target.value)}
							placeholder="Player name"
						/>
					</label>
					<button
						type="submit"
						className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-2 font-semibold disabled:opacity-60"
						disabled={!playerName.trim()}
					>
						Start
					</button>
				</form>
			</div>
		</div>,
		container,
	);
};

export default LoginModal;
