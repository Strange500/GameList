import { join } from 'path';
import sqlite3 from 'sqlite3';
import { initializeDatabase } from './DB';



// path where all data related to the app is stored
export const DATA_PATH = join(process.cwd(), 'public');

// folder where the database is stored
export const DB_PATH = join(process.cwd(), "db", 'games.sqlite');

// folder where the games info are stored
export const GAME_FOLDER_PATH = join(process.cwd(), 'public', 'games');



console.log('initializing database');
export const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    } else {
        initializeDatabase(db);
    }
    
}
);