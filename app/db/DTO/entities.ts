import sqlite3 from 'sqlite3';
import { db, DB_PATH } from '../const';
import { initializeDatabase } from '../gameDB';

export class DbEntities {
    db: sqlite3.Database;

    constructor() {
        this.db = db;
    }
}


export class Game {
    path:                        string;
    date_added:                  Date;
    id:                          number;
    slug:                        string;
    name:                        string;
    name_original:               string;
    description:                 string;
    metacritic:                  number;
    released:                    Date;
    tba:                         boolean;
    updated:                     Date;
    background_image:            string;
    background_image_additional: string;
    website:                     string;
    rating:                      number;
    rating_top:                  number;
    added:                       number;
    playtime:                    number;
    screenshots_count:           number;
    movies_count:                number;
    creators_count:              number;
    achievements_count:          number;
    parent_achievements_count:   string;
    reddit_url:                  string;
    reddit_name:                 string;
    reddit_description:          string;
    reddit_logo:                 string;
    reddit_count:                number;
    twitch_count:                string;
    youtube_count:               string;
    reviews_text_count:          string;
    ratings_count:               number;
    suggestions_count:           number;
    alternative_names:           string[];
    metacritic_url:              string;
    parents_count:               number;
    additions_count:             number;
    game_series_count:           number;
    // esrb_rating:                 EsrbRating;
    // platforms:                   Platform[];

    constructor(path: string, date_added: Date, id: number, slug: string, name: string, name_original: string, description: string, metacritic: number, released: Date, tba: boolean, updated: Date, background_image: string, background_image_additional: string, website: string, rating: number, rating_top: number, added: number, playtime: number, screenshots_count: number, movies_count: number, creators_count: number, achievements_count: number, parent_achievements_count: string, reddit_url: string, reddit_name: string, reddit_description: string, reddit_logo: string, reddit_count: number, twitch_count: string, youtube_count: string, reviews_text_count: string, ratings_count: number, suggestions_count: number, alternative_names: string[], metacritic_url: string, parents_count: number, additions_count: number, game_series_count: number) {
        this.path = path;
        this.date_added = date_added;
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.name_original = name_original;
        this.description = description;
        this.metacritic = metacritic;
        this.released = released;
        this.tba = tba;
        this.updated = updated;
        this.background_image = background_image;
        this.background_image_additional = background_image_additional;
        this.website = website;
        this.rating = rating;
        this.rating_top = rating_top;
        this.added = added;
        this.playtime = playtime;
        this.screenshots_count = screenshots_count;
        this.movies_count = movies_count;
        this.creators_count = creators_count;
        this.achievements_count = achievements_count;
        this.parent_achievements_count = parent_achievements_count;
        this.reddit_url = reddit_url;
        this.reddit_name = reddit_name;
        this.reddit_description = reddit_description;
        this.reddit_logo = reddit_logo;
        this.reddit_count = reddit_count;
        this.twitch_count = twitch_count;
        this.youtube_count = youtube_count;
        this.reviews_text_count = reviews_text_count;
        this.ratings_count = ratings_count;
        this.suggestions_count = suggestions_count;
        this.alternative_names = alternative_names;
        this.metacritic_url = metacritic_url;
        this.parents_count = parents_count;
        this.additions_count = additions_count;
        this.game_series_count = game_series_count;
    }

}



export class Platform {
    id: number;
    slug: string;
    name: string;
    released_at: Date;
    requirements_min: string;
    requirements_recommended: string;

    constructor(id: number, slug: string, name: string, released_at: Date, requirements_min: string, requirements_recommended: string) {
        this.id = id;
        this.slug = slug;
        this.name = name;
        this.released_at = released_at;
        this.requirements_min = requirements_min;
        this.requirements_recommended = requirements_recommended;
    }

}

export class EsrbRating {
    id: number;
    slug: string;
    name: string;

    constructor(id: number, slug: string, name: string) {
        this.id = id;
        this.slug = slug;
        this.name = name;
    }
}