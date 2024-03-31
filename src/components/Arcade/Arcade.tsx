'use client'
import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import styles from "./Arcade.module.css";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const Arcade = () => {
  const router = useRouter();
  const [isZoomed, setIsZoomed] = useState(false);

  const handleCoinClick = () => {
    setIsZoomed(true);
    setTimeout(() => {
      router.push("/GameSelctor");
    }, 1000); // Adjust this delay to match the duration of your animation
  };

  return (
    <div className={styles.arcade}>
      <div className={styles.bg}>
        <div className={styles["brick-block-1"]}>
          <div className={styles["brick-1"]}></div>
          <div className={styles["brick-2"]}></div>
        </div>
        <div className={styles["brick-block-2"]}>
          <div className={styles["brick-1"]}></div>
          <div className={styles["brick-2"]}></div>
          <div className={styles["brick-3"]}></div>
        </div>
      </div>
      <div className={styles["arcade-container"]}>
        <div className={styles["arcade-wall"]}>
          <div className={`${styles.detail} ${styles["detail-1"]}`}></div>
          <div className={`${styles.detail} ${styles["detail-2"]}`}></div>
          <div className={styles.top}>
            <div className={styles["block-1"]}></div>
            <div className={styles["block-2"]}></div>
            <div className={styles["block-3"]}></div>
            <div className={styles["block-4"]}></div>
            <div className={styles["block-5"]}></div>
            <div className={styles["block-6"]}></div>
            <div className={styles["block-7"]}></div>
          </div>
        </div>
        <div className={styles["arcade-mid"]}>
          <div className={styles.top}>
            <div className={styles["b1-cont"]}>
              <div className={`${styles.border} ${styles.left}`}></div>
              <div className={styles["block-1"]}></div>
              <div className={`${styles.border} ${styles.right}`}></div>
            </div>
            <div className={styles["block-2"]}></div>
          </div>
          <div className={styles.screen}>
            <motion.div
              animate={isZoomed ? { scale: 2 } : { scale: 1 }}
              transition={{ duration: 1 }} // Adjust this duration to your liking
            >
              <div className={styles["pacman-container"]}>
                <div className={styles.pacman}></div>
              </div>
            </motion.div>
          </div>
          <div className={styles.mid}>
            <div className={styles["block-1"]}>
              <div className={styles.joystick}></div>
              <div className={`${styles.button} ${styles.yellow}`}></div>
              <div className={`${styles.button} ${styles.red}`}></div>
            </div>
            <div className={styles["block-2"]}>
              <div className={styles.speakers}></div>
              <div className={styles.coins} onClick={handleCoinClick}></div>
            </div>
            <div className={styles["block-3"]}></div>
          </div>
          <div className={styles.bottom}>
            <div className={styles["block-1"]}>
              <div className={styles["box-1"]}>
                <div className={styles["box-2"]}></div>
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles["arcade-wall"]} ${styles.alt}`}>
          <div className={styles.top}>
            <div className={styles["block-1"]}></div>
            <div className={styles["block-2"]}></div>
            <div className={styles["block-3"]}></div>
            <div className={styles["block-4"]}></div>
            <div className={styles["block-5"]}></div>
            <div className={styles["block-6"]}></div>
            <div className={styles["block-7"]}></div>
          </div>
        </div>
      </div>
      <div className={styles.extra}>
        <div className={styles.plug}></div>
        <div className={styles.wire}></div>
        <div className={styles.drink}></div>
      </div>
      <div className={styles.ground}></div>
    </div>
  );
};

export default Arcade;
