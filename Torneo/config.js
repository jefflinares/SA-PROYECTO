// config.js
const dotenv = require('dotenv').config();

module.exports = {

    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3000,
    USERS_SERVICE_HOST: process.env.USERS_SERVICE_HOST || "172.26.0.1",
    USERS_SERVICE_PORT: process.env.USERS_SERVICE_PORT || 3000,
    TORNEOS_SERVICE_ID: process.env.TORNEOS_SERVICE_ID || "torneos",
    TORNEOS_SERVICE_SECRET: process.env.TORNEOS_SERVICE_SECRET || "torneos1234",
    JUEGOS_SERVICE_HOST: process.env.JUEGOS_SERVICE_HOST || "192.168.1.1",
    JUEGOS_SERVICE_PORT: process.env.JUEGOS_SERVICE_PORT || 3000,
    DATABASE_HOST: process.env.DATABASE_HOST || "35.236.61.119",//"localhost",
    DATABASE_NAME: process.env.DATABASE_NAME || "BDTORNEOS",
    DATABASE_USER: process.env.DATABASE_USER || "root",
    DATABASE_PORT: process.env.DATABASE_PORT || 3306,
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || "admin", //"torneos1234",
    JWT_SERVICE_HOST: process.env.JWT_SERVICE_HOST || "172.26.0.1",
    JWT_SERVICE_PORT: process.env.JWT_SERVICE_PORT || 3000

}