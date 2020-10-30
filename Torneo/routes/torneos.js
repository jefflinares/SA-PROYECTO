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

    //información de torneo tentativa 
    var objetoTorneo = {
        id:0,
        Juego: "example",
        TotalJugadores: 0, 
        Ganador: "empty"
    }

    if(verificacion == false){
        res.statusMessage = "Id de partida no válido";
        res.status(404).json(objetoJuego);
    }else{
        var idTorneo = Number(id);
        //aqui se debe hacer una búsqueda de los datos del juego en base de datos.
        var database = new db();
        var sql = 'SELECT * FROM TORNEO WHERE id =' + id;
        database.query(sql)
            .then(rows => {
                objetoTorneo.id = Number(rows[0].id);
                objetoTorneo.Juego = rows[0].Juego;
                objetoTorneo.TotalJugadores = rows[0].TotalJugadores;
                objetoTorneo.Ganador = rows[0].Ganador;
            }, err => {
                return database.close().then(() => {
                    throw err;
                })
            })
            .catch(err => {
                console.log(err);
                res.statusMessage = "Juego no encontrado";
                res.status(404).json(objetoTorneo);
            });
    }
});

router.post('/', function (req, res){
    var database = new db();

    var objetoTorneo = {
        id:0,
        Juego: "example",
        TotalJugadores: 0, 
        Ganador: "empty"
    };

    var torneo = req.body;
    console.log(req.body);

    var idTorneo = torneo.id;
    var juegoTorneo = torneo.juego;
    var totalJugadoresTorneo = torneo.totalJugadores;
    var ganadorTorneo = torneo.Ganador;

    if(idTorneo == undefined || juegoTorneo == undefined || totalJugadoresTorneo==undefined || ganadorTorneo == undefined){
        console.log("No se encontraron datos en la BD");
        res.statusMessage = "Datos incorrectos";
        res.status(406).json(objetoTorneo);
    }else{
        try{
            var query = database.query('INSERT INTO TORNEO(id, Juego, TotalJugadores, Ganador) VALUES(?,?,?, ?)', [idTorneo, juegoTorneo, totalJugadoresTorneo, ganadorTorneo] , function (error, result){
                if(error){
                    console.log("Error al insertar en la base de datos.");
                    res.statusMessage = "Datos icorrectos"
                    res.status(406).json(objetoTorneo);
                }});
        }
        catch(x){
            console.log("Excepción no controlada: "+ x);
            res.statusMessage = "Datos incorrectos";
            res.status(406).json(objetoTorneo);
            return;
        }

        var sql = 'SELECT ID FROM TORNEO WHERE Juego=\''+juegoTorneo+'\'';
        database.query(sql)
            .then(rows => {
                var num = Number(rows[0].id);
                console.log(num);
                objetoJuego.id = num;
                database.close();

                objetoTorneo.id = idTorneo;
                objetoTorneo.Juego = JuegoTorneo;
                objetoTorneo.TotalJugadores = totalJugadoresTorneo;
                objetoTorneo.Ganador = ganadorTorneo;
                res.status(201).json(objetoTorneo);

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

router.get('/test', (req, res) => {
    const data = {
        "Tipo": "TEST",
        "Microservicio":"Torneo prueba"
    };
    res.send(data);
  });

module.exports = router;

