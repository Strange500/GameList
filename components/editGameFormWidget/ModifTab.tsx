import { GameDetails } from '@/app/db/gameDetail';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';

import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
export const ModifTab = ({ game }: { game: GameDetails }) => {
    return (<Card>
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
        </Card>);
    
}