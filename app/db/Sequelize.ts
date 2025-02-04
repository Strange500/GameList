// import sqlite3 from "sqlite3";
import pg from 'pg';

import { Sequelize } from 'sequelize-typescript';
import { Games, Screenshots } from "./models/Games";

const db_name = process.env.POSTGRES_DB ;
const db_user = process.env.POSTGRES_USER 
const db_password = process.env.POSTGRES_PASSWORD;

if (!db_name || !db_user || !db_password) {
    throw new Error('Database credentials not set');
}

export const sequelize = new Sequelize(db_name, db_user, db_password, {
    dialect: 'postgres',
    // storage: `${DB_PATH}`,
    // storage: 'db.sqlite',
    dialectModule: pg,
    models: [__dirname + '/models'],
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    retry: {
        max: 10
    }
})



try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


sequelize.addModels([Games, Screenshots]);


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

