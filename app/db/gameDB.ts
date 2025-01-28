'use server';
import fs from 'fs';
import { SearchResults } from './interfaces/apiInterfaces';
import { GameDetails } from './interfaces/gameDetail';
import { join } from 'path';
import sqlite3 from 'sqlite3';
import stream from 'stream';
import { ScreenShotResults } from './interfaces/screenShotsResults';
import { ReadableStream as WebReadableStream } from 'stream/web';
sqlite3.verbose();




const DATA_PATH = join(process.cwd(), 'public');

const DB_PATH = join(process.cwd(), "db", 'games.db');
console.log(DB_PATH);
const GAME_FOLDER_PATH = join(process.cwd(), 'public', 'games');



if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH);
}

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '');
}

if (!fs.existsSync(GAME_FOLDER_PATH)) {
    fs.mkdirSync(GAME_FOLDER_PATH);
}


const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    } else {
        initializeDatabase();
    }
    
}
);

export async function initializeDatabase() {
    const checkTablesExistQuery = `
        SELECT name FROM sqlite_master WHERE type='table' AND name IN ('games', 'genres', 'tags', 'game_genres', 'game_tags', 'screenshots');
    `;

    db.all(checkTablesExistQuery, (err, rows: { name: string }[]) => {
        if (err) {
            console.error('Error checking tables:', err);
            return;
        }

        const existingTables = rows.map((row: { name: string }) => row.name);
        const tablesToCreate = [
            { name: 'games', query: createGamesTable },
            { name: 'genres', query: createGenresTable },
            { name: 'tags', query: createTagsTable },
            { name: 'game_genres', query: createGameGenresTable },
            { name: 'game_tags', query: createGameTagsTable },
            { name: 'screenshots', query: createScreenshotsTable },
            { name: 'esrb_ratings', query: createEsrbRatingsTable },
            { name: 'platforms', query: createPlatformsTable },
            { name: 'game_platforms', query: createGamePlatformsTable },
            { name: 'metacritic_platforms', query: createMetacriticPlatformsTable }

        ];

        tablesToCreate.forEach(table => {
            if (!existingTables.includes(table.name)) {
                db.exec(table.query);
            }
        });
    });

    // Define the SQL to create the tables only if they do not exist
    const createGamesTable = `
        CREATE TABLE IF NOT EXISTS games (
            path VARCHAR(255) PRIMARY KEY,
            date_added DATE,
            id INT NOT NULL,
            slug VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            name_original VARCHAR(255),
            description TEXT,
            metacritic INT,
            released DATE,
            tba BOOLEAN,
            updated DATE,
            background_image VARCHAR(512),
            background_image_additional VARCHAR(512),
            website VARCHAR(255),
            rating FLOAT,
            rating_top INT,
            added INT,
            playtime INT,
            screenshots_count INT,
            movies_count INT,
            creators_count INT,
            achievements_count INT,
            parent_achievements_count VARCHAR(255),
            reddit_url VARCHAR(255),
            reddit_name VARCHAR(255),
            reddit_description TEXT,
            reddit_logo VARCHAR(255),
            reddit_count INT,
            twitch_count VARCHAR(255),
            youtube_count VARCHAR(255),
            reviews_text_count VARCHAR(255),
            ratings_count INT,
            suggestions_count INT,
            alternative_names TEXT,
            metacritic_url VARCHAR(255),
            parents_count INT,
            additions_count INT,
            game_series_count INT,
            esrb_rating_id INT,
            FOREIGN KEY (esrb_rating_id) REFERENCES esrb_ratings(id)
        );
    `;

    const createEsrbRatingsTable = `
        CREATE TABLE IF NOT EXISTS esrb_ratings (
            id INT PRIMARY KEY,
            slug VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL
        );
    `;

    const createPlatformsTable = `
        CREATE TABLE IF NOT EXISTS platforms (
            id INT PRIMARY KEY,
            slug VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL
        );
    `;

    const createGamePlatformsTable = `
        CREATE TABLE IF NOT EXISTS game_platforms (
            game_id INT,
            platform_id INT,
            released_at DATE,
            requirements_minimum TEXT,
            requirements_recommended TEXT,
            PRIMARY KEY (game_id, platform_id),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (platform_id) REFERENCES platforms(id) ON DELETE CASCADE
        );
    `;

    const createMetacriticPlatformsTable = `
        CREATE TABLE IF NOT EXISTS metacritic_platforms (
            game_id INT,
            metascore INT,
            url VARCHAR(255),
            PRIMARY KEY (game_id, url),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        );
    `;

    const createScreenshotsTable = `
        CREATE TABLE IF NOT EXISTS screenshots (
            game_id INT,
            url VARCHAR(512),
            PRIMARY KEY (game_id, url),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        );
    `;

    

    const createGenresTable = `
        CREATE TABLE IF NOT EXISTS genres (
            id INT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL
        );
    `;

    const createTagsTable = `
        CREATE TABLE IF NOT EXISTS tags (
            id INT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL,
            language VARCHAR(10),
            games_count INT
        );
    `;

    const createGameGenresTable = `
        CREATE TABLE IF NOT EXISTS game_genres (
            game_id INT,
            genre_id INT,
            PRIMARY KEY (game_id, genre_id),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
        );
    `;

    const createGameTagsTable = `
        CREATE TABLE IF NOT EXISTS game_tags (
            game_id INT,
            tag_id INT,
            PRIMARY KEY (game_id, tag_id),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
        );
    `;
    
}

export async function getGamePlatforms(gameId: number) {
    const query = `SELECT released_at, requirements_minimum, requirements_recommended, slug, name  FROM game_platforms g JOIN platforms p ON g.platform_id = p.id WHERE game_id = ?;`;
    return new Promise((resolve, reject) => {
        db.all(query, [gameId], (err, rows) => {
            if (err) {
                console.error('Error querying game platforms:', err);
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

export async function saveGame(game: GameDetails) {
    
    const screenshots = await getScreenshots(game.id);
    saveScreenshots(game.id, screenshots);
    saveBackgroundImage(game.background_image, game.id);
    game.background_image = `/api/games/${game.id}/background`;

    const query = `
        INSERT INTO games (
            path, date_added, id, slug, name, name_original, description, metacritic, released, tba, updated, background_image, background_image_additional, website, rating, rating_top, added, playtime, screenshots_count, movies_count, creators_count, achievements_count, parent_achievements_count, reddit_url, reddit_name, reddit_description, reddit_logo, reddit_count, twitch_count, youtube_count, reviews_text_count, ratings_count, suggestions_count, alternative_names, metacritic_url, parents_count, additions_count, game_series_count, esrb_rating_id
        ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
    `;
    const esrb_rating_query = `INSERT OR IGNORE INTO esrb_ratings (id, slug, name) VALUES (?, ?, ?);`;
    db.run(esrb_rating_query, [game.esrb_rating.id, game.esrb_rating.slug, game.esrb_rating.name]);

    const platforms_query = `INSERT OR IGNORE INTO platforms (id, slug, name) VALUES (?, ?, ?);`;
    game.platforms.forEach(platform => {
        db.run(platforms_query, [platform.platform.id, platform.platform.slug, platform.platform.name]);
        const game_platforms_query = `INSERT OR IGNORE INTO game_platforms (game_id, platform_id, released_at, requirements_minimum, requirements_recommended) VALUES (?, ?, ?, ?, ?);`;
        db.run(game_platforms_query, [game.id, platform.platform.id, platform.released_at, platform.requirements.minimum, platform.requirements.recommended]);
    });
    const values = [
        game.path,
        new Date(),
        game.id,
        game.slug,
        game.name,
        game.name_original,
        game.description,
        game.metacritic,
        game.released,
        game.tba,
        game.updated,
        game.background_image,
        game.background_image_additional,
        game.website,
        game.rating,
        game.rating_top,
        game.added,
        game.playtime,
        game.screenshots_count,
        game.movies_count,
        game.creators_count,
        game.achievements_count,
        game.parent_achievements_count,
        game.reddit_url,
        game.reddit_name,
        game.reddit_description,
        game.reddit_logo,
        game.reddit_count,
        game.twitch_count,
        game.youtube_count,
        game.reviews_text_count,
        game.ratings_count,
        game.suggestions_count,
        game.alternative_names,
        game.metacritic_url,
        game.parents_count,
        game.additions_count,
        game.game_series_count,
        game.esrb_rating.id
    ];
    return new Promise((resolve, reject) => {
        db.run(query, values, function (err) {
            if (err) {
                console.error('Error saving game:', err);
                reject(err);
                return;
            }
            if (this.changes > 0) {
                console.log(`Game saved with path: ${game.path}`);
            }
            resolve(this.changes);
        });
    });



    
}


export async function getAllGames(): Promise<GameDetails[]> {
    const query = 'SELECT games.*, e.slug as esrb_slug, e.name as esrb_name FROM games JOIN esrb_ratings e ON games.esrb_rating_id = e.id;';
    return new Promise((resolve, reject) => {
        db.all(query, (err: Error | null, rows: GameDetails[]) => {
            if (err) {
                console.error('Error querying games:', err);
                reject(err);
                return;
            }
            
            const gamess: GameDetails[] = rows.map((row: GameDetails) => ({
                path : row.path,
                date_added: row.date_added,
                id: row.id,
                slug: row.slug,
                name: row.name,
                name_original: row.name_original,
                description: row.description,
                metacritic: row.metacritic,
                released: row.released,
                tba: row.tba,
                updated: row.updated,
                background_image: row.background_image,
                background_image_additional: row.background_image_additional,
                website: row.website,
                rating: row.rating,
                rating_top: row.rating_top,
                added: row.added,
                playtime: row.playtime,
                screenshots_count: row.screenshots_count,
                movies_count: row.movies_count,
                creators_count: row.creators_count,
                achievements_count: row.achievements_count,
                parent_achievements_count: row.parent_achievements_count,
                reddit_url: row.reddit_url,
                reddit_name: row.reddit_name,
                reddit_description: row.reddit_description,
                reddit_logo: row.reddit_logo,
                reddit_count: row.reddit_count,
                twitch_count: row.twitch_count,
                youtube_count: row.youtube_count,
                reviews_text_count: row.reviews_text_count,
                ratings_count: row.ratings_count,
                suggestions_count: row.suggestions_count,
                alternative_names: row.alternative_names,
                metacritic_url: row.metacritic_url,
                parents_count: row.parents_count,
                additions_count: row.additions_count,
                game_series_count: row.game_series_count,
                esrb_rating: {
                    id: row.esrb_rating_id,
                    slug: row.esrb_slug,
                    name: row.esrb_name
                }
            }));
            resolve(gamess);
        });
    });
}

export async function changeGameId(path: string, newId: number) {
    const delQuery = `DELETE FROM games WHERE path = ?;`;
    db.run(delQuery, [path]);
    console.log(`Game with path ${path} deleted`);
    saveGameWithId(newId, path);
}

export async function getGame(id: number): Promise<GameDetails | undefined> {
    const query = `SELECT * FROM games WHERE id = ?;`;
    return new Promise((resolve, reject) => {
        db.get(query, [id], (err: Error | null, row: GameDetails) => {
            if (err) {
                console.error('Error querying game:', err);
                reject(err);
                return;
            }
            if (row) {
                const game: GameDetails = {
                    path: row.path,
                    id: row.id,
                    slug: row.slug,
                    name: row.name,
                    name_original: row.name_original,
                    description: row.description,
                    released: row.released,
                    background_image: row.background_image,
                    screenshots_count: row.screenshots_count
                };
                resolve(game);
            } else {
                resolve(undefined);
            }
        });
    });
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
    const queryId = `SELECT id FROM games WHERE path = ?;`;
    const gameId = await new Promise<number>((resolve, reject) => {
        db.get(queryId, [path], (err, row) => {
            if (err) {
                console.error('Error querying game:', err);
                reject(err);
                return;
            }
            resolve((row as { id: number }).id);
        });
    }
    );
    const gameFolder = await getGameFolder(gameId);
    fs.rm(gameFolder, { recursive: true }, (err) => {
        if (err) {
            console.error('Error deleting game folder:', err);
        }
    }
    );
    const query = `DELETE FROM games WHERE path = ?;`;
    return new Promise((resolve, reject) => {
        db.run(query, [path], function (err) {
            if (err) {
                console.error('Error deleting game:', err);
                reject(err);
                return;
            }
            if (this.changes > 0) {
                console.log(`Game deleted with path: ${path}`);
            }
            resolve(this.changes);
        });
    });
}

async function gameWithPathExists(path: string): Promise<boolean> {
    const query = `SELECT * FROM games WHERE path = ?;`;
    return new Promise((resolve, reject) => {
        db.get(query, [path], (err: Error | null, row: GameDetails) => {
            if (err) {
                console.error('Error querying game:', err);
                reject(err);
                return;
            }
            resolve(row !== undefined);
        });
    });
}

export async function modifyGame(game: GameDetails) {
    const query = `
        UPDATE games
        SET slug = ?, name = ?, name_original = ?, description = ?, released = ?, background_image = ?, screenshots_count = ?
        WHERE path = ?;
    `;

    const values = [
        game.slug,
        game.name,
        game.name_original,
        game.description,
        game.released,
        game.background_image,
        game.screenshots_count,
        game.path
    ];
    return new Promise((resolve, reject) => {
        db.run(query, values, function (err) {
            if (err) {
                console.error('Error updating game:', err);
                reject(err);
                return;
            }
            if (this.changes > 0) {
                console.log(`Game updated with path: ${game.path}`);
            }
            resolve(this.changes);
        });
    });
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
    const query = `SELECT url FROM screenshots WHERE game_id = ?;`;
    return new Promise((resolve, reject) => {
        db.all(query, [gameId], (err, rows: { url: string }[]) => {
            if (err) {
                console.error('Error querying screenshots:', err);
                reject(err);
                return;
            }
            const screenshots_filenames = rows.map((row) => row.url.split('/').pop());
            const screenshots = screenshots_filenames.map((filename) => `/games/${gameId}/images/${filename}`);
            resolve(screenshots);
        });
    });
}

export async function getGameBackgroundURI(gameId: number): Promise<string> {
    return `/games/${gameId}/images/background.jpg`;
}

export async function saveScreenshots(gameId: number, screenshots: string[]) {
    for (const url of screenshots) {
        const saveDir = await getGameImagesFolder(gameId);


        const fileName = url.split('/').pop();
        const savePath = join(saveDir, fileName || '');
        const query = `INSERT OR IGNORE INTO screenshots (game_id, url) VALUES (?, ?);`;
        const values = [gameId, savePath];

        await saveWebFile(savePath, url);

        db.run(query, values, function (err) {
            if (err) {
                console.error('Error saving screenshot:', err);
                return;
            }
            if (this.changes > 0) {
                console.log(`Screenshot saved for game ID ${gameId}`);
            }
        });
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

    fs.readdir(gameFolder, (err, files) => {
        if (err) {
            console.error('Error reading game folder:', err);
            return;
        }

        files.forEach(async (file) => {
            const path = join(gameFolder, file);
            const stat = fs.statSync(path);
            const pathExists = await gameWithPathExists(file);
           
            if ( !pathExists && stat.isDirectory()) {
                const game = await findGame(file);
                if (game.results.length > 0) {
                    const gameDetails = await getGameDetails(game.results[0].id);
                    gameDetails.path = file;
                    await saveGame(gameDetails);
                }
            }
        });

        currentGames.forEach(async (game) => {
            const path = join(gameFolder, game.path);
            if (!fs.existsSync(path)) {
                await deleteGame(game.path);
            }
        }
        );
    });

    return;
}




