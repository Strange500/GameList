import { getGame } from "@/app/db/gameDB";
import { GameDetails } from "@/app/db/gameDetail";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel"

interface GamesPageProps {
    params: { id: string };
}

async function GamesPage({ params }: GamesPageProps)  {
    let id: number;
    try {
        id = parseInt((await params).id, 10);
        if (isNaN(id)) throw new Error('Invalid ID');
    } catch (e) {
        console.error(e);
        return <div>Invalid game id</div>;
    }

    const game: GameDetails | undefined = await getGame(id);

    if (!game) {
        return <div>Game not found</div>;
    }


    const { name, name_original, released, background_image, description } = game;

    return (
        <div className="h-full w-full flex flex-col space-y-8 p-4">

            <section className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex justify-center">
                <Image src={background_image} alt={name} width={400} height={800} className="rounded-lg shadow-lg" />
            </div>
            <div className="flex flex-col justify-center items-start space-y-4">
                <h1 className="text-3xl font-bold">{name}</h1>
                <h2 className="text-lg font-semibold">{name_original} {released.to}</h2>
                <p className="text-sm" dangerouslySetInnerHTML={{__html: description}}></p>
                <Link href={`/api/download/${id}`} className={buttonVariants()}>Download</Link>
            </div>
            </section>

            <section className="flex flex-col md:flex-row w-full space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Specification</h2>
                <p className="text-sm leading-relaxed">Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, accusamus dignissimos architecto delectus nulla repudiandae minus? Eligendi incidunt eveniet nulla iste, quas assumenda eius doloremque possimus, provident placeat commodi optio obcaecati fugit quam. Vitae eum ipsum debitis iusto omnis expedita corporis nemo ipsa ratione ducimus laboriosam, eaque eos officiis odio soluta est culpa sequi reprehenderit rerum nihil vero labore ut recusandae? Esse distinctio eveniet doloribus, repellat maiores illo ut tenetur rem dolor accusantium iure debitis natus? Facilis ratione voluptatum ipsum nesciunt vel explicabo corporis vero sed consequatur quod! Quisquam officiis vero nemo nihil repellendus quibusdam corporis! Dolore, consectetur odio ut labore quos similique nisi et nam deserunt, at iure sapiente blanditiis in animi quas aperiam accusamus soluta porro unde magnam. Consequatur et accusamus quia molestiae rerum dignissimos praesentium quas facere voluptatem incidunt soluta pariatur cum assumenda, quasi repudiandae eius possimus at quos! Veniam, qui, voluptas ipsum deleniti vitae fugit temporibus esse aut ad earum laborum quisquam numquam dolore incidunt dicta suscipit! Adipisci unde optio fugiat debitis. Repellendus numquam dolores modi sequi autem quidem vitae sint velit id, laboriosam perspiciatis eius dicta nulla. Unde veniam, ipsam optio inventore odio quasi animi in fuga iure delectus ut consectetur? Eaque reiciendis unde at porro nostrum expedita adipisci, provident laudantium exercitationem quod cumque nesciunt nihil commodi ducimus voluptatum quae nulla non totam, dolorum quasi in ad modi placeat! Cum numquam quidem vitae ad vel quae placeat? Delectus dolor, magnam accusamus quod autem temporibus magni soluta minima, sapiente mollitia explicabo consequatur? Expedita, quod ducimus sequi iure quis itaque nihil atque consectetur doloribus optio veniam harum quam possimus dolores eius similique culpa a tempora numquam, quo rerum omnis nisi eos. Ullam reiciendis provident explicabo non illo minima soluta amet impedit, suscipit rem tempore a quos ducimus sunt, aperiam neque ipsam dolorum odio animi. Voluptatibus, deleniti nesciunt.</p>
            </div>

            <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Gallery</h2>
                <Carousel className="w-full max-w-xs">
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index}>
                    <div className="p-1">
                    bonjour
                    </div>
                    </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                </Carousel>
            </div>
            </section>

        </div>
    );
};

export default GamesPage;