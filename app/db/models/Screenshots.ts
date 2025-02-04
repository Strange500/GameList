import { BeforeCreate, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Games } from './Games';
import { join } from 'path';
import { saveWebFile } from '../Utils';

@Table
export class Screenshots extends Model {
    @ForeignKey(() => Games)
    @Column({ primaryKey: true })
    declare path: string;

    @Column
    declare gameId: number;

    @Column({ primaryKey: true })
    declare ImagePath: string;


    @BeforeCreate
    static async saveScreenshot(instance: Screenshots) {
        console.log(instance.toJSON());
        const url = instance.ImagePath;
        const game = await Games.findOne({ where: { gameId: instance.gameId } });
        if (!game) {
            throw new Error('Game not found');
        }
        const fileName = instance.ImagePath.split('/').pop();
        if (!fileName) {
            throw new Error('Invalid file name');
        }
        const savePath = join(game.getScreenshotDirectory(), fileName);
        await saveWebFile(savePath, url);
        instance.ImagePath = `/games/${game.gameId}/screenshots/${fileName}`;
    }

}
