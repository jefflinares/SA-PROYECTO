var mysql = require("mysql");

const config = require("../config");

function DataBaseHandler() {
    this.connection = null;
}

DataBaseHandler.prototype.createConnection = function () {

    console.log("HOST:",config.DATABASE_HOST);
    this.connection = mysql.createConnection({
        host: config.DATABASE_HOST || 'db',
        user: 'root',
        password: config.DATABASE_PASSWORD || 'sa1234',
        database: config.DATABASE_NAME || 'sa',
	    port: 3306
    });

    this.connection.connect(function (err) {
        if (err) {
            console.error("error connecting " + err.stack);
            return null;
        }
        console.log("connected as id " + this.threadId);
    });
    return this.connection;
};

module.exports = DataBaseHandler;