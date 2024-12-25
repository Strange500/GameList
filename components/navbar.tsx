import { auth } from '@/auth';
import { signIn, signOut } from '@/auth';
import Image from 'next/image';
import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitchBtn';

export const Navbar = async () => {
    const session = await auth();
    return (
        <div className="px-5 py-3 dark:bg-gray-950 bg-slate-100  border-b dark:border-gray-700 border-gray-300 p-4 shadow-md ">
            <nav className='flex justify-between items-center'>
                <div className='flex flex-row gap-10'>
                    <Link href={"/"}>
                        <Image src={'/logo.png'} alt="logo" height="100" width="130"/>
                    </Link>
                    <ThemeSwitcher />
                </div>
                
                
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