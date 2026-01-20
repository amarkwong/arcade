import type React from "react";

interface GuessProps {
	value: string;
	onChange: (next: string) => void;
	onSubmit: (guess: string) => void;
}

const Guess: React.FC<GuessProps> = ({ value, onChange, onSubmit }) => {
	return (
		<div className="mx-auto w-full max-w-lg rounded-md border border-sky-400/20 bg-slate-700/75 p-7 shadow-md">
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
				<p className="text-lg font-semibold text-sky-100/90">Guess what's the movie name?</p>
				<input
					name="guess"
					value={value}
					className="w-full rounded-lg border border-sky-400/25 bg-slate-800 px-4 py-3 text-lg text-slate-100 focus:border-sky-300 focus:outline-none"
					placeholder="Movie name"
					onChange={(event) => onChange(event.target.value)}
				/>
				<button
					type="submit"
					className="w-full rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 px-4 py-3 text-lg font-semibold text-white shadow-[0_0_14px_rgba(56,189,248,0.15)] transition-transform hover:scale-[1.01]"
				>
					Guess
				</button>
			</form>
		</div>
	);
};

export default Guess;
