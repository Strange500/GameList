import { GameDetails } from '@/app/db/interfaces/gameDetail';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import React from 'react';
// import { getAllGameImages, getGame } from '@/app/db/gameDB';
import Form from 'next/form';
import { revalidatePath } from 'next/cache';
import ImageSelector from './ImageSelector';
import { Games } from '@/app/db/models/Games';

export const ModifTab = async ({ game }: { game: Games }) => {

    const saveInfo = async (formData: FormData) =>  {
        "use server";
        const game = await getGame(parseInt(formData.get('id') as string));
        if (!game) {
            alert('The game you are trying to modify does not exist');
            return;
        }
        const gameData = {
            name: formData.get('name') as string,
            name_original: formData.get('name_original') as string,
            description: formData.get('description') as string,
            released: new Date(formData.get('released') as string),
            background_image: formData.get('background_image') as string
        }
        game.name = gameData.name;
        game.name_original = gameData.name_original;
        game.description = gameData.description;
        game.released = gameData.released;
        game.background_image = gameData.background_image;
        //await modifyGame(game);
        revalidatePath('/');

    }

    // const images: string[] = Array.from(new Set((await getAllGameImages(game.gameId)).filter(image => image !== '')));
    


    return (<Card >
                <CardHeader>
                    <CardTitle>Game Info</CardTitle>
                </CardHeader>
                <Form action={saveInfo}>
                    <CardContent className="space-y-2 overflow-y-auto h-96 w-full">
                            <input type="hidden" name="id" value={game.id} />


                        
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" defaultValue={game.name} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="name_original">Original Name</Label>
                                <Input id="name_original" name="name_original" defaultValue={game.name_original} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="description">Description</Label>
                                <Textarea placeholder="Type your message here." id="description" name="description" defaultValue={game.description} className="w-full h-32" />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="released">Released</Label>
                                <Input id="released" type="date" name="released" defaultValue={new Date(game.released).toISOString().split('T')[0]} />
                            </div>
                            <div className="space-y-1 ">
                                <Label htmlFor="background_image">Background Image</Label>
                                <div className="border-2 border-gray-900 rounded-md p-2">
                                    {/* <ImageSelector images={images} defaultChecked={game.background_image} inputName="background_image" /> */}
                                </div>
                            </div>
                    </CardContent>
                    
                    <CardFooter>
                        <Button type='submit'>Save info</Button>
                    </CardFooter>
                </Form>
            </Card>);
    
}