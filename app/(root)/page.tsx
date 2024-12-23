import { auth, signIn } from '@/auth';
import { displayGame, findGame } from '../db/gameDB';
import { Result } from '../db/apiInterfaces';

export default async function Page() {
  const games: { [key: string]: { name: string; description: string } } = {
    "game1": {
      "name": "Game 1",
      "description": "This is game 1"
    },
    "game2": {
      "name": "Game 2",
      "description": "This is game 2"
    }
  }
  displayGame(1);
  const session = await auth();
  const gamesList: Result[] = (await findGame("poppy playtime")).results;

  return (
  <section className="py-24">
    {session && session?.user ? (
      <>
        <h1 className="text-4xl text-center">Welcome, {session?.user.name}</h1>
        <div className="flex justify-center gap-5">
          {gamesList.map((game) => {
            console.log(game.id);
            return (
            <div key={game.id} className="w-1/3">
              <h2>{game.name}</h2>
              <p>{game.released}</p>
            </div>
          )
          })}
        </div>
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