import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { EditGameForm } from "@/components/editGameForm";
import { Games } from "@/app/db/models/Games";
import { sequelize } from "@/app/db/Sequelize";
import ImageSelector from "@/components/editGameFormWidget/ImageSelector";



async function GamesPage({ params }: { params: Promise<{ id: string }> }) {
    try  {
        sequelize.sync();
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        return <div>Unable to connect to the database</div>;
    }
    let id: number;
    try {
        id = parseInt((await params).id, 10);
        if (isNaN(id)) throw new Error('Invalid ID');
    } catch (e) {
        console.error(e);
        return <div>Invalid game id</div>;
    }

    const game: Games | null = await Games.findOne({ where: { gameId : id } });

    if (!game) {
        return <div>Game not found</div>;
    }
    const images = await game.getAllRelatedImages();


    const { name, released, description, path } = game;

    return (
        <section className="overflow-x-hidden font-mono flex flex-col  ">
            <div className="absolute w-full h-full z-0">
                {/* <div className="absolute w-full h-full bg-gradient-to-t from-40% to-100%  dark:from-gray-950 from-gray-50" />
                <div className="absolute w-full h-full bg-gradient-to-tl from-0% to-30%  dark:from-gray-950 from-gray-50 " />
                <div className="absolute w-full h-full bg-gradient-to-l from-0% to-30%  dark:from-gray-950 from-gray-50 " />
                <div className="absolute w-full h-full bg-gray-50 dark:bg-gray-950 opacity-50" /> */}
                <Image src={game.background_image || ''} alt={name} layout="fill" objectFit="cover" />
            </div>

            <div className=" w-full flex flex-col p-5 pt-96 z-10 ">
                        <h1 className="text-7xl font-bold pt-10 font-sans">{name}</h1>
                        <h2 className="text-lg font-semibold">{new Date(released).toDateString()}</h2>
                        <h2 className="text-lg font-semibold">{path}</h2>
                        <Dialog>
                            <DialogTrigger suppressHydrationWarning>
                                <div className="bg-widget_background  p-4 rounded-md mt-4 w-2/6">
                                    <div className="text-sm text-left" dangerouslySetInnerHTML={{ __html: game.description.length > 100 ? `${game.description.substring(0, 250)}...` : game.description }}>
                                    </div>
                                </div>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Description</DialogTitle>
                                </DialogHeader>
                                <DialogDescription suppressHydrationWarning dangerouslySetInnerHTML={{ __html: description }} className="font-mono">
                                </DialogDescription>
                            </DialogContent>
                        </Dialog>
            </div>
            
            
            <div className="h-full w-full flex flex-col  p-5  pt-20 bg-gradient-to-t from-70% to-100% from-foreground z-10">

                <section className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-8">
                    <div className="flex flex-col justify-center items-center space-y-4">
                        
                        
                        <div className="flex flex-row space-x-4">
                            <a href={`/api/download/${id}`} className={buttonVariants()}>Download</a>
                            <EditGameForm game={game} />
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold">Images</h2>
                    <div className="flex flex-row flex-wrap justify-center items-center space-x-4">
                        <ImageSelector images={images} defaultChecked={images[0]} inputName="image" />
                    </div>
                </section>

                
            </div>
        </section>
    );
};

export default GamesPage;