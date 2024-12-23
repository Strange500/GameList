import { auth, signIn } from '@/auth';
import { detectGames, getAllGames } from '../db/gameDB';
import { GameDetails } from '../db/gameDetail';
import SearchGrid from '@/components/SearchGrid';
import SearchBar from '@/components/SearchBar';

export default async function Page({searchParams}: {
  searchParams: Promise<{ query?: string}>
}) {

  const session = await auth();
  const gamesList: GameDetails[] = getAllGames();
  // get query form parameter
  const query: string = (await searchParams).query || '';

  return (
    <section className="py-24">
      {session && session?.user ? (
        <>
          <SearchBar/>
          <SearchGrid games={gamesList} query={query}/>
        </>) : (
        <div className="w-screen h-screen flex justify-center align-middle">
          <form action={async () => {
            "use server";
            await signIn('github')
          }}>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Sign In to view content</button>
          </form>
        </div>
        )}
    </section>
    )
}