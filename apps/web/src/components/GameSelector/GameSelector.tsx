import Link from "next/link";
import Image from "next/image";
import { GameSlot } from "../GameSlot/GameSlot";

export const GameSelector = () => {
    const games = [
        {
            href: "/game1",
            src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYY3OsM-omdLPBKjEn0-sWVC_CDVMFLgKA4A&usqp=CAU",
            caption: "Emoji Movie",
        },
        {
            href: "https://garticphone.com/",
            src: "https://garticphone.com/images/thumb.png",
            caption: "Gartic Phone",
        },
        {
            href: "https://skribbl.io/",
            src: "https://athletesforkids.org/wp-content/uploads/2020/04/Skribble-image2.png",
            caption: "Skribbl",
        },
    ]
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Game Selector</h1>
      <div className="flex space-x-4">
        {games.map((game, index) => 
            <GameSlot key={index} href={game.href} src={game.src} caption={game.caption} />
        )}
      </div>
    </div>
  );
};
