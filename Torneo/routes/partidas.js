var express = require('express');
var router = express.Router();
var regex = require('regex');
var fs = require('fs');
const validator = require('validator');
const path = require('path');
var db = require('./db.js');
const config = require('../config');
var archivo;
var now = new Date();

router.put('/', (req, res) =>{
    //codigo temporal solo para probar servicio de partidas/{id}
    archivo += "\n[PARTIDAS]:PUT de Partida para modificar el marcador partidas/ | " + now.toLocaleTimeString();
    console.log("Entra a Actualizar");
    var actualizaPartida = req.body;
    console.log(req.query.id);
    console.log(req.body);
    var id = req.query.id;
    var verificacion = validator.isUUID(id);
    console.log("[PARTIDAS]:Verificación: " + verificacion);
    archivo += "\n[PARTIDAS]:Verificando uuid de partida | " + now.toLocaleTimeString();
    //----------------------------------
    //var verificacion = validator.isUUID(id);

    var objectPartida = {
        id : 0,
        marcador :  0        
    };

    if(verificacion == false){
        res.statusMessage = "El id de partida es incorrecto";
        archivo += "\n[PARTIDAS]:UUID incorrecto | " + now.toLocaleTimeString();
        console.log("[PARTIDAS]:El id de partida es incorrecto");
        res.status(406).json(objectPartida);
    }else{
        archivo += "\n[PARTIDAS]:UUID validado correctamente | " + now.toLocaleTimeString();
        var idPartida = id;
        var partida = req.body; //json con los datos de partida
        var marcadorPartida = partida.Marcador;
        console.log("[PARTIDAS]:ID DE PARTIDA -> "+ idPartida);
        console.log("[PARTIDAS]:Marcador de partida -> "+ marcadorPartida);
        var database = new db();
        var sql = 'UPDATE BDTORNEOS.PARTIDAS SET GANADOR = ? WHERE UUID = ?'
        var args = [marcadorPartida, idPartida];

        try{
            var query = database.query(sql, args, function(error, result){
                if(error){
                    console.log(error);
                    res.statusMessage = "Partida no encontrada";
                    archivo += "\n[PARTIDAS]:Partida no encontrada | " + now.toLocaleTimeString();
                    res.status(404).json(objectPartida);
                }
            });

            objectPartida.id = idPartida;
            objectPartida.marcador = marcadorPartida;
            res.statusMessage = "Partida Registrada Correctamente";
            archivo += "\n[PARTIDAS]:Partida registrada correctamente | " + now.toLocaleTimeString();
            console.log("[PARTIDAS]:Status 201");
            console.log("[PARTIDAS]:Partida Registrada Correctamente");
            res.status(201).json(objectPartida);
        }
        catch(x){
            console.log(x);
            res.statusMessage = "Partida no encontrada";
            archivo += "\n[PARTIDAS]:Partida no encontrada | " + now.toLocaleTimeString();
            res.status(404).json(objectPartida);
        }
    }
});

//servicio para crear nuevas partidas
router.post('/crearPartida', (req, res) => {
    archivo += "\n[PARTIDAS]:POST para crear partida | " + now.toLocaleTimeString();
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
        ronda: 0,
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
    var rondaPartida = partida.ronda;
    var fechaCreacionPartida = partida.fechaCreacion;
    var fechaJugadoPartida = partida.fechaJugado;

    console.log("uuid:"+ partida.uuid);

    if(uuidPartida == undefined || jugador1Partida == undefined || jugador2Partida == undefined || ip_juegoPartida == undefined || estadoPartida == undefined || idtorneoPartida == undefined || jugador1Partida == undefined || rondaPartida == undefined){
        console.log("Datos incorrectos de partida nueva");
        archivo += "\n[PARTIDAS]:Datos incorrectos de partida | " + now.toLocaleTimeString();
        res.statusMessage = "Datos incorrectos de partida nueva";
        res.status(406).json(objetoPartida);
    }else{
        //Codigo para guardar los datos de la nueva partida en la BD
        try{
            var query = database.query('INSERT INTO BDTORNEOS.PARTIDAS(UUID, JUGADOR1, JUGADOR2, IP_JUEGO, ESTADO, GANADOR, ID_TORNEO, RONDA) VALUES(?,?,?,?,?,?,?, ?)', [uuidPartida, jugador1Partida, jugador2Partida, ip_juegoPartida, estadoPartida, ganadorPartida, idtorneoPartida, rondaPartida], function(error, result){
                if(error){
                  console.log("Error al insertar partida nueva en DB ");
                  res.statusMessage="Datos Invalidos";
                  res.status(406).json(objetoPartida);
                }});
        }catch(x){
            console.log("Error en insersión de partida nueva: "+x);
            archivo += "\n[PARTIDAS]:Error en partida nueva | " + now.toLocaleTimeString();
            res.statusMessage="Datos Invalidos";
            res.status(406).json(objetoPartida);
            return;
        }

        var sql = 'SELECT * FROM BDTORNEOS.PARTIDAS WHERE UUID=\''+uuidPartida+'\'';
        database.query(sql)
            .then(rows => {
                var num = rows[0].ID;
                console.log("[PARTIDA]:Partida creada exitosamente");
                archivo += "\n[PARTIDAS]:Partida creada exitosamente | " + now.toLocaleTimeString();
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
                objetoPartida.ronda = rondaPartida;
                objetoPartida.fechaCreacion = rows[0].FECHA_CREACION;
                objetoPartida.fechaJugado = rows[0].FECHA_JUGADO;

                console.log('[PARTIDA]:Status:201');
                archivo += "\n[PARTIDAS]:STATUS 201 | " + now.toLocaleTimeString();
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
    archivo += "\n[PARTIDAS]:GET de nuevo uuid para partida nueva  | " + now.toLocaleTimeString();
    console.log('entro al servicio uuid');
    var respuesta = {
        id: 0,
        uuid: 'xxxxx-xxxxx-xxxxx'
    }
    try{
            var uuid1 = crear_uuid();
            
            respuesta.uuid = uuid1;
            res.statusMessage = 'UUID Generado';
            console.log("[PARTIDA]: Se generó el uuid de la partida");
            archivo += "\n[PARTIDAS]:Se generó el UUID para la nueva partida | " + now.toLocaleTimeString();
            res.send(respuesta.uuid);


    }catch(x){
        console.log('entro en la exception');
            res.statusMessage = 'No entro a la creación de uuid';
            res.status(406).json(respuesta);
    }
    
});

router.get('/validarJugadorPartida', (req, res)=>{
    var database = new db();

    var objetoValidar = {
        jugador1: 0,
        ronda: 0,
        valido: false
    }

    var partida = req.body;
    console.log(req.body);

    var jugador1Partida = partida.id; 
    var rondaPartida = partida.ronda;
    var validoPartida = false;


    if(jugador1Partida == undefined || rondaPartida == undefined){
        console.log("Datos incorrectos de partida nueva");
        res.statusMessage = "Datos incorrectos de validación de juegador para nueva partida";
        res.status(406).json(objetoValidar);
    }else{
        var sql = 'SELECT * FROM BDTORNEOS.PARTIDAS WHERE RONDA=\''+rondaPartida+'\' AND JUGADOR1='+jugador1Partida+' OR JUGADOR2='+jugador1Partida;
        console.log("query: "+sql);
        database.query(sql)
            .then(rows => {
                
                console.log("[PARTIDA]:Consulta jugador asignado a partida");
                console.log(rows);
                database.close();

                objetoValidar.jugador1 = jugador1Partida;
                objetoValidar.ronda = rondaPartida;
                objetoValidar.valido = false;
                console.log('[PARTIDA]:Status:201');
                console.log(objetoValidar);

                if(objetoValidar.jugador1 != 0){
                    //indicar que jugador ya aparece asignado en una partida
                    res.send(false);
                }else{
                    //indica que el jugador no se encontró por lo tanto es válido para ser asignado.
                    res.send(true);
                }
            
            }, err => {
                console.log("esta mostrando el error de intentar consultar el id de juego");
                return database.close().then(() => {
                    throw err;
                })
            })
    }
});

router.get('/obtenerPartidas', (req, res)=>{
    archivo += "\n[PARTIDAS]:GET que devuelve todas las partidas | " + now.toLocaleTimeString();
    var database = new db();
    var partida = req.body;

    var idRonda = partida.ronda;
    var idTorneo = partida.idTorneo;
    console.log("[PARTIDAS]:JSON => "+ JSON.stringify(partida));

    if(idRonda == undefined){
        console.log("[PARTIDAS]:Datos incorrectos de partida registrada");
        archivo += "\n[PARTIDAS]:Datos incorrectos de partida | " + now.toLocaleTimeString();
        res.statusMessage = "Datos incorrectos de validación de juegador para nueva partida";
        res.send("Datos Incorrectos");
    }else{
        var sql = 'SELECT * FROM BDTORNEOS.PARTIDAS WHERE RONDA='+idRonda + ' AND ID_TORNEO='+idTorneo;
        database.query(sql)
            .then(rows => {
                
                console.log("[PARTIDA]:Consulta partidas asignadas a un mismo torneo");
                console.log(rows);
                database.close();

                console.log('[PARTIDA]:Status:201');
                archivo += "\n[PARTIDAS]:STATUS 201| " + now.toLocaleTimeString();
                res.status(201).json(rows);
            }, err => {
                console.log("[PARTIDA]:esta mostrando el error de intentar consultar el id de juego");
                return database.close().then(() => {
                    throw err;
                })
            })
    }
});

router.get('/obtenerJuegos', (req, res) => {
    archivo += "\n[PARTIDAS]:GET para obtener juegos | " + now.toLocaleTimeString();
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

router.get('/listarPartidas', (req, res)=>{
    archivo += "\n[PARTIDAS]:GET para listar todas las partidas desde interfaz | " + now.toLocaleTimeString();
    console.log("[PARTIDAS]:Listando todas las partidas creadas...");
    var database = new db();
        var sql = 'SELECT * FROM BDTORNEOS.PARTIDAS';
        database.query(sql)
            .then(rows => {
                database.close();

                var i = 0;
                var ID = "";
                var UUID = "";
                var JUGADOR1 = "";
                var JUGADOR2 = '';
                var IP_JUEGO = '';
                var ESTADO = '';
                var GANADOR = '';
                var ID_TORNEO = '';
                var RONDA = '';
                var FECHA_CREACION = '';
                var FECHA_JUGADO = '';
                var tabla = "";
                var pagina;
                if (rows[0]!=null){
                    //se crean los encabezados de la tabla
                    tabla = "<table border=1>"+
                            "<tr>"+
                                "<th>ID</th>"+
                                "<th>UUID</th>"+
                                "<th>JUGADOR1</th>"+
                                "<th>JUGADOR2</th>"+
                                "<th>IP</th>"+
                                "<th>ESTADO</th>"+
                                "<th>GANADOR</th>"+
                                "<th>ID_TORNEO</th>"+
                                "<th>RONDA</th>"+
                                "<th>FECHA_CREACION</th>"+
                                "<th>FECHA_JUGADO</th>"+
                            "</tr>";
                    for(i = 0; i< rows.length; i++){
                        //console.log("For i: "+i);
                        tabla +=    "<tr>"+
                                        "<td>"+rows[i].ID+"</td>"+
                                        "<td>"+rows[i].UUID+"</td>"+
                                        "<td>"+rows[i].JUGADOR1+"</td>"+
                                        "<td>"+rows[i].JUGADOR2+"</td>"+
                                        "<td>"+rows[i].IP_JUEGO+"</td>"+
                                        "<td>"+rows[i].ESTADO+"</td>"+
                                        "<td>"+rows[i].GANADOR+"</td>"+
                                        "<td>"+rows[i].ID_TORNEO+"</td>"+
                                        "<td>"+rows[i].RONDA+"</td>"+
                                        "<td>"+rows[i].FECHA_CREACION+"</td>"+
                                        "<td>"+rows[i].FECHA_JUGADO+"</td>"+
                                    "</tr>";
                    }
                    tabla += "</table>";
                    //console.log(tabla);
                    console.log("-------------------");
                    console.log("[Partidas]:Status 201");
                    archivo += "\n[PARTIDAS]:STATUS 201 | " + now.toLocaleTimeString();
                    pagina = retornaPagina(tabla);
                    //res.send(tabla);
                    res.send(pagina);
                }else{
                    console.log("[PARTIDAS]:No se encontraron registros de partidas creadas en BD.");
                    tabla = "<table border=1>"+
                            "<tr>"+
                                "<th>ID</th>"+
                                "<th>UUID</th>"+
                                "<th>JUGADOR1</th>"+
                                "<th>JUGADOR2</th>"+
                                "<th>IP</th>"+
                                "<th>ESTADO</th>"+
                                "<th>GANADOR</th>"+
                                "<th>ID_TORNEO</th>"+
                                "<th>RONDA</th>"+
                                "<th>FECHA_CREACION</th>"+
                                "<th>FECHA_JUGADO</th>"+
                            "</tr>"+
                            "</table>"+
                            "<span>No hay registros de partidas creadas</span>"
                            ;
                    pagina = retornaPagina(tabla);
                    res.send(pagina);
                }
            }, err => {
                return database.close().then(() => {
                    throw err;
                })
            })
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



function retornaPagina(tabla){
    var pagina = "";
    pagina += "<!DOCTYPE html>";
    pagina += "<html lang='en'>";
    pagina += "<head>";
    pagina += "<meta charset='UTF-8'>";
    pagina += "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
    pagina += "<meta http-equiv='X-UA-Compatible' content='ie=edge'>";
    pagina += "<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js'></script>";
    pagina += "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css'>";
    pagina += "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap-theme.min.css'>";
    pagina += "<script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js'></script>";
    pagina += "</head>";
    pagina += "<body>";
    pagina += "<div style='margin:100px;'>";
    pagina += "<nav class='navbar navbar-inverse navbar-static-top'>";
    pagina += "<div class='container'>";
    pagina += "<a class='navbar-brand' href='http://"+ config.HOST +":"+ config.PORT+"/'>MS TORNEOS</a>";
    pagina += "<ul class='nav navbar-nav'>";
    pagina += "<li class='active'>";
    pagina += "<a href='http://"+ config.HOST +":"+ config.PORT+"/partidas'>Partidas</a>";
    pagina += "</li>";
    pagina += "</ul>";
    pagina += "</div>";
    pagina += "</nav>";
    pagina += "<div class='jumbotron'  style='padding:40px;'>";
    pagina += "<h1>Gestor de Torneos</h1>";
    pagina += "<p>Enhorabuena. A continuación se muestra un listado de los partidas disponibles: </p>";
    pagina += tabla;
    pagina += "<p><a class='btn btn-primary btn-lg' href='http://"+config.HOST+":"+config.PORT+"/partidas' role='button'>Volver</a></p>";
    pagina += "</div>";
    pagina += "</div>";
    pagina += "</body>";
    pagina += "</html>";
    console.log('.....................................................................');
    //console.log(pagina);
    console.log('.....................................................................');
    console.log('');
    return pagina;
}

let actual = fs.readFileSync("torneosLog.txt").toString();
console.log("actual: "+actual);
fs.writeFileSync("torneosLog.txt", actual+archivo, "");

module.exports = router;