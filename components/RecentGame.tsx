"use client";
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { GameDetails } from "@/app/db/interfaces/gameDetail";
import Image from "next/image";
import Link from "next/link";

export default function RecentGames({games}: {games: GameDetails[]}) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <section className="justify-center align-middle w-full">
        <Carousel
        plugins={[plugin.current]}
        className="w-3/5 mx-auto"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
        >
        <h1 className="text-2xl font-bold text-left mb-4">
            Recently added games
        </h1>

        <CarouselContent className="">
            {games.map((game) => (
            <CarouselItem key={game.id}>
                <Card className="h-96">
                    <Link href={`/games/${game.id}`}>
                    <CardContent className="p-0 group overflow-hidden h-96 shadow-lg bg-card relative rounded-lg flex ">
                        <div className="w-4/6 h-full z-0">
                            <Image src={game.background_image} alt={game.name} height={520} width={720} style={{objectFit: 'cover'}} className='w-full h-full' />
                        </div>
                        <div className="w-2/6 h-full bg-black bg-opacity-50 text-white p-2  flex-shrink-0">
                        <h3 className="text-lg font-bold">{game.name}</h3>
                        <p className="text-sm">{new Date(game.released).toLocaleDateString('fr-FR')}</p>
                        </div>
                        
                        
                    </CardContent>
                    </Link>
                </Card>
            </CarouselItem>
            ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        </Carousel>
    </section>
  )
}
