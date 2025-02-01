'use server';
import fs from 'fs';
import { SearchResults } from './interfaces/apiInterfaces';
import { GameDetails } from './interfaces/gameDetail';
import { join } from 'path';
import stream from 'stream';
import { ScreenShotResults } from './interfaces/screenShotsResults';
import { ReadableStream as WebReadableStream } from 'stream/web';
import { DATA_PATH, db, DB_PATH, GAME_FOLDER_PATH } from './const';
import { Model } from 'sequelize';
import { Games, Screenshots } from './models/Games';
import sequelize from './dao';
import { Game } from './DTO/entities';







if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH);
}

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '');
}

if (!fs.existsSync(GAME_FOLDER_PATH)) {
    fs.mkdirSync(GAME_FOLDER_PATH);
}






// export async function getGamePlatforms(gameId: number) {
//     const query = `SELECT released_at, requirements_minimum, requirements_recommended, slug, name  FROM game_platforms g JOIN platforms p ON g.platform_id = p.id WHERE game_id = ?;`;
//     return new Promise((resolve, reject) => {
//         db.all(query, [gameId], (err, rows) => {
//             if (err) {
//                 console.error('Error querying game platforms:', err);
//                 reject(err);
//                 return;
//             }
//             resolve(rows);
//         });
//     });
// }

export async function saveGame(game: GameDetails) {
    
    const screenshots = await getScreenshots(game.id);
    saveBackgroundImage(game.background_image, game.id);
    game.background_image = `/games/${game.id}/images/background.jpg`;
    

    const g = await Games.build({
        path: game.path,
        date_added: game.date_added,
        gameId: game.id,
        slug: game.slug,
        name: game.name,
        name_original: game.name_original,
        description: game.description,
        metacritic: game.metacritic,
        released: game.released,
        tba: game.tba,
        updated: game.updated,
        background_image: game.background_image,
        background_image_additional: game.background_image_additional,
        website: game.website,
        rating: game.rating,
        rating_top: game.rating_top,
        added: game.added,
        playtime: game.playtime,
        screenshots_count: game.screenshots_count,
        movies_count: game.movies_count,
        creators_count: game.creators_count,
        achievements_count: game.achievements_count,
        parent_achievements_count: game.parent_achievements_count,
        reddit_url: game.reddit_url,
        reddit_name: game.reddit_name,
        reddit_description: game.reddit_description,
        reddit_logo: game.reddit_logo,
        reddit_count: game.reddit_count,
        twitch_count: game.twitch_count,
        youtube_count: game.youtube_count,
        reviews_text_count: game.reviews_text_count,
        ratings_count: game.ratings_count,
        suggestions_count: game.suggestions_count,
        alternative_names: game.alternative_names,
        metacritic_url: game.metacritic_url,
        parents_count: game.parents_count,
        additions_count: game.additions_count,
        game_series_count: game.game_series_count,
    }).save();

    saveScreenshots(g.gameId, screenshots);
    return;



    

}


export async function getAllGames(): Promise<Model[]> {
    sequelize.sync();
    return await Games.findAll();
}

export async function changeGameId(path: string, newId: number) {
    await Games.update({ id: newId }, { where: { path: path } });
    console.log(`Game with path ${path} deleted`);
    await saveGameWithId(newId, path);
}

export async function getGame(id: number): Promise<Games | null> {
    if (!id) {
        return null;
    }
    return await Games.findOne({ where: { gameId: id } });
    
}

export async function findGame(title: string): Promise<SearchResults> {
    const path= '/games';
    const params = { search: title };
    const response = await fetchRawgApi(path, params);
    const games: SearchResults = (response as SearchResults);
    return games;
}

export async function getGameDetails(id: number): Promise<GameDetails> {
    const path= "/games/" + id.toString();
    const params = { };
    const response = await fetchRawgApi(path, params);
    return (response as GameDetails);
}

export async function saveGameWithId(id: number, path: string) {
    const game = await getGameDetails(id);
    game.path = path;
    return saveGame(game);
}

export async function deleteGame(path: string) {
    const game = await Games.findOne({ where: { path: path } });
    if (!game) {
        return 0;
    }
    const gameId = game.gameId;
    const gameFolder = await getGameFolder(gameId);
    fs.rm(gameFolder, { recursive: true }, (err) => {
        if (err) {
            console.error('Error deleting game folder:', err);
        }
    }
    );
    return await Games.destroy({ where: { path: path } });
}

async function gameWithPathExists(path: string): Promise<boolean> {
    const result = await Games.findOne({ where: { path: path } });
    return result !== null;
}



async function saveWebFile(savePath: string, url: string) {
    const writeStream = fs.createWriteStream(savePath);
    const readStream = await fetch(url);
    const nodeStream = stream.Readable.fromWeb(readStream.body as WebReadableStream<unknown>);
    stream.pipeline(nodeStream, writeStream, (err) => {
        if (err) {
            console.error('Pipeline failed:', err);
        } else {
        }
    });
}

async function getGameFolder(gameId:number) {
    const result =  join(GAME_FOLDER_PATH, gameId.toString());
    if (!fs.existsSync(result)) {
        fs.mkdirSync(result, { recursive: true });
    }
    return result;
}

async function getGameImagesFolder(gameId:number) {
    const result=  join(await getGameFolder(gameId), "images");
    if (!fs.existsSync(result)) {
        fs.mkdirSync(result, { recursive: true });
    }
    return result;
}

export async function getGameScreenshots(gameId: number): Promise<string[]> {
    const screenshots = await Screenshots.findAll({ where: { gameId: gameId } });
    return screenshots.map((screenshot) => `/games/${gameId}/images/${screenshot.path}`);
}

export async function getAllGameImages(gameId: number): Promise<string[]> {
    const gameScreenshot = await getGameScreenshots(gameId);
    const gameBackground = await getGameBackgroundURI(gameId);
    gameScreenshot.push(`/games/${gameId}/images/background.jpg`);
    return [gameBackground, ...gameScreenshot];
}

export async function getGameBackgroundURI(gameId: number): Promise<string | null> {
    console.log("gameId", gameId);
    const game = await getGame(gameId);
    if (!game) {
        return null;
    }
    return game.background_image;
}

export async function saveScreenshots(gPath: string, screenshots: string[]) {
    for (const url of screenshots) {
        const saveDir = await getGameImagesFolder(gameId);


        const fileName = url.split('/').pop();
        const savePath = join(saveDir, fileName || '');
        await saveWebFile(savePath, url);

        await Screenshots.build({
            gamePath: gPath,
            path: saveDir
        }).save();
    }

    return;
    }

async function saveBackgroundImage(url: string, gameId: number) : Promise<string> {
    const saveDir = await getGameImagesFolder(gameId);
    const fileName = "background.jpg";
    const savePath = join(saveDir, fileName || '');
    await saveWebFile(savePath, url);
    return savePath;
}

export async function getScreenshots(id: number): Promise<string[]> {
    const response = await fetchRawgApi(`/games/${id}/screenshots`, {"page_size": "10"});
    const screenshots = (response as ScreenShotResults).results.map((result) => result.image);
    return screenshots;
}

async function fetchRawgApi(path: string, params: Record<string, string>) {
    const rawgApiKey = process.env.RAWG_API_KEY;
    if (!rawgApiKey) {
        throw new Error('RAWG_API_KEY not found');
    }
    const url = `https://api.rawg.io/api${path}`;
    const response = await fetchData(url, { key: rawgApiKey, ...params });
    return response;
}


async function fetchData(apiUrl: string, params: Record<string, string>): Promise<unknown> {
    // Build a query string from the parameters
    const queryString = new URLSearchParams(params).toString();
    const url = `${apiUrl}?${queryString}`;

    try {
        const response = await fetch(url);

        // Check if the response is OK (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Rethrow the error if needed
    }
}

export async  function detectGames() {
    const gameFolder = process.env.GAME_FOLDER_PATH;
    if (!gameFolder) {
        console.error('GAME_FOLDER_PATH environment variable not set');
        return;
    }

    const currentGames = await getAllGames();

    return new Promise<void>((resolve, reject) => {
        fs.readdir(gameFolder, async (err, files) => {
            if (err) {
                console.error('Error reading game folder:', err);
                reject(err);
                return;
            }

            try {
                for (const file of files) {
                    const path = join(gameFolder, file);
                    const stat = fs.statSync(path);
                    const pathExists = await gameWithPathExists(file);

                    if (!pathExists && stat.isDirectory()) {
                        const game = await findGame(file);
                        if (game.results.length > 0) {
                            const gameDetails = await getGameDetails(game.results[0].id);
                            gameDetails.path = file;
                            await saveGame(gameDetails);
                        }
                    }
                }

                for (const game of currentGames) {
                    const path = join(gameFolder, game.path);
                    if (!fs.existsSync(path)) {
                        await deleteGame(game.path);
                    }
                }

                resolve();
            } catch (error) {
                console.error('Error processing games:', error);
                reject(error);
            }
        });
    });

   
}




