import { auth, signIn } from '@/auth';
import SearchGrid from '@/components/SearchGrid';
import SearchBar from '@/components/SearchBar';
import { Games } from '../db/models/Games';
import { sequelize } from '../db/Sequelize';

export const experimental_ppr = true;


export default async function Page({searchParams}: {
  searchParams: Promise<{ query?: string}>
}) {
  try {
    sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return new Response(JSON.stringify({ error: 'Unable to connect to the database' }), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 500,
    });
  }
  const session = await auth();
  const gamesList: Games[] = await Games.findAll();
  // get query form parameter
  const query: string = (await searchParams).query || '';

  return (
    <section className="py-24 bg-background">
      {session && session?.user ? (
        <>
          {/* <RecentGames games={gamesList}/> */}
          <SearchBar/>
          <SearchGrid games={gamesList} query={query} />
        </>) : (
        <div className="w-screen h-screen flex justify-center align-middle">
          <form action={async () => {
            "use server";
            await signIn('github')
          }}>
            <button type="submit" className="bg-foreground hover:bg-background text-white font-bold py-2 px-4 rounded">Sign In to view content</button>
          </form>
        </div>
        )}
    </section>
    )
}