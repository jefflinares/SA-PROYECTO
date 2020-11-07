const dotenv = require('dotenv').config();

module.exports = {

    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || '127.0.0.1',
    PORT: process.env.PORT || 3001,
    DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
    DATABASE_NAME: process.env.DATABASE_NAME || 'user_service',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'sa1234',
    DATABASE_PORT: process.env.DATABASE_PORT || '3306',
    DATABASE_USER: process.env.DATABASE_USER || 'root',
    
}