var express = require('express');
var router = express.Router();
const path = require('path');
var db = require('./db.js');

router.put('/', function (req, res) {
    var id = req.query.id;
    const regex = /^[0-9]*$/;
    const verificacion = regex.test(id);

    var objectPartida = {
        id : 0,
        marcador :  0        
    };

    if(verificacion == false){
        res.statusMessage = "El id de partida es incorrecto";
        res.status(406).json(objectPartida);
    }else{
        var idPartida = Number(id);
        var partida = req.body; //json con los datos de partida
        var marcadorPartida = partida.marcador;

        var database = new db();
        var sql = 'UPDATE PARTIDA SET MARCADOR = ? WHERE ID = ?'
        var args = [marcadorPartida, idPartida];

        try{
            var query = database.query(sql, args, function(error, result){
                if(error){
                    console.log(error);
                    res.statusMessage = "Partida no encontrada";
                    res.status(404).json(objectPartida);
                }
            });

            objectPartida.id = idPartida;
            objectPartida.marcador = marcadorPartida;
            res.statusMessage = "Partida Actualizada";
            res.status(201).json(objectPartida);
        }
        catch(x){
            console.log(x);
            res.statusMessage = "Partida no encontrada";
            res.status(404).json(objectPartida);
        }
    }
});

//servicio para crear nuevas partidas
router.post('/', function (req, res){
    var database = new db();

    var objectPartida = {
        id : 0,
        marcador : 0
    };

    var partida = req.body;
    console.log(req.body);

    var idPartida = partida.id;
    var marcadorPartida = partida.marcador;

    if(idPartida == undefined || marcadorPartida == undefined){
        console.log("Datos incorrectos de partida nueva");
        res.statusMessage = "Datos incorrectos de partida nueva";
        res.status(406).json(objectPartida);
    }else{
        //Codigo para guardar los datos de la nueva partida en la BD
        try{
            var query = database.query('INSERT INTO PARTIDA(ID, MARCADOR) VALUES(?, ?)', [idPartida, marcadorPartida], function(error, result){
                if(error){
                  console.log("Error al insertar partida nueva en DB ");
                  res.statusMessage="Datos Invalidos";
                  res.status(406).json(objectPartida);
                }});
        }catch(x){
            console.log("Error en insersión de partida nueva: "+x);
            res.statusMessage="Datos Invalidos";
            res.status(406).json(objectPartida);
            return;
        }
    }
});


router.get('/obtenerJuegos', (req, res) => {
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

//funcion para generar el uuid para la partida
function crear_uuid(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


module.exports = router;