import { SearchResults } from './interfaces/apiInterfaces';
import { GameDetails } from './interfaces/gameDetail';
import { ScreenShotResults } from './interfaces/screenShotsResults';
import { Games } from './models/Games';







export class RAWGIOAPI {
    static #API_KEY = process.env.RAWG_API_KEY;
    static #BASE_URL = 'https://api.rawg.io/api';

    static async findByTitle(title: string): Promise<Games[]> {
        const path = '/games';
        const params = { search: title };
        const response = await RAWGIOAPI.#fetchRawgApi(path, params);
        const games = (response as SearchResults).results.map((result) => {
            return Games.build({
                gameId: result.id,
                slug: result.slug,
                name: result.name,
                released: result.released,
                background_image: result.background_image,
                rating: result.rating,
                date_added: result.added,
                metacritic: result.metacritic,
            });
        });
        return Promise.resolve(games);
    }



    static async getGameDetails(id: number): Promise<Games> {
        const path = `/games/${id}`;
        const response = await RAWGIOAPI.#fetchRawgApi(path, {});
        const game =  response as GameDetails;
        const instance = await Games.build({
            // path: game.path,
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
        });
        return instance;
    }

    static async getScreenshotsForGame(id: number): Promise<string[]> {
        const path = `/games/${id}/screenshots`;
        const params = { page_size: '10' };
        const response = await RAWGIOAPI.#fetchRawgApi(path, params);
        const screenshots = (response as ScreenShotResults).results.map((result) => result.image);
        return screenshots;
    }

    static async #fetchData(apiUrl: string, params: Record<string, string>): Promise<unknown> {
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
    static async #fetchRawgApi(path: string, params: Record<string, string>) {
        if (!RAWGIOAPI.#API_KEY) {
            throw new Error('RAWG_API_KEY not found');
        }
        const url = `${RAWGIOAPI.#BASE_URL}${path}`;
        const response = await RAWGIOAPI.#fetchData(url, { key: RAWGIOAPI.#API_KEY, ...params });
        return response;
    }
        
}





