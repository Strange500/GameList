import Image from 'next/image';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { GameDetails } from '@/app/db/gameDetail';
import Link from 'next/link';
import { buttonVariants } from './ui/button';
import { DownloadIcon } from 'lucide-react';
import { EditGameForm } from './editGameForm';

export const GameCard = async ({ game, modifquery}: { game: GameDetails, modifquery: string }) => {
    return (
        <Card key={game.id}>
              <CardHeader>
                {game.background_image ? (
                    <Image src={game.background_image} alt={game.name} width={300} height={200} />
                ) : (
                    <Image src="https://placehold.co/600x400" alt={game.name} width={300} height={200} />
                )}
                
              </CardHeader>
              <CardContent>
                <CardTitle>{game.name} ({game.path})</CardTitle>
                <CardDescription dangerouslySetInnerHTML={{__html: game.description.length > 100 ? `${game.description.substring(0, 250)}...` : game.description}}>
                </CardDescription>
              </CardContent>
              <CardFooter>
                  <div className='flex flex-row gap-3'>
                
                  <Link className={buttonVariants({ variant: "outline" })} href={`/games/${game.id}`}>Details</Link>
                  
                  <a className={buttonVariants({ variant: "outline" })} href={`/api/download/${game.id}`}><DownloadIcon/></a>
                
                  <EditGameForm game={game} modifquery={modifquery} />
                
                </div>
              </CardFooter>
        </Card>
    )
}