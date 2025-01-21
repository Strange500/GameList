'use server';
import fs from 'fs';
import { SearchResults } from './apiInterfaces';
import { GameDetails } from './gameDetail';
import { join } from 'path';
import sqlite3 from 'sqlite3';
sqlite3.verbose();


const DB_PATH = 'app/db/game.db';



const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to the SQLite database');
    }
}
);

export async function initializeDatabase() {
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

    const createScreenshotsTable = `
        CREATE TABLE IF NOT EXISTS screenshots (
            game_id INT,
            url VARCHAR(512),
            PRIMARY KEY (game_id, url),
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
        );
    `;

    //const testgame:string = 'INSERT INTO games (path, id, slug, name, name_original, description, released, background_image, screenshots_count) VALUES ("test", 1, "test", "test", "test", "test", "2021-01-01", "https://placehold.co/600x400", 2);';

    // Execute the create table statements
    db.exec(createGamesTable);
    db.exec(createGenresTable);
    db.exec(createTagsTable);
    db.exec(createGameGenresTable);
    db.exec(createGameTagsTable);
    db.exec(createScreenshotsTable);
    //db.exec(testgame);
    
    console.log("Tables created or already exist.");
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

export async function  getGame(id: number): Promise<GameDetails | undefined> {
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

export async function saveGame(game: GameDetails) {
    const query = `
        INSERT OR IGNORE INTO games (path, id, slug, name, name_original, description, released, background_image, screenshots_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

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
            if (stat.isDirectory()) {
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


