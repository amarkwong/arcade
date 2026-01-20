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
		"from-slate-700/90 via-slate-800 to-slate-900 border border-sky-400/25 " +
		"shadow-[0_0_20px_rgba(56,189,248,0.12)]";

	const accentClass = active
		? "ring-4 ring-sky-400/60 shadow-[0_0_30px_rgba(56,189,248,0.25)]"
		: "ring-2 ring-slate-500/40";

	return (
		<button
			type="button"
			data-href={href}
			onClick={onActivate}
			className={`${baseClass} ${accentClass}`}
		>
			<div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-sky-400 via-teal-400 to-sky-300 opacity-0 blur transition duration-300 group-hover:opacity-40 group-focus-visible:opacity-40" />
			<div className="relative z-10 flex h-full flex-col items-center justify-between px-4 py-5 text-center">
				<div className="relative h-36 w-32 drop-shadow-[0_0_14px_rgba(56,189,248,0.15)]">
					<Image src={src} alt={caption} fill sizes="160px" style={{ objectFit: "contain" }} />
				</div>
				<div className="space-y-1">
					<p className="text-sm font-semibold tracking-wide text-sky-100 drop-shadow-[0_2px_8px_rgba(56,189,248,0.2)]">
						{caption}
					</p>
				</div>
			</div>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.05),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(45,106,138,0.05),transparent_35%)]" />
		</button>
	);
};
