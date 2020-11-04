'user strict';

const mysql = require('mysql');
const config = require('../config');

class db {
    constructor() {
        this.connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'admin',
            database: 'bdtorneos',
            port: 3306,
            multipleStatements: true
        });
        
        this.connection.connect(
            function(error){
                try{
                    if(error){
                        console.log("Error al establecer la conexión con la BD -- " + error);
                    } else {
                        console.log("La conexión a la base de datos se realizó exitosamente");
                    }
                }catch(x){
                    console.log("Error al establecer conexión con la BD -- " + x);
                }
            }
        );

        //this.connection.end();
    }

    query(sql, args){
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if(err){
                    return reject(err);
                }else{
                    resolve(rows);
                }
            });
        });
    }

    close(){
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if(err){return reject(err)}
                else{resolve();}
            });
        });
    }
}

module.exports = db;