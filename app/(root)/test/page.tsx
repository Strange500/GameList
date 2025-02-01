import { Games, Screenshots } from "@/app/db/models/Games";
import sequelize from "@/app/db/dao"; 
import path from "path";
import { detectGames, getScreenshots, saveGame, saveScreenshots } from "@/app/db/gameDB";


const Test = async () => {
    sequelize.sync();
    await detectGames();
    const game = await Games.findOne({
        where: {
            gameId: 494384
        }
    });

    if (!game) {
        return <div>Game not found</div>;
    }

    const srs = await getScreenshots(494384);
    console.log(srs);
    saveScreenshots(game.gameId, srs);

    const screenshots = await Screenshots.findAll({
        where: {
            gameId: 494384
        }
    });

    

    return (
        <div>
            <pre>{JSON.stringify(game, null, 2)}</pre>

            <div>
                {screenshots.map((screenshot, index) => (
                    <img key={index} src={screenshot.image} alt="" />
                ))}

                </div>
        </div>
    )
}

export default Test;
