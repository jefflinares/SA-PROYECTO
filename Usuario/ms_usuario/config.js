const dotenv = require('dotenv').config();

module.exports = {

    NODE_ENV: process.env.NODE_ENV || 'development',
    HOST: process.env.HOST || '0.0.0.0',
    PORT: process.env.PORT || 3389,
    DATABASE_HOST: process.env.DATABASE_HOST || '34.123.194.213',
    DATABASE_NAME: process.env.DATABASE_NAME || 'user_service',
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'root',
    DATABASE_PORT: process.env.DATABASE_PORT || '3306',
    DATABASE_USER: process.env.DATABASE_USER || 'root',
    
}