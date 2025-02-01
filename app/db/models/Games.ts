import { Model, Column, Table, HasMany, ForeignKey, DataType, BelongsTo } from 'sequelize-typescript';
import "../dao.ts"
import sequelize from "@/app/db/dao"; 

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

    @Column
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

    @Column
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
}



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
sequelize.addModels([Games, Screenshots]);


