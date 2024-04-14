import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from 'framer-motion';
import styles from "./Coverflow.module.css";

interface CoverflowProps {
  covers: string[];
}

const Coverflow: React.FC<CoverflowProps> = ({ covers }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  console.log('activeIndex',activeIndex)
  const coverflowContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowRight':
          setActiveIndex((prevIndex) => Math.min(prevIndex + 1, covers.length - 1));
          break;
        case 'ArrowLeft':
          setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [covers.length]);


  useEffect(() => {
    if (coverflowContainerRef.current) {
      const coverflowContainer = coverflowContainerRef.current;
      const activeCover = coverflowContainer.children[activeIndex];
      const scrollLeft = activeCover.offsetLeft - (coverflowContainer.offsetWidth / 2) + (activeCover.offsetWidth / 2);
      setTimeout(() => {
        coverflowContainer.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }, 0);
    }
  }, [activeIndex]);

  console.log('covers',covers)

  return (
    <>
    <div ref={coverflowContainerRef} className="flex overflow-x-scroll py-12" style={{
      perspective: 600,
    }} id="coverflow" >
   {Array(Math.max(0, 2 - activeIndex)).fill(null).map((_, index) => (
      <div key={index} className={styles.coverPlaceholder}></div>
    ))}

    {covers.slice(Math.min(Math.max(0, activeIndex - 2),covers.length-3), activeIndex + 3).map((cover, index) => {
   const originalIndex = Math.min(Math.max(0, activeIndex - 2), covers.length - 3) + index;
   const distance = Math.abs(originalIndex - activeIndex);
   const rotation = originalIndex === activeIndex ? 0 :
     (originalIndex > activeIndex ? -50 - 4 * distance : 50 + 4 * distance);
   const scale = originalIndex === activeIndex ? 1 : Math.pow(0.95, distance);
        return (
          <motion.div
            key={originalIndex}
            animate={
              {
              rotateY: rotation,
              scale: scale,
              }
            }
            transition={{ duration: 0.2, ease: "easeInOut" }}
            onClick={() => setActiveIndex(originalIndex)}
          >
            <div className="relative">
              <Image
                src={cover}
                alt="Movie Cover"
                width={192}
                height={288}
                layout="responsive"
              />
              <div className={styles.reflection}>
                <Image
                  src={cover}
                  width={192}
                  height={288}
                  alt="Movie Cover Reflection"
                  className="absolute w-full h-full top-full transform -scale-y-100"
                />
              </div>
            </div>
          </motion.div>
        );
      })}

          {/* Placeholders for activeIndex + 1 and activeIndex + 2 */}
    {Array(Math.max(0, activeIndex + 3 - covers.length)).fill(null).map((_, index) => (
      <div key={index + 2} className={styles.coverPlaceholder}></div>
    ))}
    </div>
    </>
  );
};

export default Coverflow;
