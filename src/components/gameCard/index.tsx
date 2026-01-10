import Link from 'next/link';
import Image from 'next/image';
import { BiRightArrowCircle } from 'react-icons/bi';
import { GameProps } from '@/utils/types/game';

interface GameCardProps {
  gameData: GameProps
}

export function GameCard({ gameData }: GameCardProps) {
  return (
    <Link href={`/game/${gameData.id}`}>
      <section className='w-full bg-slate-200 rounded-lg p-4 mb-5'>
        <div className='relative w-full h-56 hover:scale-105 transition-all duration-300'>
          <Image
            className='rounded-lg object-cover'
            src={gameData.image_url}
            alt={gameData.title}
            fill
            quality={100}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
          />
        </div>

        <div className='flex items-center mt-4 justify-between'>
          <p className='text-sm font-bold px-2 text-black text-ellipsis truncate whitespace-nowrap overflow-hidden'>{gameData.title}</p>
          <BiRightArrowCircle size={24} color="#000" />
        </div>
      </section>
    </Link>
  );
}