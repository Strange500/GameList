'use server';
import fs from 'fs';
import { SearchResults } from './interfaces/apiInterfaces';
import { GameDetails } from './gameDetail';
import { join } from 'path';
import sqlite3 from 'sqlite3';
import stream from 'stream';
import { ScreenShotResults } from './interfaces/screenShotsResults';
import { ReadableStream as WebReadableStream } from 'stream/web';
sqlite3.verbose();




const DATA_PATH = join(process.cwd(), 'public');

const DB_PATH = join(process.cwd(), "db", 'games.db');
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
            { name: 'screenshots', query: createScreenshotsTable }
        ];

        tablesToCreate.forEach(table => {
            if (!existingTables.includes(table.name)) {
                db.exec(table.query, (err) => {
                    if (err) {
                        console.error(`Error creating table ${table.name}:`, err);
                    } else {
                        console.log(`Table ${table.name} created successfully`);
                    }
                });
            }
        });
    });

    // Define the SQL to create the tables only if they do not exist
    const createGamesTable = `
        CREATE TABLE IF NOT EXISTS games (
            path VARCHAR(255) PRIMARY KEY,
            id INT NOT NULL,
            slug VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            name_original VARCHAR(255),
            description TEXT,
            released DATE,
            background_image VARCHAR(512),
            screenshots_count INT
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

export async function getAllGames(): Promise<GameDetails[]> {
    const query = 'SELECT * FROM games;';
    return new Promise((resolve, reject) => {
        db.all(query, (err: Error | null, rows: GameDetails[]) => {
            if (err) {
                console.error('Error querying games:', err);
                reject(err);
                return;
            }
            const gamess: GameDetails[] = rows.map((row: GameDetails) => ({
                path: row.path,
                id: row.id,
                slug: row.slug,
                name: row.name,
                name_original: row.name_original,
                description: row.description,
                released: row.released,
                background_image: row.background_image,
                screenshots_count: row.screenshots_count
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
            console.log('Pipeline succeeded');
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
            const screenshots = rows.map((row: { url: string }) => row.url);
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


export async function saveGame(game: GameDetails) {
    const query = `
        INSERT OR IGNORE INTO games (path, id, slug, name, name_original, description, released, background_image, screenshots_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const screenshots = await getScreenshots(game.id);
    saveScreenshots(game.id, screenshots);
    saveBackgroundImage(game.background_image, game.id);
    game.background_image = `/api/games/${game.id}/background`;



    const values = [
        game.path,
        game.id,
        game.slug,
        game.name,
        game.name_original,
        game.description,
        game.released,
        game.background_image,
        game.screenshots_count
    ];

    return new Promise((resolve, reject) => {
        
        db.run(query, values, function (err) {
            if (err) {
                console.error('Error saving game:', err);
                reject(err);
                return;
            }
            if (this.lastID) {
                console.log(`Game saved with ID: ${this.lastID}`);
            }
            resolve(this.lastID);
        });
    });
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




