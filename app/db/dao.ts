import sqlite3 from "sqlite3";

import { Sequelize } from 'sequelize-typescript';
import { Games } from "./models/Games";


// export class GameDao extends DbEntities {

//     constructor() {
//         super();
//     }

//     async getGameFromId(id: number): Promise<Game> {
//         return new Promise((resolve, reject) => {
//             const stmt: Statement = this.db.prepare('SELECT * FROM games WHERE id = ?');
//             stmt.get(id, (err, row: GameDetails) => {
//                 stmt.finalize();
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(new Game(row.path, row.date_added, row.id, row.slug, row.name, row.name_original, row.description, row.metacritic, row.released, row.tba, row.updated, row.background_image, row.background_image_additional, row.website, row.rating, row.rating_top, row.added, row.playtime, row.screenshots_count, row.movies_count, row.creators_count, row.achievements_count, row.parent_achievements_count, row.reddit_url, row.reddit_name, row.description, row.reddit_logo, row.reddit_count, row.twitch_count, row.youtube_count, row.reviews_text_count, row.ratings_count, row.suggestions_count, row.alternative_names, row.metacritic_url, row.parents_count, row.additions_count, row.game_series_count));
//                 }
//             });
//         }
//         );
//     }

//     async getGameFromPath(path: string): Promise<Game> {
//         return new Promise((resolve, reject) => {
//             const stmt: Statement = this.db.prepare('SELECT * FROM games WHERE path = ?');
//             stmt.get(path, (err, row: GameDetails) => {
//                 stmt.finalize();
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(new Game(row.path, row.date_added, row.id, row.slug, row.name, row.name_original, row.description, row.metacritic, row.released, row.tba, row.updated, row.background_image, row.background_image_additional, row.website, row.rating, row.rating_top, row.added, row.playtime, row.screenshots_count, row.movies_count, row.creators_count, row.achievements_count, row.parent_achievements_count, row.reddit_url, row.reddit_name, row.description, row.reddit_logo, row.reddit_count, row.twitch_count, row.youtube_count, row.reviews_text_count, row.ratings_count, row.suggestions_count, row.alternative_names, row.metacritic_url, row.parents_count, row.additions_count, row.game_series_count));
//                 }
//             });
//         }
//         );
//     }

//     async createGame(game: Game): Promise<void> {
//         return new Promise((resolve, reject) => {
//             const query = `
//                         INSERT INTO games (
//                             path, date_added, id, slug, name, name_original, description, metacritic, released, tba, updated, background_image, background_image_additional, website, rating, rating_top, added, playtime, screenshots_count, movies_count, creators_count, achievements_count, parent_achievements_count, reddit_url, reddit_name, reddit_description, reddit_logo, reddit_count, twitch_count, youtube_count, reviews_text_count, ratings_count, suggestions_count, alternative_names, metacritic_url, parents_count, additions_count, game_series_count
//                         ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);
//                     `;
//             const stmt: Statement = this.db.prepare(query);
//             stmt.run(game.path, game.date_added, game.id, game.slug, game.name, game.name_original, game.description, game.metacritic, game.released, game.tba, game.updated, game.background_image, game.background_image_additional, game.website, game.rating, game.rating_top, game.added, game.playtime, game.screenshots_count, game.movies_count, game.creators_count, game.achievements_count, game.parent_achievements_count, game.reddit_url, game.reddit_name, game.reddit_description, game.reddit_logo, game.reddit_count, game.twitch_count, game.youtube_count, game.reviews_text_count, game.ratings_count, game.suggestions_count, game.alternative_names, game.metacritic_url, game.parents_count, game.additions_count, game.game_series_count, (err) => {
//                 stmt.finalize();
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });

//         });
        
//     }

//     async updateGame(game: Game): Promise<void> {
//         return new Promise((resolve, reject) => {
//             const query = `
//                         UPDATE games SET
//                             path = ?, date_added = ?, id = ?, slug = ?, name = ?, name_original = ?, description = ?, metacritic = ?, released = ?, tba = ?, updated = ?, background_image = ?, background_image_additional = ?, website = ?, rating = ?, rating_top = ?, added = ?, playtime = ?, screenshots_count = ?, movies_count = ?, creators_count = ?, achievements_count = ?, parent_achievements_count = ?, reddit_url = ?, reddit_name = ?, reddit_description = ?, reddit_logo = ?, reddit_count = ?, twitch_count = ?, youtube_count = ?, reviews_text_count = ?, ratings_count = ?, suggestions_count = ?, alternative_names = ?, metacritic_url = ?, parents_count = ?, additions_count = ?, game_series_count = ?
//                         WHERE path = ?;
//                     `;
//             const stmt: Statement = this.db.prepare(query);
//             stmt.run(game.path, game.date_added, game.id, game.slug, game.name, game.name_original, game.description, game.metacritic, game.released, game.tba, game.updated, game.background_image, game.background_image_additional, game.website, game.rating, game.rating_top, game.added, game.playtime, game.screenshots_count, game.movies_count, game.creators_count, game.achievements_count, game.parent_achievements_count, game.reddit_url, game.reddit_name, game.reddit_description, game.reddit_logo, game.reddit_count, game.twitch_count, game.youtube_count, game.reviews_text_count, game.ratings_count, game.suggestions_count, game.alternative_names, game.metacritic_url, game.parents_count, game.additions_count, game.game_series_count, game.path, (err) => {
//                 stmt.finalize();
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });

//         });
//     }

//     async deleteGame(path: string): Promise<void> {
//         return new Promise((resolve, reject) => {
//             const query = `
//                         DELETE FROM games WHERE path = ?;
//                     `;
//             const stmt: Statement = this.db.prepare(query);
//             stmt.run(path, (err) => {
//                 stmt.finalize();
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });

//         });
//     }

//     async deleteGameByID(id: number): Promise<void> {
//         return new Promise((resolve, reject) => {
//             const query = `
//                         DELETE FROM games WHERE id = ?;
//                     `;
//             const stmt: Statement = this.db.prepare(query);
//             stmt.run(id, (err) => {
//                 stmt.finalize();
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve();
//                 }
//             });
                
//             });

//     }


// }
        
// export class EsrbRatingDao extends DbEntities {

//     constructor() {
//         super();
//     }

//     async getEsrbRatingFromGameId(gameId: number): Promise<EsrbRating> {
//         return new Promise((resolve, reject) => {
//             const stmt: Statement = this.db.prepare('SELECT esrb_ratings.* FROM esrb_ratings JOIN esrb_ratings_games ON esrb_ratings.id = esrb_ratings_games.esrb_rating_id WHERE esrb_ratings_games.game_id = ?');
//             stmt.get(gameId, (err, row) => {
//                 stmt.finalize();
//                 console.log(row);
//                 if (err) {
//                     console.log(stmt)
//                     reject(err);
//                 } else {
//                     resolve(new EsrbRating(row.id, row.slug, row.name));
//                 }
//             });
//         }
//         );
//     }

//     async getEsrbRatingFromId(id: number): Promise<EsrbRating> {
//         return new Promise((resolve, reject) => {
//             const stmt: Statement = this.db.prepare('SELECT * FROM esrb_ratings WHERE id = ?');
//             stmt.get(id, (err, row: esRating) => {
//                 stmt.finalize();
//                 if (err) {
//                     console.log(stmt)
//                     reject(err);
//                 } else {
//                     resolve(new EsrbRating(row.id, row.slug, row.name));
//                 }
//             });
//         }
//         );
//     }

//     async getEsrbRatingFromSlug(slug: string): Promise<EsrbRating> {
//         return new Promise((resolve, reject) => {
//             const stmt: Statement = this.db.prepare('SELECT * FROM esrb_ratings WHERE slug = ?');
//             stmt.get(slug, (err, row: esRating) => {
//                 stmt.finalize();
//                 if (err) {
//                     console.log(stmt)
//                     reject(err);
//                 } else {
//                     resolve(new EsrbRating(row.id, row.slug, row.name));
//                 }
//             });
//         }
//         );
//     }

//     async createEsrbRating(esrbRating: EsrbRating, gameId: number): Promise<void> {
//         return new Promise((resolve, reject) => {
//             const query = `
//                         INSERT INTO esrb_ratings (
//                             id, slug, name
//                         ) VALUES (?,?,?);
//                     `;
//             const query2 = `
//                 INSERT INTO esrb_ratings_games (
//                     esrb_rating_id, game_id
//                 ) VALUES (?,?);
//             `;
//             const stmt: Statement = this.db.prepare(query);
//             const stmt2: Statement = this.db.prepare(query2);
//             stmt.run(esrbRating.id, esrbRating.slug, esrbRating.name, (err) => {
//                 stmt.finalize();
//                 if (err) {
//                     console.log(stmt)
//                     reject(err);
//                 } else {
//                     stmt2.run(esrbRating.id, gameId, (err) => {
//                         stmt2.finalize();
//                         if (err) {
//                             console.log(stmt2)
//                             reject(err);
//                         } else {
//                             resolve();
//                         }
//                     }
//                     );

//                 }
//             });

            
//         });
        
//     }


//     async deleteEsrbRating(id: number): Promise<void> {
//         return new Promise((resolve, reject) => {
//             const query = `
//                 DELETE FROM esrb_ratings_games WHERE esrb_rating_id = ?;
//             `;

//             const query2 = `
//                         DELETE FROM esrb_ratings WHERE id = ?;
//                     `;
//             const stmt: Statement = this.db.prepare(query);
//             stmt.run(id, (err) => {
//                 stmt.finalize();
//                 if (err) {
//                     console.log(stmt)
//                     reject(err);
//                 } else {
//                     const stmt2: Statement = this.db.prepare(query2);
//                     stmt2.run(id, (err) => {
//                         stmt2.finalize();
//                         if (err) {
//                             console.log(stmt2)
//                             reject(err);
//                         } else {
//                             resolve();
//                         }
//                     }
//                     );
//                 }
//             });

//         }
//         );
//     }
// }

// export class PlatformDao extends DbEntities {
    
//         constructor() {
//             super();
//         }
    
//         async getPlatformsFromGameId(gameId: number): Promise<Platform[]> {
//             return new Promise((resolve, reject) => {
//                 const stmt: Statement = this.db.prepare('SELECT platforms.* FROM platforms JOIN game_platforms ON platforms.id = game_platforms.platform_id WHERE game_platforms.game_id = ?');
//                 stmt.all(gameId, (err, rows: pl[]) => {
//                     stmt.finalize();
//                     if (err) {
//                         console.log(stmt)
//                         reject(err);
//                     } else {
//                         resolve(rows.map(row => new Platform(row.platform.id, row.platform.slug, row.platform.name, new Date(row.released_at), row.requirements.minimum, row.requirements.recommended)));
//                     }
//                 }
//                 );

//             }

//             );
//         }


//             async createPlatform(platform: Platform, gameId: number): Promise<void> {
//                 return new Promise((resolve, reject) => {
//                     const query = `
//                         INSERT INTO platforms (
//                             id, slug, name, released_at, requirements_minimum, requirements_recommended
//                         ) VALUES (?,?,?,?,?,?);
//                     `;
//                     const query2 = `
//                         INSERT INTO game_platforms (
//                             platform_id, game_id
//                         ) VALUES (?,?);
//                     `;
//                     const stmt: Statement = this.db.prepare(query);
//                     const stmt2: Statement = this.db.prepare(query2);
//                     stmt.run(platform.id, platform.slug, platform.name, platform.released_at.toISOString(), platform.requirements.minimum, platform.requirements.recommended, (err) => {
//                         stmt.finalize();
//                         if (err) {
//                             console.log(stmt)
//                             reject(err);
//                         } else {
//                             stmt2.run(platform.id, gameId, (err) => {
//                                 stmt2.finalize();
//                                 if (err) {
//                                     console.log(stmt2)
//                                     reject(err);
//                                 } else {
//                                     resolve();
//                                 }
//                             });
//                         }
//                     });
//                 });
//             }

//             async deletePlatform(id: number): Promise<void> {
//                 return new Promise((resolve, reject) => {
//                     const query = `
//                         DELETE FROM game_platforms WHERE platform_id = ?;
//                     `;
//                     const query2 = `
//                         DELETE FROM platforms WHERE id = ?;
//                     `;
//                     const stmt: Statement = this.db.prepare(query);
//                     stmt.run(id, (err) => {
//                         stmt.finalize();
//                         if (err) {
//                             console.log(stmt)
//                             reject(err);
//                         } else {
//                             const stmt2: Statement = this.db.prepare(query2);
//                             stmt2.run(id, (err) => {
//                                 stmt2.finalize();
//                                 if (err) {
//                                     console.log(stmt2)
//                                     reject(err);
//                                 } else {
//                                     resolve();
//                                 }
//                             });
//                         }
//                     });
//                 });
//             }
//     }

const sequelize = new Sequelize({
    dialect: 'sqlite',
    // storage: `${DB_PATH}`,
    storage: 'db.sqlite',
    dialectModule: sqlite3,
    models: [__dirname + '/models']
})



try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

export default sequelize;

// interface GameAttributes {
//     path: string;
//     date_added: Date;
//     id: number;
//     slug: string;
//     name: string;
//     name_original?: string;
//     description?: string;
//     metacritic?: number;
//     released?: Date;
//     tba?: boolean;
//     updated?: Date;
//     background_image?: string;
//     background_image_additional?: string;
//     website?: string;
//     rating?: number;
//     rating_top?: number;
//     added?: number;
//     playtime?: number;
//     screenshots_count?: number;
//     movies_count?: number;
//     creators_count?: number;
//     achievements_count?: number;
//     parent_achievements_count?: string;
//     reddit_url?: string;
//     reddit_name?: string;
//     reddit_description?: string;
//     reddit_logo?: string;
//     reddit_count?: number;
//     twitch_count?: string;
//     youtube_count?: string;
//     reviews_text_count?: string;
//     ratings_count?: number;
//     suggestions_count?: number;
//     alternative_names?: string;
//     metacritic_url?: string;
//     parents_count?: number;
//     additions_count?: number;
//     game_series_count?: number;
// }

// type NoteCreationAttributes = Optional<GameAttributes, 'metacritic_url' | 'playtime' | 'website' | 'background_image_additional' >;

// export const Gamesss: ModelDefined<GameAttributes, NoteCreationAttributes> = sequelize.define('games', 
    
//     {
//         path: {
//             type: DataTypes.STRING,
//             primaryKey: true
//         },
//         date_added: {
//             type: DataTypes.DATE
//         },
//         id: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },
//         slug: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         name_original: {
//             type: DataTypes.STRING
//         },
//         description: {
//             type: DataTypes.TEXT
//         },
//         metacritic: {
//             type: DataTypes.INTEGER
//         },
//         released: {
//             type: DataTypes.DATE
//         },
//         tba: {
//             type: DataTypes.BOOLEAN
//         },
//         updated: {
//             type: DataTypes.DATE
//         },
//         background_image: {
//             type: DataTypes.STRING
//         },
//         background_image_additional: {
//             type: DataTypes.STRING
//         },
//         website: {
//             type: DataTypes.STRING
//         },
//         rating: {
//             type: DataTypes.FLOAT
//         },
//         rating_top: {
//             type: DataTypes.INTEGER
//         },
//         added: {
//             type: DataTypes.INTEGER
//         },
//         playtime: {
//             type: DataTypes.INTEGER
//         },
//         screenshots_count: {
//             type: DataTypes.INTEGER
//         },
//         movies_count: {
//             type: DataTypes.INTEGER
//         },
//         creators_count: {
//             type: DataTypes.INTEGER
//         },
//         achievements_count: {
//             type: DataTypes.INTEGER
//         },
//         parent_achievements_count: {
//             type: DataTypes.STRING
//         },
//         reddit_url: {
//             type: DataTypes.STRING
//         },
//         reddit_name: {
//             type: DataTypes.STRING
//         },
//         reddit_description: {
//             type: DataTypes.TEXT
//         },
//         reddit_logo: {
//             type: DataTypes.STRING
//         },
//         reddit_count: {
//             type: DataTypes.INTEGER
//         },
//         twitch_count: {
//             type: DataTypes.STRING
//         },
//         youtube_count: {
//             type: DataTypes.STRING
//         },
//         reviews_text_count: {
//             type: DataTypes.STRING
//         },
//         ratings_count: {
//             type: DataTypes.INTEGER
//         },
//         suggestions_count: {
//             type: DataTypes.INTEGER
//         },
//         alternative_names: {
//             type: DataTypes.TEXT
//         },
//         metacritic_url: {
//             type: DataTypes.STRING
//         },
//         parents_count: {
//             type: DataTypes.INTEGER
//         },
//         additions_count: {
//             type: DataTypes.INTEGER
//         },
//         game_series_count: {
//             type: DataTypes.INTEGER
//         },
//     },
//     {},

// );

// @Table
// export class Games extends Model {
//     @Column
//     declare path: string;

//     @Column
//     declare date_added: Date;

//     @Column
//     declare id: number;

//     @Column
//     declare slug: string;

//     @Column
//     declare name: string;

//     @Column
//     declare name_original: string;

//     @Column
//     declare description: string;

//     @Column
//     declare metacritic: number;

//     @Column
//     declare released: Date;

//     @Column
//     declare tba: boolean;

//     @Column
//     declare updated: Date;

//     @Column
//     declare background_image: string;

//     @Column
//     declare background_image_additional: string;

//     @Column
//     declare website: string;

//     @Column
//     declare rating: number;

//     @Column
//     declare rating_top: number;

//     @Column
//     declare added: number;

//     @Column
//     declare playtime: number;

//     @Column
//     declare screenshots_count: number;

//     @Column
//     declare movies_count: number;

//     @Column
//     declare creators_count: number;

//     @Column
//     declare achievements_count: number;

//     @Column
//     declare parent_achievements_count: string;

//     @Column
//     declare reddit_url: string;

//     @Column
//     declare reddit_name: string;

//     @Column
//     declare reddit_description: string;

//     @Column
//     declare  reddit_logo: string;

//     @Column
//     declare reddit_count: number;

//     @Column
//     declare twitch_count: string;

//     @Column
//     declare youtube_count: string;

//     @Column
//     declare reviews_text_count: string;

//     @Column
//     declare ratings_count: number;

//     @Column
//     declare suggestions_count: number;

//     @Column
//     declare alternative_names: string;

//     @Column
//     declare metacritic_url: string;

//     @Column
//     declare parents_count: number;

//     @Column
//     declare additions_count: number;

//     @Column
//     declare game_series_count: number;
// }

// export const Platforms = sequelize.define('platforms',
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true
//         },
//         slug: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         released_at: {
//             type: DataTypes.DATE
//         },
//         requirements_min: {
//             type: DataTypes.TEXT
//         },
//         requirements_recommended: {
//             type: DataTypes.TEXT
//         }
//     },
//     {}
// );

// export const EsrbRatings = sequelize.define('esrb_ratings',
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true
//         },
//         slug: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false
//         }
//     },
//     {}
// );

// export const EsrbRatingsGames = sequelize.define('esrb_ratings_games',
//     {
//         game_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             references: {
//                 model: 'games',
//                 key: 'id'
//             }
//         },
//         esrb_rating_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             references: {
//                 model: 'esrb_ratings',
//                 key: 'id'
//             }
//         }
//     },
//     {}
// );

// export const GamesPlatforms = sequelize.define('game_platforms',
//     {
//         game_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             references: {
//                 model: 'games',
//                 key: 'id'
//             }
//         },
//         platform_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             references: {
//                 model: 'platforms',
//                 key: 'id'
//             }
//         },
//         released_at: {
//             type: DataTypes.DATE
//         },
//         requirements_minimum: {
//             type: DataTypes.TEXT
//         },
//         requirements_recommended: {
//             type: DataTypes.TEXT
//         }
//     },
//     {}
// );

// export const Screenshots = sequelize.define('screenshots',
//     {
//         game_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             references: {
//                 model: 'games',
//                 key: 'id'
//             }
//         },
//         url: {
//             type: DataTypes.STRING,
//             primaryKey: true
//         }
//     },
//     {}
// );

// export const Tags = sequelize.define('tags',
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true
//         },
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         slug: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         language: {
//             type: DataTypes.STRING
//         },
//         games_count: {
//             type: DataTypes.INTEGER
//         }
//     },
//     {}
// )

// export const GamesTags = sequelize.define('game_tags',
//     {
//         game_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             references: {
//                 model: 'games',
//                 key: 'id'
//             }
//         },
//         tag_id: {
//             type: DataTypes.INTEGER,
//             primaryKey: true,
//             references: {
//                 model: 'tags',
//                 key: 'id'
//             }
//         }
//     },
//     {}
// )

// Games.sync();
// Platforms.sync();
// EsrbRatings.sync();
// EsrbRatingsGames.sync();
// GamesPlatforms.sync();
// Screenshots.sync();
// Tags.sync();
// GamesTags.sync();

