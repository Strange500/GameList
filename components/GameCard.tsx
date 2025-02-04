import Image from 'next/image';

import { GameDetails } from '@/app/db/interfaces/gameDetail';
import Link from 'next/link';
import { DownloadIcon } from 'lucide-react';
import { EditGameForm } from './editGameForm';
import { Suspense } from 'react';
import GameCardSkeleton from './GameCardSkeleton';
import { Games } from '@/app/db/models/Games';
import { sequelize } from '@/app/db/Sequelize';
// import { getGameBackgroundURI } from '@/app/db/gameDB';

export const GameCard = async ({ game}: { game: Games}) => {
    return (
      <Suspense fallback={<GameCardSkeleton />}>
        <section key={game.gameId} className='group overflow-hidden h-80 shadow-lg bg-card relative hover:scale-105 ease-in duration-150 rounded-lg border border-black-200'>
          <Link href={`/games/${game.gameId}`}>
            <Image 
              src={game.background_image}
              alt={game.name} 
              fill={true}
              style={{objectFit: 'cover'}}
              className='w-full h-full group-hover:animate-zoom-slide' 
            />
          </Link>
    
            <div className='bg-black w-full  absolute  bottom-0  text-white p-2 place-content-evenly'>
              <Link href={`/games/${game.gameId}`} className='flex flex-row justify-between'>
                  <h3 className='font-bold'>{game.name.slice(0, 55)}{game.name.length > 55 ? '...' : ''}</h3>
                  <p className='text-sm'>{new Date(game.released).toLocaleDateString('fr-FR')}</p>
                  
              </Link>
                
                  <div className='flex flex-row justify-between mt-2 '>
                    
                    <i className='text-xs mt-1 opacity-50 hidden group-hover:block'>{game.path?.slice(0, 40)}{game.path?.length > 55 ? '...' : ''}</i>
                    <a href={`/api/download/${game.gameId}`} className='hidden group-hover:block'><DownloadIcon/></a>
                    
                  </div>
            </div>

            <div className='absolute top-2 right-2 '>
              <EditGameForm game={game} />
            </div>
        </section>
      </Suspense>
    )
}