import { auth } from '@/auth';
import { signIn, signOut } from '@/auth';
import Link from 'next/link';
import { ThemeSwitcher } from './ThemeSwitchBtn';
import ThemedLogo from './ThemedLogo';


export const Navbar = async () => {
    const session = await auth();
    return (
        <div className="fixed top-0 left-0 right-0 px-5 py-3 p-4 shadow-md z-50 bg-[hsl(var(--foreground))]">
            <nav className='flex justify-between items-center'>
            <div className='flex flex-row gap-10'>
                <Link href={"/"} >
                <ThemedLogo/>
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