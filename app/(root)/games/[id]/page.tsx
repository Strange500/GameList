import { getGame } from "@/app/db/gameDB";
import { GameDetails } from "@/app/db/gameDetail";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { EditGameForm } from "@/components/editGameForm";



async function GamesPage({ params, searchParams }: {params :{ id: string }, searchParams: { modifquery?: string }})  {
    let id: number;
    try {
        id = parseInt(params.id, 10);
        if (isNaN(id)) throw new Error('Invalid ID');
    } catch (e) {
        console.error(e);
        return <div>Invalid game id</div>;
    }

    const game: GameDetails | undefined = await getGame(id);

    if (!game) {
        return <div>Game not found</div>;
    }


    const { name, released, background_image, description, path } = game;
    const modifquery = (await searchParams).modifquery || '';

    return (
        <>
            <div className="absolute max-w-max -z-50 float-right overflow-hidden h-3/5">
                <div className="absolute w-full h-full bg-gradient-to-t from-40% to-100%  dark:from-gray-950 from-gray-50" />
                <div className="absolute w-full h-full bg-gradient-to-tl from-0% to-30%  dark:from-gray-950 from-gray-50 " />
                <div className="absolute w-full h-full bg-gradient-to-l from-0% to-30%  dark:from-gray-950 from-gray-50 " />
                <div className="absolute w-full h-full bg-gray-50 dark:bg-gray-950 opacity-50" />
                <Image src={background_image} alt={name} width={1920} height={1080} className="h-full w-full object-cover " />
            </div>
            
            <div className="h-full w-full flex flex-col space-y-8 p-4 pt-14">
                <section className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-8">
                    <div className="flex flex-col justify-center items-center space-y-4">
                        <h1 className="text-4xl font-bold pt-10">{name}</h1>
                        <h2 className="text-lg font-semibold">{new Date(released).toDateString()}</h2>
                        <h2 className="text-lg font-semibold pb-20">({path})</h2>
                        <Dialog>
                            <DialogTrigger suppressHydrationWarning>
                                <div className="text-sm" dangerouslySetInnerHTML={{ __html: game.description.length > 100 ? `${game.description.substring(0, 250)}...` : game.description }}></div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Description</DialogTitle>
                                </DialogHeader>
                                <DialogDescription suppressHydrationWarning>
                                    <p dangerouslySetInnerHTML={{ __html: description }}></p>
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
                        <div className="flex flex-row space-x-4">
                            <Link href={`/api/download/${id}`} className={buttonVariants()}>Download</Link>
                            <EditGameForm game={game} modifquery={modifquery} />
                        </div>
                    </div>
                </section>

                
            </div>
        </>
    );
};

export default GamesPage;