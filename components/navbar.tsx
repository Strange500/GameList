import { auth } from '@/auth';
import { signIn, signOut } from '@/auth';
import Image from 'next/image';

export const Navbar = async () => {
    const session = await auth();
    return (
        <div className="px-5 py-3 bg-black shadow-sm text-white">
            <nav className='flex justify-between items-center'>
                <Image src={'/logo.png'} alt="logo" height="100" width="130"/>
                <div className='flex justify-between items-center gap-5'>
                    {session && session?.user ? (
                        <>
                        
                            <form action={async () => {
                                "use server";
                                await signOut({redirectTo: '/'})
                            }}>
                                <button type="submit">Sign Out</button>
                            </form>

                            <span>{session?.user.name}</span>

                        </>
                        
                    ):(
                        <form action={async () => {
                            "use server";
                            await signIn('github')
                        }}>
                            <button type="submit">Sign In</button>
                        </form>
                        
                    )
                    }
                </div>
            </nav>
        </div>
    )
}