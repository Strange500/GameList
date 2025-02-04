import { BelongsTo, Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Games } from './Games';

@Table
export class Screenshots extends Model {
    @ForeignKey(() => Games)
    @Column({ primaryKey: true })
    declare path: string;

    @BelongsTo(() => Games)
    declare gameId: number;

    @Column({ primaryKey: true })
    declare ImagePath: string;

}
