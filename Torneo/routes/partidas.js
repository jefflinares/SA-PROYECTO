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
router.post('/crearPartida', function (req, res){
    var database = new db();

    var objetoPartida = {
        id : 0,
        uuid : "xxxxx-xxxxx-xxxxx",
        jugador1: "emtpy",
        jugador2: "empty",
        ip_juego: "0.0.0.0",
        estado: "no iniciado",
        ganador: "ninguno",
        idTorneo: "0",
        fechaCreacion: "00-00-00", 
        fechaJugado: "00-00-00"
    }

    var partida = req.body;
    console.log(req.body);

    var uuidPartida = partida.uuid;
    var jugador1Partida = partida.jugador1;
    var jugador2Partida = partida.jugador2;
    var ip_juegoPartida = partida.ip_juego;
    var estadoPartida = partida.estado;
    var ganadorPartida = partida.ganador;
    var idtorneoPartida = partida.idTorneo;
    var fechaCreacionPartida = partida.fechaCreacion;
    var fechaJugadoPartida = partida.fechaJugado;


    if(uuidPartida == undefined || jugador1Partida == undefined || jugador2Partida == undefined || ip_juegoPartida == undefined || estadoPartida == undefined || idtorneoPartida == undefined || jugador1Partida == undefined){
        console.log("Datos incorrectos de partida nueva");
        res.statusMessage = "Datos incorrectos de partida nueva";
        res.status(406).json(objectPartida);
    }else{
        //Codigo para guardar los datos de la nueva partida en la BD
        try{
            var query = database.query('INSERT INTO DBTORNEOS.PARTIDAS(UUID, JUGADOR1, JUGADOR2, IP_JUEGO, ESTADO, GANADOR, ID_TORNEO) VALUES(?,?,?,?,?,?,?)', [uuidPartida, jugador1Partida, jugador2Partida, ip_juegoPartida, estadoPartida, ganadorPartida, idtorneoPartida], function(error, result){
                if(error){
                  console.log("Error al insertar partida nueva en DB ");
                  res.statusMessage="Datos Invalidos";
                  res.status(406).json(objetoPartida);
                }});
        }catch(x){
            console.log("Error en insersión de partida nueva: "+x);
            res.statusMessage="Datos Invalidos";
            res.status(406).json(objetoPartida);
            return;
        }

        var sql = 'SELECT * FROM BDTORNEOS.PARTIDAS WHERE UUID=\''+uuidPartida+'\'';
        database.query(sql)
            .then(rows => {
                var num = rows[0].ID;
                console.log("[PARTIDA]:Partida creada exitosamente");
                console.log(rows);
                database.close();

                objetoPartida.id = num;
                objetoPartida.uuid = uuidPartida;
                objetoPartida.jugador1 = jugador1Partida;
                objetoPartida.jugador2 = jugador2Partida;
                objetoPartida.ip_juego = ip_juegoPartida;
                objetoPartida.estado = estadoPartida;
                objetoPartida.ganador = ganadorPartida;
                objetoPartida.idTorneo = idtorneoPartida;
                objetoPartida.fechaCreacion = fechaCreacionPartida;
                objetoPartida.fechaJugado = fechaJugadoPartida;

                console.log('[PARTIDA]:Status:201');
                console.log(objetoPartida);
                //req.body.mensaje = "Exito";
                res.status(201).json(objetoPartida);  
            }, err => {
                console.log("esta mostrando el error de intentar consultar el id de juego");
                return database.close().then(() => {
                    throw err;
                })
            })
    }
});


router.get('/getUuid', (req, res) => {
    console.log('entro al servicio uuid');
    var respuesta = {
        id: 0,
        uuid: 'xxxxx-xxxxx-xxxxx'
    }
    try{
            console.log('entro al try');
            var uuid1 = crear_uuid();
            console.log('ya asignó el uuid');
            
            respuesta.uuid = uuid1;
            res.statusMessage = 'UUID Generado';
            console.log("[PARTIDA]: Se generó el uuid de la partida");
            res.send(respuesta.uuid);


    }catch(x){
        console.log('entro en la exception');
            res.statusMessage = 'No entro a la creación de uuid';
            res.status(406).json(respuesta);
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