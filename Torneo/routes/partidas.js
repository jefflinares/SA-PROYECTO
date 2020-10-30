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

module.exports = router;