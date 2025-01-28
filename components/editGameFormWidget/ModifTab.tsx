"use client";
import { GameDetails } from '@/app/db/interfaces/gameDetail';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import React from 'react';
import { modifyGame } from '@/app/db/gameDB';

export const ModifTab = ({ game }: { game: GameDetails }) => {


    return (<Card >
                <CardHeader>
                    <CardTitle>Game Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 ">
                    
                        <div className="space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" defaultValue={game.name}  />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="name_original">Original Name</Label>
                            <Input id="name_original" defaultValue={game.name_original} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="description">Description</Label>
                            <Textarea placeholder="Type your message here." id="description" defaultValue={game.description} className="w-full h-32" />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="released">Released</Label>
                            <Input id="released" type="date" defaultValue={new Date(game.released).toISOString().split('T')[0]} />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="background_image">Background Image</Label>
                            <Input id="background_image" defaultValue={game.background_image} />
                        </div>
                </CardContent>
                
                <CardFooter>
                    <Button onClick={()=> {
                        game.name = (document.getElementById("name") as HTMLInputElement)?.value || "";
                        game.name_original = (document.getElementById("name_original") as HTMLInputElement)?.value || "";
                        game.description = (document.getElementById("description") as HTMLInputElement)?.value || "";
                        game.released = new Date((document.getElementById("released") as HTMLInputElement)?.value || "");
                        game.background_image = (document.getElementById("background_image") as HTMLInputElement)?.value || "";

                        modifyGame(game).then(() => {
                            setTimeout(() => {
                                window.location.reload();
                            }
                            , 1000);
                        }
                        );
                    }}>Save info</Button>
                </CardFooter>
            </Card>);
    
}