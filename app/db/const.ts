import fs from 'fs';
import { join } from 'path';




// path where all data related to the app is stored
export const DATA_PATH = join(process.cwd(), 'public');

// folder where the database is stored
export const DB_PATH = join(process.cwd(), "db", 'games.sqlite');

// folder where the games info are stored
export const GAME_FOLDER_PATH = join(process.cwd(), 'public', 'games');

export const GAMES_PATH = process.env.GAMES_PATH || join(process.cwd(), 'public', 'gamesFiles');



if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH);
}

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, '');
}

if (!fs.existsSync(GAME_FOLDER_PATH)) {
    fs.mkdirSync(GAME_FOLDER_PATH);
}

if (!fs.existsSync(GAMES_PATH)) {
    fs.mkdirSync(GAMES_PATH);
}
