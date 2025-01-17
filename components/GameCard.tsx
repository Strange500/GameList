import Image from 'next/image';

import { GameDetails } from '@/app/db/gameDetail';
import Link from 'next/link';
import { Button} from './ui/button';
import { DownloadIcon } from 'lucide-react';
import { EditGameForm } from './editGameForm';

export const GameCard = async ({ game, modifquery}: { game: GameDetails, modifquery: string }) => {
    return (
        <section key={game.id} className='overflow-hidden h-80 shadow-lg bg-card relative'>
          <Link href={`/games/${game.id}`}>
            <Image 
              src={game.background_image} 
              alt={game.name} 
              layout="fill" 
              objectFit="cover" 
              className='w-full h-full' 
            />
          </Link>
    
            <div className='bg-black w-full  absolute bottom-0  text-white p-2 place-content-evenly'>
            <Link href={`/games/${game.id}`}><h3 className='font-bold'>{game.name} </h3></Link>
                <div className='flex flex-row justify-between mt-2'>
                    <Button variant="outline" asChild>
                      <a href={`/api/download/${game.id}`}><DownloadIcon/></a>
                    </Button>
                  
                  <p>{new Date(game.released).toLocaleDateString('fr-FR')}</p>
                </div>
            </div>

            <div className='absolute top-2 right-2'>
              <EditGameForm game={game} modifquery={modifquery} />
            </div>
        </section>
    )
}