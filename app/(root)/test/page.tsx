import { RAWGIOAPI} from "@/app/db/gameDB";
import { Games } from "@/app/db/models/Games";
import { sequelize } from "@/app/db/Sequelize";


const Test = async () => {
    sequelize.sync();
    const game = await RAWGIOAPI.getGameDetails(3498);

    // await game.save();


    

    return (
        <div>
            <pre>{JSON.stringify(game, null, 2)}</pre>
        </div>
    )
}

export default Test;
