
import { Model, Column, Table, HasMany, DataType, BeforeCreate, AfterCreate } from 'sequelize-typescript';


import fs from 'fs';
import { join } from 'path';
import { GAME_FOLDER_PATH, GAMES_PATH } from '../const';
import { RAWGIOAPI } from '../RawgApi';
import { Screenshots } from './Screenshots';
import { saveWebFile } from '../Utils';





@Table
export class Games extends Model {
    @Column({ primaryKey: true })
    declare path: string;

    @Column
    declare date_added: Date;

    @Column
    declare gameId: number;

    @Column
    declare slug: string;

    @Column
    declare name: string;

    @Column
    declare name_original: string;

    @Column(DataType.TEXT)
    declare description: string;

    @Column
    declare metacritic: number;

    @Column
    declare released: Date;

    @Column
    declare tba: boolean;

    @Column
    declare updated: Date;

    @Column
    declare background_image: string;

    @Column
    declare background_image_additional: string;

    @Column
    declare website: string;

    @Column(DataType.DOUBLE)
    declare rating: number;

    @Column
    declare rating_top: number;

    @Column
    declare added: number;

    @Column
    declare playtime: number;

    @Column
    declare screenshots_count: number;

    @Column
    declare movies_count: number;

    @Column
    declare creators_count: number;

    @Column
    declare achievements_count: number;

    @Column
    declare parent_achievements_count: string;

    @Column
    declare reddit_url: string;

    @Column
    declare reddit_name: string;

    @Column
    declare reddit_description: string;

    @Column
    declare  reddit_logo: string;

    @Column
    declare reddit_count: number;

    @Column
    declare twitch_count: string;

    @Column
    declare youtube_count: string;

    @Column
    declare reviews_text_count: string;

    @Column
    declare ratings_count: number;

    @Column
    declare suggestions_count: number;

    // @Column({ type: DataType.ARRAY(DataType.STRING) })
    // declare alternative_names: string[];

    @Column
    declare metacritic_url: string;

    @Column
    declare parents_count: number;

    @Column
    declare additions_count: number;

    @Column
    declare game_series_count: number;

    @HasMany(() => Screenshots)
    declare screenshots: Screenshots[];


    declare gamePath: string;

    #getGamePath() {
        return join(GAME_FOLDER_PATH, this.gameId.toString());
    }


    #getBackgoundPath() {
        return join(this.#getGamePath(), 'background.jpg');
    }

    getBackgroundPathPublicPath() {
        return join('/games', this.gameId.toString(), 'background.jpg');
    }

    getScreenshotDirectory() {
        return join(this.#getGamePath(), 'screenshots');
    }

    async getAllScreenshotsURI(): Promise<string[] | null> {
        const srs = await Screenshots.findAll({ where: { gameId: this.gameId } });
        if (srs.length === 0) {
            return null;
        }
        const uris = srs.map(sr => sr.ImagePath);
        return uris;
    }

    async getAllRelatedImages() {
        const images = [];
        images.push(this.getBackgroundPathPublicPath());
        images.push(this.background_image);
        const screenshots = await  this.getAllScreenshotsURI();
        if (screenshots) {
            images.push(...screenshots);
        }
        return [...new Set(images)];
    }


    @BeforeCreate
    static async createGameDirectory(instance: Games) {
        fs.mkdirSync(instance.#getGamePath(), { recursive: true });
    }

    @BeforeCreate
    static async createGameScreenshotDirectory(instance: Games) {
        fs.mkdirSync(instance.getScreenshotDirectory(), { recursive: true });
    }



    @BeforeCreate
    static async saveBackgound(instance: Games) {
        if (instance.background_image) {
            const backgoundPath = instance.#getBackgoundPath();
            saveWebFile(backgoundPath, instance.background_image);
            instance.background_image = instance.getBackgroundPathPublicPath();
        }
    }

    @AfterCreate
    static async saveScreenshots(instance: Games) {
            const screenshots = await RAWGIOAPI.getScreenshotsForGame(instance.gameId);
            for (const screenshot of screenshots) {
                await Screenshots.build({
                    path: instance.path,
                    gameId: instance.gameId,
                    ImagePath: screenshot,
                }).save();
            }
    }


    static async refreshGamesList() {
    
        const currentGames = await Games.findAll();
    
        return new Promise<void>((resolve, reject) => {
            fs.readdir(GAMES_PATH, async (err, files) => {
                if (err) {
                    console.error('Error reading game folder:', err);
                    reject(err);
                    return;
                }
    
                try {
                    for (const file of files) {
                        const path = join(GAMES_PATH, file);
                        const stat = fs.statSync(path);
                        const pathExists = await Games.findOne({ where: { path: file } });
    
                        if (!pathExists && stat.isDirectory()) {
                            const games = await RAWGIOAPI.findByTitle(file);
                            if (games.length > 0) {
                                const fullGame = await RAWGIOAPI.getGameDetails(games[0].gameId);
                                fullGame.path = file;
                                await fullGame.save();
                            }
                        }
                    }
    
                    for (const game of currentGames) {
                        if (!fs.existsSync(join(GAMES_PATH, game.path))) {
                            await game.destroy();
                        }
                    }
    
                    resolve();
                } catch (error) {
                    console.error('Error processing games:', error);
                    reject(error);
                }
            });
        });
        
           
        }

    static async changeGameId(path: string, newId: number) {
        const newGame = await RAWGIOAPI.getGameDetails(newId);
        const oldGame = await Games.findOne({ where: { path: path } });
        if (!oldGame) {
            console.error('Game not found');
            return;
        }
        newGame.path = path;
        await oldGame.destroy();
        await newGame.save();

    }


  

}





