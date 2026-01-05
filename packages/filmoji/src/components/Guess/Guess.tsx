import type React from "react";

interface GuessProps {
	value: string;
	onChange: (next: string) => void;
	onSubmit: (guess: string) => void;
}

const Guess: React.FC<GuessProps> = ({ value, onChange, onSubmit }) => {
	return (
		<div className="mx-auto w-full max-w-lg rounded-md border border-cyan-500/20 bg-slate-900/75 p-7 shadow-md">
			<form
				className="flex flex-col gap-4"
				onSubmit={(event) => {
					event.preventDefault();
					const form = event.currentTarget;
					const formData = new FormData(form);
					const guess = (formData.get("guess") as string) ?? "";
					onSubmit(guess);
				}}
			>
				<p className="text-lg font-semibold text-cyan-100/90">Guess what's the movie name?</p>
				<input
					name="guess"
					value={value}
					className="w-full rounded-lg border border-cyan-500/25 bg-slate-800 px-4 py-3 text-lg text-slate-100 focus:border-fuchsia-400 focus:outline-none"
					placeholder="Movie name"
					onChange={(event) => onChange(event.target.value)}
				/>
				<button
					type="submit"
					className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-3 text-lg font-semibold text-white shadow-[0_0_18px_rgba(0,255,255,0.25)] transition-transform hover:scale-[1.01]"
				>
					Guess
				</button>
			</form>
		</div>
	);
};

export default Guess;
