var express = require('express');
var router = express.Router();
const path = require('path');
var db = require('./db.js');

//Routes
router.get('/', (req, res) => {
    var id = req.query.id;
    console.log(id);
    const regex = /^[0-9]*$/;
    const verificacion = regex.text(id);

    var objetoJuego = {
        id:0,
        Nombre: "example",
        IP: "0.0.0.0"
    }

    if(verificacion == false){
        res.statusMessage = "Id de partida no válido";
        res.status(404).json(objetoJuego);
    }else{
        var idPartida = Number(id);
        //aqui se debe hacer una búsqueda de los datos del juego en base de datos.
        var database = new db();
        var sql = 'SELECT * FROM JUEGOS WHERE id =' + id;
        database.query(sql)
            .then(rows => {
                objetoJuego.id = Number(rows[0].id);
                objetoJuego.Nombre = rows[0].Nombre;
                objetoJuego.IP = rows[0].IP;
            }, err => {
                return database.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
                console.log(err);
                res.statusMessage = "Juego no encontrado";
                res.status(404).json(objetoJuego);
            });
    }
});

router.post('/', function (req, res){
    var database = new db();

    var objetoJuego = {
        id: 0,
        Nombre: "example", 
        IP: "0.0.0.0"
    };

    var juego = req.body;
    console.log(req.body);

    var idJuego = juego.id;
    var nombreJuego = juego.Nombre;
    var IPJuego = juego.IP;

    if(idJuego == undefined || nombreJuego == undefined || IPJuego==undefined){
        console.log("No se encontraron datos en la BD");
        res.statusMessage = "Datos incorrectos";
        res.status(406).json(objetoJuego);
    }else{
        try{
            var query = database.query('INSERT INTO JUEGOS(id, Nombre, IP) VALUES(?,?,?)', [idJuego, nombreJuego, IPJuego] , function (error, result){
                if(error){
                    console.log("Error al insertar en la base de datos.");
                    res.statusMessage = "Datos icorrectos"
                    res.status(406).json(objetoJuego);
                }});
        }
        catch(x){
            console.log("Excepción no controlada: "+ x);
            res.statusMessage = "Datos incorrectos";
            res.status(406).json(objetoJuego);
            return;
        }

        var sql = 'SELECT ID FROM JUEGO WHERE Nombre=\''+nombreJuego+'\'';
        database.query(sql)
            .then(rows => {
                var num = Number(rows[0].id);
                console.log(num);
                objetoJuego.id = num;
                database.close();

                objetoJuego.id = idJuego;
                objetoJuego.Nombre = nombreJuego;
                objetoJuego.IP = IPJuego;
                res.status(201).json(objetoJuego);

            }, err => {
                return database.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
                console.log(err);
                res.statusMessage = "Datos no correctos.";
                res.status(406).json(objetoJuego);
            });
    }
});

module.exports = router;