import pg from 'pg';

import { Sequelize } from 'sequelize-typescript';
import { Games } from "./models/Games";
import { Screenshots } from './models/Screenshots';

const db_name = process.env.POSTGRES_DB ;
const db_user = process.env.POSTGRES_USER 
const db_password = process.env.POSTGRES_PASSWORD;

if (!db_name || !db_user || !db_password) {
    throw new Error('Database credentials not set');
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
    }
})



try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}


sequelize.addModels([Games, Screenshots]);

