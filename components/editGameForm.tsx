import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { EllipsisVertical } from 'lucide-react';
import { GameDetails } from '@/app/db/interfaces/gameDetail';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';



import React from 'react';
import { ModifTab } from './editGameFormWidget/ModifTab';
import { SearchGame } from './editGameFormWidget/SearchGame';
import { Games } from '@/app/db/models/Games';



export const EditGameForm = ({ game }: { game: Games }) => {

    return (
        <Dialog >
            <DialogTrigger >
                <div className='absolute w-12 h-12 bg-black opacity-25 rounded-tr-full rotate-180 -top-2 -right-2'></div>
                <EllipsisVertical className='text-white'/>
            </DialogTrigger>
            <DialogContent className="sm:max-w-screen-2xl sm:h-5/6 flex flex-col">
                <DialogHeader>
                    <DialogTitle>Edit {game.name}</DialogTitle>
                    <DialogDescription>
                        Change game associated or change info of the game
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue='info' >

                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="info">Info</TabsTrigger>
                        <TabsTrigger value="games">Games</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info">
                        <ModifTab game={game}/>
                    </TabsContent>
                    <TabsContent value="games">
                        <SearchGame game={game}/>
                    </TabsContent>
                    
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}