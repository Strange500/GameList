// we will store games info inside a json file
// here we will provide to other ts file function a acces games info easily

import fs from 'fs';
import { SearchResults } from './apiInterfaces';
import { GameDetails } from './gameDetail';

// make sure data.json exists else create it


import * as data from './data.json';


let games: GameDetails[] = [];

try {
    games = Array.isArray(data) ? data : Object.values(data);
    if (!Array.isArray(games)) {
        throw new Error('Data is not an array');
    }
} catch (error) {
    console.error('Error reading data.json:', error);
    games = [];
    fs.writeFileSync('app/db/data.json', JSON.stringify(games, null, 2));
}

export function getAllGames() {
    let gamess: GameDetails[] = [];

    // Try to read the existing games data from the file
    try {
        const dataBuffer = fs.readFileSync('app/db/data.json');
        gamess = JSON.parse(dataBuffer.toString()).filter((item: any) => typeof item === 'object' && item !== null && item.id);
    } catch (error) {
        console.error('Error reading game data:', error);
        // The file may not exist or may be malformed; create a clean state.
    }

    return gamess;
}
export function displayGame(id: number) {
    const game: GameDetails | undefined = games.find(game => game.id === id);
    return game;
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

export function saveGame(game: GameDetails) {
    let gamess: GameDetails[] = [];

    // Try to read the existing games data from the file
    try {
        const dataBuffer = fs.readFileSync('app/db/data.json');
        gamess = JSON.parse(dataBuffer.toString()).filter((item: any) => typeof item === 'object' && item !== null && item.id);
    } catch (error) {
        console.error('Error reading game data:', error);
        // The file may not exist or may be malformed; create a clean state.
    }

    // Upsert the game: update if exists, else add new game
    const gameIndex = gamess.findIndex(g => g.id === game.id);
    
    if (gameIndex !== -1) {
        gamess[gameIndex] = game;
    } else {
        gamess.push(game);
    }

    // Write the updated games array back to the file
    try {
        fs.writeFileSync('app/db/data.json', JSON.stringify(gamess, null, 2));
        console.log('Game saved');
    } catch (error) {
        console.error('Error saving game data:', error);
    }
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
