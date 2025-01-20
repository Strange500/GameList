import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { changeGameId } from "@/app/db/gameDB";

export const SmallGameCard = ({ name, released, path, id }: { name: string, released: string, path: string, id: number }) => {

    return (
            <Card className='h-full'>
                <CardHeader>
                    <CardTitle>{name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <CardDescription>
                        {new Date(released).toLocaleDateString('fr-FR')}
                    </CardDescription>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => {
                        changeGameId(path, id).then(() => {
                            setTimeout(() => {
                                window.location.reload();
                            }
                            , 1000);
                        });
                    }}>Select</Button>
                </CardFooter>
            </Card>
    );
};