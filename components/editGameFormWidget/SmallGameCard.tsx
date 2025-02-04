import { Suspense } from "react";
// import { changeGameId } from "@/app/db/gameDB";
import GameCardSkeleton from "../GameCardSkeleton";
import Image from "next/image";
import Form from "next/form";
import { Input } from "../ui/input";
import { changeId } from "@/app/db/Utils";

export const SmallGameCard = ({ name, released, path, id, background_image}: { name: string, released: string, path: string, id: number, background_image: string }) => {
    
    return (
    <Suspense fallback={<GameCardSkeleton />}>
        <Form action={changeId}>
            <Input type="hidden" name="path" value={path} />
            <Input type="hidden" name="id" value={id} />
        
                <section key={id} className='group overflow-hidden h-80 shadow-lg bg-card relative rounded-lg hover:scale-105 hover:cursor-pointer'>
                    

                    <Image 
                    src={background_image || 'https://placehold.co/600x400'} 
                    alt={name} 
                    fill={true}
                    style={{objectFit: 'cover'}}
                    className='w-full h-full z-0' 
                    />

                    <div className='absolute inset-0 items-center justify-center hidden group-hover:flex transition duration-300 ease-in-out backdrop-blur-md z-10'>
                        <Input type="submit" value="Remplacer" className='text-white bg-black p-2 rounded-lg w-1/3'/>
                    </div>

                    <div className='absolute top-0 left-1/2 transform -translate-x-1/2 bg-black text-white p-2 rounded-b-lg z-20'>
                        <p>{new Date(released).toLocaleDateString("fr-FR")}</p>
                    </div>
            
                    <div className='bg-black w-full  absolute  bottom-0  text-white p-2 place-content-evenly z-20'>
                        <h3 >{name.slice(0, 28)}{name.length > 28 ? '...' : ''}</h3>
                        
                    </div>

                    {// div only visible when hooverring the card with choose button inside to submit the form
                    }

                    

                </section>
        </Form>
      </Suspense>);
};