import styles from "Coverflow.module.css";
import { motion } from "framer-motion";
import Image from "next/image";
import type React from "react";
import { useEffect, useRef, useState } from "react";

type Renderable = string | React.ReactNode;

interface CoverflowProps {
	items?: Renderable[];
	covers?: string[]; // backward compatibility
	onActiveIndexChange?: (index: number) => void;
}

const Coverflow: React.FC<CoverflowProps> = ({
	items,
	covers,
	onActiveIndexChange,
}) => {
	const data = items ?? covers ?? [];
	const [activeIndex, setActiveIndex] = useState(0);
	const coverflowContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			switch (event.key) {
				case "ArrowRight":
					setActiveIndex((prevIndex) =>
						Math.min(prevIndex + 1, Math.max(data.length - 1, 0)),
					);
					break;
				case "ArrowLeft":
					setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [data.length]);

	useEffect(() => {
		if (coverflowContainerRef.current) {
			const coverflowContainer = coverflowContainerRef.current;
			const activeCover = coverflowContainer.children[activeIndex];
			const scrollLeft =
				activeCover.offsetLeft -
				coverflowContainer.offsetWidth / 2 +
				activeCover.offsetWidth / 2;
			setTimeout(() => {
				coverflowContainer.scrollTo({
					left: scrollLeft,
					behavior: "smooth",
				});
			}, 0);
		}
	}, [activeIndex]);

	useEffect(() => {
		onActiveIndexChange?.(activeIndex);
	}, [activeIndex, onActiveIndexChange]);

	return (
		<>
			<div
				ref={coverflowContainerRef}
				className="flex overflow-x-scroll py-12"
				style={{
					perspective: 600,
				}}
				id="coverflow"
			>
				{Array(Math.max(0, 2 - activeIndex))
					.fill(null)
					.map((_, index) => (
						<div key={index} className={styles.coverPlaceholder} />
					))}

				{data
					.slice(
						Math.min(
							Math.max(0, activeIndex - 2),
							Math.max(data.length - 3, 0),
						),
						activeIndex + 3,
					)
					.map((item, index) => {
						const originalIndex =
							Math.min(
								Math.max(0, activeIndex - 2),
								Math.max(data.length - 3, 0),
							) + index;
						const distance = Math.abs(originalIndex - activeIndex);
						const rotation =
							originalIndex === activeIndex
								? 0
								: originalIndex > activeIndex
									? -50 - 4 * distance
									: 50 + 4 * distance;
						const scale = originalIndex === activeIndex ? 1 : 0.95 ** distance;
						return (
							<motion.div
								key={originalIndex}
								animate={{
									rotateY: rotation,
									scale: scale,
								}}
								transition={{ duration: 0.2, ease: "easeInOut" }}
								onClick={() => setActiveIndex(originalIndex)}
							>
								<div className="relative">
									{typeof item === "string" ? (
										<>
											<Image
												src={item}
												alt="Cover"
												width={192}
												height={288}
												layout="responsive"
											/>
											<div className={styles.reflection}>
												<Image
													src={item}
													width={192}
													height={288}
													alt="Cover Reflection"
													className="absolute w-full h-full top-full transform -scale-y-100"
												/>
											</div>
										</>
									) : (
										item
									)}
								</div>
							</motion.div>
						);
					})}

				{/* Placeholders for activeIndex + 1 and activeIndex + 2 */}
				{Array(Math.max(0, activeIndex + 3 - data.length))
					.fill(null)
					.map((_, index) => (
						<div key={index + 2} className={styles.coverPlaceholder} />
					))}
			</div>
		</>
	);
};

export default Coverflow;
