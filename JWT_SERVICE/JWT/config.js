// config.js
const dotenv = require('dotenv').config();

module.exports = {

    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 5000,
    DADOS_SERVICE_ID:process.env.DADOS_SERVICE_ID || 'dados_',
    DADOS_SERVICE_SECRET:process.env.DADOS_SERVICE_SECRET || 'dados1234_',
    USERS_SERVICE_ID:process.env.USERS_SERVICE_ID || 'users',
    USERS_SERVICE_SECRET:process.env.USERS_SERVICE_SECRET || 'users1234',
    TORNEOS_SERVICE_ID: process.env.TORNEOS_SERVICE_ID || 'torneos_' ,
    TORNEOS_SERVICE_SECRET: process.env.TORNEOS_SERVICE_SECRET || 'torneos1234',
    JUEGOS_SERVICE_ID: process.env.JUEGOS_SERVICE_ID || 'juegos_' ,
    JUEGOS_SERVICE_SECRET: process.env.JUEGOS_SERVICE_SECRET || 'juegos1234',
    DATABASE_HOST: process.env.DATABASE_HOST || '127.0.0.1',
    DATABASE_NAME: process.env.DATABASE_NAME ||  'sa_' ,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'sa1234' 

}