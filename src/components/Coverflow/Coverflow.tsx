import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./Coverflow.module.css";

interface CoverflowProps {
  covers: string[];
}

const Coverflow: React.FC<CoverflowProps> = ({ covers }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const coverflowContainerRef = useRef(null);

  useEffect(() => {
    const coverflowContainer = coverflowContainerRef.current;
    const activeCover = coverflowContainer.children[activeIndex];
    const scrollLeft = activeCover.offsetLeft - (coverflowContainer.offsetWidth / 2) + (activeCover.offsetWidth / 2);
    coverflowContainer.scrollTo({
      left: scrollLeft,
      behavior: 'smooth'
    });
  }, [activeIndex]);

  return (
    <div ref={coverflowContainerRef} className="flex overflow-x-scroll py-12">
      {covers.map((cover, index) => {
        const distance = Math.abs(index - activeIndex);
        const rotation =
          index > activeIndex ? -50 - 4 * distance : 50 + 4 * distance;
        return (
          <div
            key={index}
            className={`transform transition-transform duration-500 ease-in-out cursor-pointer relative ${
              index === activeIndex ? "scale-100" : "scale-90"
            }`}
            style={
              index === activeIndex
                ? {}
                : { transform: `perspective(500px) rotateY(${rotation}deg)` }
            }
            onClick={() => setActiveIndex(index)}
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
          </div>
        );
      })}
    </div>
  );
};

export default Coverflow;
