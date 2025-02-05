import fs from 'fs';
import { join } from 'path';

// path where all data related to the app is stored
export const DATA_PATH = join(process.cwd(), 'public');



export const GAMES_PATH = process.env.GAMES_PATH || join(process.cwd(), 'public', 'gamesFiles');


console.log('DATA_PATH', DATA_PATH);
console.log('GAMES_PATH', GAMES_PATH);

if (!fs.existsSync(DATA_PATH)) {
    fs.mkdirSync(DATA_PATH);
}



if (!fs.existsSync(GAMES_PATH)) {
    fs.mkdirSync(GAMES_PATH);
}
