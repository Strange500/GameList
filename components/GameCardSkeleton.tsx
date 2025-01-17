import { Skeleton } from './ui/skeleton';



    
const GameCardSkeleton = () => {
        return (
            <section className='overflow-hidden h-80 shadow-lg bg-card relative rounded-lg'>
                <Skeleton className='w-full h-full' />

                <div className='bg-black w-full absolute bottom-0 text-white p-2 place-content-evenly'>
                    <div className='flex flex-row justify-between'>
                        <Skeleton className='w-60 h-6' />
                        <Skeleton className='w-28 h-4 mt-1 opacity-50' />
                    </div>
                    <div className='flex flex-row justify-between mt-2'>
                        <Skeleton className='w-6 h-6' />
                        <Skeleton className='w-1/4 h-4' />
                    </div>
                </div>

                <div className='absolute top-2 right-2'>
                    <Skeleton className='w-8 h-8' />
                </div>
            </section>
        );
        }
    
    export default GameCardSkeleton;
    
