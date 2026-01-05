"use client";
import React, { useState, useRef } from "react";
import "tailwindcss/tailwind.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import styles from "./Arcade.module.css";

const Arcade = () => {
	const router = useRouter();
	const [isZoomed, setIsZoomed] = useState(false);
	const [targetScale, setTargetScale] = useState(1);
	const arcadeRef = useRef<HTMLDivElement | null>(null);

	const handleCoinClick = () => {
		if (arcadeRef.current) {
			const { height } = arcadeRef.current.getBoundingClientRect();
			const viewportHeight =
				window.innerHeight || document.documentElement.clientHeight;
			const growToFit = (viewportHeight * 0.98) / height;
			const desiredScale = Math.min(3, Math.max(1.4, growToFit));
			setTargetScale(desiredScale);
		}
		setIsZoomed(true);
		setTimeout(() => {
			router.push("/GameSelector");
		}, 1000); // Adjust this delay to match the duration of your animation
	};

	return (
		<motion.div
			ref={arcadeRef}
			className={styles.arcade}
			animate={isZoomed ? { scale: targetScale } : { scale: 1 }}
			transition={{ duration: 1.1, ease: "easeInOut" }}
			style={{ transformOrigin: "center center" }}
		>
			<div className={styles.bg}>
				<div className={styles["brick-block-1"]}>
					<div className={styles["brick-1"]} />
					<div className={styles["brick-2"]} />
				</div>
				<div className={styles["brick-block-2"]}>
					<div className={styles["brick-1"]} />
					<div className={styles["brick-2"]} />
					<div className={styles["brick-3"]} />
				</div>
			</div>
			<div className={styles["arcade-container"]}>
				<div className={styles["arcade-wall"]}>
					<div className={`${styles.detail} ${styles["detail-1"]}`} />
					<div className={`${styles.detail} ${styles["detail-2"]}`} />
					<div className={styles.top}>
						<div className={styles["block-1"]} />
						<div className={styles["block-2"]} />
						<div className={styles["block-3"]} />
						<div className={styles["block-4"]} />
						<div className={styles["block-5"]} />
						<div className={styles["block-6"]} />
						<div className={styles["block-7"]} />
					</div>
				</div>
				<div className={styles["arcade-mid"]}>
					<div className={styles.top}>
						<div className={styles["b1-cont"]}>
							<div className={`${styles.border} ${styles.left}`} />
							<div className={styles["block-1"]} />
							<div className={`${styles.border} ${styles.right}`} />
						</div>
						<div className={styles["block-2"]} />
					</div>
					<div className={styles.screen}>
						<div className={styles["pacman-container"]}>
							<div className={styles.pacman} />
						</div>
					</div>
					<div className={styles.mid}>
						<div className={styles["block-1"]}>
							<div className={styles.joystick} />
							<div className={`${styles.button} ${styles.yellow}`} />
							<div className={`${styles.button} ${styles.red}`} />
						</div>
						<div className={styles["block-2"]}>
							<div className={styles.speakers} />
							<div className={styles.coins} onClick={handleCoinClick} />
						</div>
						<div className={styles["block-3"]} />
					</div>
					<div className={styles.bottom}>
						<div className={styles["block-1"]}>
							<div className={styles["box-1"]}>
								<div className={styles["box-2"]} />
							</div>
						</div>
					</div>
				</div>
				<div className={`${styles["arcade-wall"]} ${styles.alt}`}>
					<div className={styles.top}>
						<div className={styles["block-1"]} />
						<div className={styles["block-2"]} />
						<div className={styles["block-3"]} />
						<div className={styles["block-4"]} />
						<div className={styles["block-5"]} />
						<div className={styles["block-6"]} />
						<div className={styles["block-7"]} />
					</div>
				</div>
			</div>
			<div className={styles.extra}>
				<div className={styles.plug} />
				<div className={styles.wire} />
				<div className={styles.drink} />
			</div>
			<div className={styles.ground} />
		</motion.div>
	);
};

export default Arcade;
