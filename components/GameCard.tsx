import Image from 'next/image';

import { GameDetails } from '@/app/db/gameDetail';
import Link from 'next/link';
import { DownloadIcon } from 'lucide-react';
import { EditGameForm } from './editGameForm';
import { Suspense } from 'react';
import GameCardSkeleton from './GameCardSkeleton';

export const GameCard = async ({ game}: { game: GameDetails, modifquery: string }) => {
    return (
      <Suspense fallback={<GameCardSkeleton />}>
        <section key={game.id} className='group overflow-hidden h-80 shadow-lg bg-card relative hover:scale-105 ease-in duration-150 rounded-lg'>
          <Link href={`/games/${game.id}`}>
            <Image 
              src={game.background_image} 
              alt={game.name} 
              fill={true}
              style={{objectFit: 'cover'}}
              className='w-full h-full group-hover:animate-zoom-slide' 
            />
          </Link>
    
            <div className='bg-black w-full  absolute  bottom-0  text-white p-2 place-content-evenly'>
            <Link href={`/games/${game.id}`} className='flex flex-row justify-between'>
                <h3 className='font-bold'>{game.name.slice(0, 55)}{game.name.length > 55 ? '...' : ''}</h3>
                <i className='text-xs block mt-1 opacity-50'>{game.path.slice(0, 40)}{game.path.length > 55 ? '...' : ''}</i>
            </Link>
                <div className='flex flex-row justify-between mt-2'>
                  <a href={`/api/download/${game.id}`}><DownloadIcon/></a>
                  
                  <p className='text-sm'>{new Date(game.released).toLocaleDateString('fr-FR')}</p>
                </div>
            </div>

            <div className='absolute top-2 right-2'>
              <EditGameForm game={game} />
            </div>
        </section>
      </Suspense>
    )
}