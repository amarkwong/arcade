"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Button from "../Button/Button";
import InputField from "../InputField/InputField";

export type CreatePuzzleForm = {
	emoji: string;
	answer: string;
	poster?: string;
	creator: string;
};

const formSchema = z.object({
	emoji: z.string().min(1, "Emoji story is required"),
	answer: z.string().min(1, "Answer is required"),
	poster: z
		.string()
		.url("Poster must be a valid URL")
		.optional()
		.or(z.literal("")),
	creator: z.string().min(1, "Creator is required"),
});

interface CreatePuzzleProps {
	isOpen: boolean;
	defaultValues?: CreatePuzzleForm;
	onClose: () => void;
	onSave: (payload: CreatePuzzleForm) => void;
}

const CreatePuzzle: React.FC<CreatePuzzleProps> = ({
	isOpen,
	defaultValues,
	onClose,
	onSave,
}) => {
	const dialogRef = useRef<HTMLDialogElement | null>(null);
	const [posterUrl, setPosterUrl] = useState<string | null>(
		defaultValues?.poster ?? null,
	);
	const [posterError, setPosterError] = useState<string | null>(null);
	const [posterLoading, setPosterLoading] = useState(false);

	const formDefaults = useMemo<CreatePuzzleForm>(() => {
		return (
			defaultValues || {
				emoji: "",
				answer: "",
				poster: "",
				creator: "",
			}
		);
	}, [defaultValues]);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		watch,
	} = useForm<CreatePuzzleForm>({
		resolver: zodResolver(formSchema),
		defaultValues: formDefaults,
	});

	const answerValue = watch("answer");

	useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen && !dialog.open) {
			dialog.showModal();
			reset(formDefaults);
			setPosterUrl(formDefaults.poster || null);
			setPosterError(null);
		} else if (!isOpen && dialog.open) {
			dialog.close();
		}
	}, [formDefaults, isOpen, reset]);

	const fetchPoster = async () => {
		const title = answerValue?.trim();
		if (!title) {
			setPosterUrl(null);
			setPosterError(null);
			return;
		}

		const controller = new AbortController();
		try {
			setPosterLoading(true);
			setPosterError(null);
			const response = await fetch(
				`/api/movies?title=${encodeURIComponent(title)}`,
				{
					signal: controller.signal,
				},
			);
			if (!response.ok) {
				setPosterUrl(null);
				setPosterError("Could not fetch poster");
				return;
			}
			const data = (await response.json()) as { poster?: string | null };
			if (data.poster) {
				setPosterUrl(data.poster);
			} else {
				setPosterUrl(null);
				setPosterError("Poster not found for that title");
			}
		} catch (error) {
			if (controller.signal.aborted) return;
			setPosterUrl(null);
			setPosterError("Failed to fetch poster");
		} finally {
			setPosterLoading(false);
		}
	};

	if (!isOpen) return null;

	const onSubmit = (values: CreatePuzzleForm) => {
		onSave({ ...values, poster: posterUrl ?? "" });
		reset(formDefaults);
		onClose();
	};

	return (
		<dialog
			ref={dialogRef}
			className="fixed inset-0 z-40 m-0 flex items-center justify-center bg-black/70 backdrop-blur-sm"
			onCancel={(event) => {
				event.preventDefault();
				onClose();
			}}
		>
			<div className="flex min-h-screen w-screen items-center justify-center p-6">
				<div className="w-full max-w-lg rounded-2xl bg-slate-900 p-6 text-slate-50 shadow-xl shadow-cyan-500/30 max-h-[90vh] overflow-y-auto">
					<div className="flex items-center justify-between gap-4">
						<h2 className="text-lg font-bold">Create a Filmoji</h2>
						<button
							className="text-sm text-slate-300 hover:text-slate-100"
							onClick={onClose}
						>
							X
						</button>
					</div>
					<form
						className="mt-5 flex flex-col gap-4"
						onSubmit={handleSubmit(onSubmit)}
					>
						<InputField
							autoFocus
							name="emoji"
							label="Emoji story"
							placeholder="use pure emoji to describe this movie (e.g., 👨‍🚀🌕 for interstellar)"
							type="emoji"
							register={register}
							error={errors.emoji}
						/>
						<InputField
							name="answer"
							label="Answer"
							placeholder="Movie title"
							type="string"
							register={register}
							error={errors.answer}
							onBlur={fetchPoster}
						/>
						<div className="space-y-2">
							<p className="text-xs tracking-[0.2em] text-slate-300">Poster</p>
							{posterLoading ? (
								<p className="text-xs text-slate-300">Fetching poster…</p>
							) : null}
							{posterError ? (
								<p className="text-xs text-rose-300">{posterError}</p>
							) : null}
							<div
								className="relative w-full overflow-hidden rounded-lg bg-slate-900/60 shadow-md max-h-80 md:max-h-96"
								style={{ aspectRatio: "2 / 3" }}
							>
								{posterUrl ? (
									<img
										src={posterUrl}
										alt={`Poster for ${answerValue || "movie"}`}
										className="h-full w-full object-contain"
									/>
								) : (
									<div className="flex h-full w-full items-center justify-center border border-dashed border-slate-700 text-sm text-slate-400">
										Poster will appear after fetching
									</div>
								)}
							</div>
						</div>
						<InputField
							name="creator"
							label="Creator name"
							placeholder="Your name"
							type="string"
							register={register}
							error={errors.creator}
						/>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="mt-2 w-full"
						>
							{isSubmitting ? "Saving..." : "Save Puzzle"}
						</Button>
					</form>
				</div>
			</div>
		</dialog>
	);
};

export default CreatePuzzle;
