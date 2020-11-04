'user strict';
var config =require('../config')
const mysql = require('mysql');

class Db {
    constructor() {
        this.connection = mysql.createConnection({
            host: config.DATABASE_HOST,
            user: config.DATABASE_USER,
            password: config.DATABASE_PASSWORD,
            database: config.DATABASE_NAME,
            port: config.DATABASE_PORT
        });
        this.connection.connect(function(error){
            try{ 
                //si error es true mandamos el mensaje de error
                if(error){ 
 
                    console.log("Error al establecer la conexión a la BD -- " + error); 
 
                //conexión exitosa, en este punto ya hemos establecido la conexión a base de datos
                }else{  
                    console.log("La conexion a la base de datos se realizo con exito"); 
                    //code  necessary
                } 
            }
            catch(x){ 
                console.log("Error al conectar con la bd:" + x); 
            } 
         });
    }
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

module.exports = Db;
