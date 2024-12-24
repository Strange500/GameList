import { GameDetails } from "@/app/db/gameDetail";
import { GameCard } from "./GameCard";


export default function SearchGrid({ games, query, modifquery }: { games: GameDetails[], query: string, modifquery: string  }) {
    return (
        <div className="px-5 py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {games && games.length > 0 ? (games.map((game, index) => (
                query ? (
                    game.name.toLowerCase().includes(query.toLowerCase()) ? (
                        <GameCard key={index} game={game} modifquery={modifquery} />
                    ) : null
                ) : (
                    <GameCard key={index} game={game} modifquery={modifquery} />
                )
            ))): (
                <div className="text-center">No games</div>
            )}
          </div>
    )};