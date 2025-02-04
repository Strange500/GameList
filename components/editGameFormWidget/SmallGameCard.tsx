import { Suspense } from "react";
// import { changeGameId } from "@/app/db/gameDB";
import GameCardSkeleton from "../GameCardSkeleton";
import Image from "next/image";

export const SmallGameCard = ({ name, released, path, id, background_image}: { name: string, released: string, path: string, id: number, background_image: string }) => {

    return (
    <Suspense fallback={<GameCardSkeleton />}>
        <a onClick={()=> {
            // changeGameId(path, id).then(() => {
            //     setTimeout(() => {
            //         window.location.reload();
            //     }
            //     , 1000);
            // }
            // );
        }}>
        <section key={id} className='group overflow-hidden h-80 shadow-lg bg-card relative rounded-lg hover:scale-105 hover:cursor-pointer'>
            

            <Image 
              src={background_image || 'https://placehold.co/600x400'} 
              alt={name} 
              fill={true}
              style={{objectFit: 'cover'}}
              className='w-full h-full' 
            />
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 bg-black text-white p-2 rounded-b-lg'>
                <p>{new Date(released).toLocaleDateString("fr-FR")}</p>
            </div>
    
            <div className='bg-black w-full  absolute  bottom-0  text-white p-2 place-content-evenly'>
                <h3 >{name.slice(0, 28)}{name.length > 28 ? '...' : ''}</h3>
                
            </div>

        </section>
        </a>
      </Suspense>);
};