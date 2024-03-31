import React, { useState, useEffect } from "react";
import Image from "next/image";

interface CoverflowProps {
  covers: string[];
}

const Coverflow: React.FC<CoverflowProps> = ({ covers }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        setActiveIndex((prevIndex) =>
          Math.min(prevIndex + 1, covers.length - 1)
        );
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [covers.length]);

  return (
    <div className="flex overflow-x-scroll py-12">
      {covers.map((cover, index) => (
        <div
          key={index}
          className={`transform transition-transform mx-6 duration-500 ease-in-out cursor-pointer relative ${
            index === activeIndex ? "scale-100" : "scale-90"
          }`}
          style={
            index === activeIndex
              ? {}
              :  index > activeIndex ? { transform: "perspective(500px) rotateY(-30deg)" } : { transform: "perspective(500px) rotateY(30deg)" }
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
            <Image src={cover} width={192} height={288} alt="Movie Cover Reflection" className="absolute w-full h-full top-full transform -scale-y-100" />
            <div className="absolute w-full h-full top-full transform -scale-y-100" style={{background: 'linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 100%)'}} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Coverflow;
