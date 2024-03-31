import Image from 'next/image';
import Link from 'next/link';

interface GameSlotProps {
  href: string;
  src: string;
  caption: string;
}

export const GameSlot: React.FC<GameSlotProps> = ({ href, src, caption }) => {
  return (
    <div className="flex-grow">
      <Link href={href}>
          <div className="relative h-64 w-32">
            <Image
              src={src}
              alt={caption}
              layout="fill"
              objectFit="contain"
            />
          </div>
          <p>{caption}</p>
      </Link>
    </div>
  );
};