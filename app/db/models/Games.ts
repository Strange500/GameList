
import { Model, Column, Table, HasMany, DataType, BeforeCreate } from 'sequelize-typescript';
import { ReadableStream as WebReadableStream } from 'stream/web';
import stream from 'stream';


import fs from 'fs';
import { join } from 'path';
import { GAME_FOLDER_PATH, GAMES_PATH } from '../const';
import { RAWGIOAPI } from '../RawgApi';
import { Screenshots } from './Screenshots';




async function saveWebFile(savePath: string, url: string) {
    const writeStream = fs.createWriteStream(savePath);
    const readStream = await fetch(url);
    const nodeStream = stream.Readable.fromWeb(readStream.body as WebReadableStream<unknown>);
    stream.pipeline(nodeStream, writeStream, (err) => {
        if (err) {
            console.error('Pipeline failed:', err);
        } else {
        }
    });
}

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


    @BeforeCreate
    static async createGameDirectory(instance: Games) {
        fs.mkdirSync(instance.#getGamePath(), { recursive: true });
    }

    @BeforeCreate
    static async createGameScreenshotDirectory(instance: Games) {
        fs.mkdirSync(join(instance.#getGamePath(), 'screenshots'), { recursive: true });
    }



    @BeforeCreate
    static async saveBackgound(instance: Games) {
        if (instance.background_image) {
            const backgoundPath = instance.#getBackgoundPath();
            saveWebFile(backgoundPath, instance.background_image);
            instance.background_image = instance.getBackgroundPathPublicPath();
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





