import { GameDetails } from "@/app/db/interfaces/gameDetail";
import { GameCard } from "./GameCard";


export default function SearchGrid({ games, query }: { games: GameDetails[], query: string  }) {
    return (
        <div className="px-5 py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {games && games.length > 0 ? (games.map((game, index) => (
                query ? (
                    (game.name.toLowerCase().includes(query.toLowerCase()) ||
                    game.name_original.toLowerCase().includes(query.toLowerCase()) ||
                    game.path.toLowerCase().includes(query.toLowerCase()) 
                    )
                     ? (
                        <GameCard key={index} game={game}  />
                    ) : null
                ) : (
                    <GameCard key={index} game={game} />
                )
            ))): (
                <div className="text-center">No games</div>
            )}
          </div>
    )};