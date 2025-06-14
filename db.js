import { createPool } from 'mysql2/promise'
import { Sequelize } from 'sequelize';
import{ DB_HOST, DB_TYPE, DB_PORT, DB_DATABASE, DB_USER, DB_PASSWORD } from './config.js'

export const pool = createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    port: DB_PORT,
    database: DB_DATABASE
})

export const sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: DB_TYPE,
    port: DB_PORT
});