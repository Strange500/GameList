import pg from 'pg';

import { Sequelize } from 'sequelize-typescript';
import { Games } from "./models/Games";
import { Screenshots } from './models/Screenshots';

const db_name = process.env.POSTGRES_DB || 'gamelist';
const db_user = process.env.POSTGRES_USER  || 'gamelist';
const db_password = process.env.POSTGRES_PASSWORD || '1234';

const db_host = process.env.POSTGRES_HOST || 'db';

if (!db_name || !db_user || !db_password || !db_host) {
    console.error('Missing environment variables');

}

export const sequelize = new Sequelize(db_name, db_user, db_password, {
    dialect: 'postgres',
    dialectModule: pg,
    models: [__dirname + '/models'],
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    retry: {
        max: 10
    },
    host: db_host,
})



try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
    sequelize.addModels([Games, Screenshots]);
    sequelize.sync();

} catch (error) {
    console.error('Unable to connect to the database:', error);
}



