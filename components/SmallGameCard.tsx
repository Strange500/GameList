import Form from "next/form";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

export const SmallGameCard =  ({ name, released, path, id }: { name: string, released: string, path: string, id: number }) => {
    const handleSubmit =  () => {
        fetch(`/api/game/${encodeURIComponent(path)}/set/${id}`).then(() => {
            window.location.reload();
        }
        );
    };

    return (
        <Form action={handleSubmit}>
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
                    <Button>Select</Button>
                </CardFooter>
            </Card>
        </Form>
    );
};