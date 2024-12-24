import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import Form from 'next/form';
import { Button, buttonVariants } from './ui/button';
import { Edit } from 'lucide-react';
import { GameDetails } from '@/app/db/gameDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { changeGameId, findGame } from '@/app/db/gameDB';
import { Result } from '@/app/db/apiInterfaces';



export const EditGameForm = async ({ game, modifquery }: { game: GameDetails, modifquery: string }) => {
    const searchGames: Result[]  = (await findGame(modifquery)).results;
    
    return (
        <Dialog>
            <DialogTrigger className={buttonVariants({ variant: "outline" })} >
                <Edit/>
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
                            <Input type="text" id="description" defaultValue={game.description} />
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
                                    <Form action={"/"}>
                                        <Input id="modifquery" name="modifquery" type="search" placeholder="Search the game"/>
                                    </Form>
                                </CardHeader>
                                
                                    <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-h-64 overflow-y-auto">
                                        {modifquery && modifquery.length > 0 ? (
                                            
                                            searchGames.map((r, index) => (
                                                <Form key={index} action={async () => {
                                                    "use server";
                                                    changeGameId(game.path, r.id);
                                                }}>
                                                    <Card className='h-full'>
                                                        <CardHeader>
                                                            <CardTitle>{r.name}</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <CardDescription>
                                                                {r.released}
                                                            </CardDescription>
                                                        </CardContent>
                                                        <CardFooter>
                                                            <Button>Select</Button>
                                                        </CardFooter>
                                                    </Card>
                                                </Form>
                                            ))
                                            
                                        ) : (
                                            <div>Search for a game</div>
                                        )}
                                    </CardContent>
                                    
                                
                            
                        </Card>
                    </TabsContent>
                    
                </Tabs>
                {/* <DialogFooter>
                    <Button type="submit">Save changes</Button>
                </DialogFooter> */}
            </DialogContent>
        </Dialog>
    )
}