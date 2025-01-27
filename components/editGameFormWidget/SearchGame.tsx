"use client"
import { Input } from '../ui/input';
import { GameDetails } from '@/app/db/gameDetail';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import React from 'react';
import { Result, SearchResults } from '@/app/db/interfaces/apiInterfaces';
import dynamic from 'next/dynamic';
import { findGame } from '@/app/db/gameDB';
const SmallGameCard = dynamic(() => import('./SmallGameCard').then(mod => mod.SmallGameCard), { ssr: true });



export const SearchGame = ({ game }: { game: GameDetails }) => {

    const [searchGames, setSearchGames] = React.useState<string>("");
    const [gameGrid, setGameGrid] = React.useState<React.ReactNode>();
    const [debouncedQuery, setDebouncedQuery] = React.useState(searchGames);

    

    React.useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchGames);
        }, 1000);

        return () => {
            clearTimeout(handler);
        };
    }
    , [searchGames]);

    React.useEffect(() => {
        function genCardPrezList(games: SearchResults)  {
            if (games === undefined) {
                return <></>;
            }
            console.log(games);
            return (
                <>
        
                    {games.results.map((r: Result, index: number) => (
                        
                        <SmallGameCard key={index} name={r.name} released={r.released} path={game.path} id={r.id} background_image={r.background_image} />
                    ))}
                </>
            );
        }
        if (debouncedQuery) {
          // Call your research function here with the debouncedQuery
            const response = findGame(debouncedQuery);
            response.then((r: SearchResults) => {
                setGameGrid(genCardPrezList(r));
            });
        }
      }, [debouncedQuery, game.path]);


      
    
    return (
        
            <Card >
                
                    <CardHeader>
                        <CardTitle>Search the game</CardTitle>
                            <Input type="search" placeholder="Search the game" value={searchGames} onChange={(e) => setSearchGames(e.target.value)}/>
                    </CardHeader>
                        {gameGrid ? (
                            <CardContent className="grid grid-cols-1 sm:grid-cols-5 gap-2 w-full h-96 overflow-y-auto">
                                {gameGrid}
                            </CardContent>
                        ) : (
                            <div className="flex justify-center items-center h-96">
                                <p>Search a game</p>
                            </div>
                        )}
                        
            </Card>
                   
    )
}