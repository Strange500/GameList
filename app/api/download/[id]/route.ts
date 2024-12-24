import { getAllGames } from "@/app/db/gameDB";
import { GameDetails } from "@/app/db/gameDetail";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {

    let id: number;
    try {
        id = parseInt((await params).id); // 'a', 'b', or 'c'
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid ID' }), {
            headers: {
              'content-type': 'application/json',
            },
            status: 400,
          })
    }
    
    // send json of the game

    const gamesList: GameDetails[] = getAllGames();

    const game: GameDetails | undefined = gamesList.find(game => game.id === id);

    if (game) {
      return new Response(JSON.stringify({ path: game?.path }), {
        headers: {
          'content-type': 'application/json',
        },
      })
    } else {
      return new Response(JSON.stringify({ error: 'Game not found' }), {
        headers: {
          'content-type': 'application/json',
        },
        status: 404,
      })
    }
  }