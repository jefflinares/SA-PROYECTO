// config.js
const dotenv = require('dotenv').config();

module.exports = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    DADOS_SERVICE_HOST: process.env.DADOS_SERVICE_HOST,
    DADOS_SERVICE_PORT: process.env.DADOS_SERVICE_PORT,
    USERS_SERVICE_HOST: process.env.USERS_SERVICE_HOST,
    USERS_SERVICE_PORT: process.env.USERS_SERVICE_PORT,
    TORNEOS_SERVICE_HOST: process.env.TORNEOS_SERVICE_HOST,
    TORNEOS_SERVICE_PORT: process.env.TORNEOS_SERVICE_PORT,
    JUEGOS_SERVICE_ID: process.env.JUEGOS_SERVICE_ID ,
    JUEGOS_SERVICE_SECRET: process.env.JUEGOS_SERVICE_SECRET ,
    JWT_SERVICE_HOST: process.env.JWT_SERVICE_HOST,
    JWT_SERVICE_PORT: process.env.JWT_SERVICE_PORT,
    HOST: process.env.HOST,
    PORT: process.env.PORT,
    DATABASE_HOST: process.env.DATABASE_HOST,
    DATABASE_NAME: process.env.DATABASE_NAME,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    MSG_TOKEN_AUTENTICACION:"Es necesario el token de autenticación",
    MSG_TOKEN_INVALIDO:"El token es inválido",
}