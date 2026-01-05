import Image from "next/image";

interface GameSlotProps {
	href: string;
	src: string;
	caption: string;
	active?: boolean;
	onActivate?: () => void;
}

export const GameSlot: React.FC<GameSlotProps> = ({
	href,
	src,
	caption,
	active = false,
	onActivate,
}) => {
	const baseClass =
		"group relative h-72 w-40 cursor-pointer select-none overflow-hidden rounded-xl bg-gradient-to-b " +
		"from-slate-900/90 via-slate-950 to-black border border-cyan-400/30 " +
		"shadow-[0_0_25px_rgba(0,255,255,0.22)]";

	const accentClass = active
		? "ring-4 ring-fuchsia-400/70 shadow-[0_0_40px_rgba(255,0,153,0.35)]"
		: "ring-2 ring-cyan-600/50";

	return (
		<div
			role="button"
			tabIndex={0}
			data-href={href}
			onClick={onActivate}
			onKeyDown={(event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					onActivate?.();
				}
			}}
			className={`${baseClass} ${accentClass}`}
		>
			<div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-amber-300 opacity-0 blur transition duration-300 group-hover:opacity-60 group-focus-visible:opacity-60" />
			<div className="relative z-10 flex h-full flex-col items-center justify-between px-4 py-5 text-center">
				<div className="relative h-36 w-32 drop-shadow-[0_0_18px_rgba(0,255,255,0.25)]">
					<Image
						src={src}
						alt={caption}
						fill
						sizes="160px"
						style={{ objectFit: "contain" }}
					/>
				</div>
				<div className="space-y-1">
					<p className="text-sm font-semibold tracking-wide text-cyan-100 drop-shadow-[0_2px_10px_rgba(0,255,255,0.35)]">
						{caption}
					</p>
				</div>
			</div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(255,0,204,0.08),transparent_35%)]" />
		</div>
	);
};
