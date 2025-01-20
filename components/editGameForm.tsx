"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { EllipsisVertical } from 'lucide-react';
import { GameDetails } from '@/app/db/gameDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';



import React from 'react';
import { Result, SearchResults } from '@/app/db/apiInterfaces';
import dynamic from 'next/dynamic';
const SmallGameCard = dynamic(() => import('./SmallGameCard').then(mod => mod.SmallGameCard), { ssr: true });



export const EditGameForm = ({ game }: { game: GameDetails }) => {

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
                        
                        <SmallGameCard key={index} name={r.name} released={r.released} path={game.path} id={r.id} />
                    ))}
                </>
            );
        }
        if (debouncedQuery) {
          // Call your research function here with the debouncedQuery
            const response = fetch(`/api/search/${debouncedQuery}`);
            response.then((r) => r.json()).then((r: SearchResults) => {
                setGameGrid(genCardPrezList(r));
            });
        }
      }, [debouncedQuery, game.path]);


      
    
    return (
        <Dialog>
            <DialogTrigger >
                <div className='absolute w-12 h-12 bg-black opacity-25 rounded-tr-full rotate-180 -top-2 -right-2'></div>
                <EllipsisVertical className='text-white'/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit {game.name}</DialogTitle>
                    <DialogDescription>
                        Change game associated or change info of the game
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue='info'>

                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="info">Info</TabsTrigger>
                        <TabsTrigger value="games">Games</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">
                        <Card>
                        <CardHeader>
                            <CardTitle>Game Info</CardTitle>
                            <CardDescription>
                            Change game info here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue={game.name} />
                            </div>
                            <div className="space-y-1">
                            <Label htmlFor="description">Description</Label>
                            <Textarea placeholder="Type your message here." id="description" defaultValue={game.description} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button>Save info</Button>
                        </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="games">
                        <Card>
                            
                                <CardHeader>
                                    <CardTitle>Search the game</CardTitle>
                                        <Input type="search" placeholder="Search the game" value={searchGames} onChange={(e) => setSearchGames(e.target.value)}/>
                                </CardHeader>
                                
                                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-h-64 overflow-y-auto">
                                            {gameGrid}
                                    </CardContent>
                                    
                                
                            
                        </Card>
                    </TabsContent>
                    
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}