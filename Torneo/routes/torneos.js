var express = require('express');
var router = express.Router();
const path = require('path');
var db = require('./db.js');
const config = require('../config');
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
        var sql = 'SELECT * FROM TORNEOS WHERE id =' + id;
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

router.post('/crear', function (req, res){
    var database = new db();
    var fechaActual = new Date();
    console.log(fechaActual);

    var objetoTorneo = {
        id:0,
        Nombre: "example",
        Fecha: "00-00-00"
    };

    var torneo = req.body;
    console.log(req.body);

    var Nombre = torneo.Nombre;
    //var fechaTorneo = torneo.Fecha;

    if(Nombre == undefined){
        console.log("No se encontraron datos en la BD");
        res.statusMessage = "Datos incorrectos";
        res.status(406).json(objetoTorneo);
    }else{
        try{
            var query = database.query('INSERT INTO BDTORNEOS.TORNEOS(NOMBRE) VALUES(?)', [Nombre] , function (error, result){
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

        var sql = 'SELECT ID, FECHA FROM BDTORNEOS.TORNEOS WHERE NOMBRE=\''+Nombre+'\'';
        database.query(sql)
            .then(rows => {
                var num = rows[0].ID;
                var fecha = rows[0].FECHA;
                console.log(num);
                objetoTorneo.id = num;
                database.close();

                objetoTorneo.id = num;
                objetoTorneo.Nombre = Nombre;
                objetoTorneo.Fecha = fecha;
                res.status(201).json(objetoTorneo);

            }, err => {
                return database.close().then(() => {
                    throw err;
                })
            })
            // .catch(err => {
            //     console.log(err);
            //     res.statusMessage = "Datos no correctos.";
            //     res.status(406).json(objetoJuego);
            // });
    }
});

//SERVICIO PARA LISTAR LOS TORNEOS CREADOS
router.get('/listarTorneos', (req, res)=>{
    var objetoTorneo = {
        id:0,
        Nombre: "example",
        Fecha: "00-00-00"
    };

    var database = new db();
        var sql = 'SELECT * FROM BDTORNEOS.TORNEOS';
        database.query(sql)
            .then(rows => {
                var num = rows[0].ID;
                var fecha = rows[0].FECHA;
                console.log(num);
                objetoTorneo.id = num;
                database.close();

                var i = 0;
                var ID = "";
                var NOMBRE = "";
                var FECHA = "";
                var jsonListado = '';
                var tabla = "";
                
                if (rows[0]!=null){
                    //se crean los encabezados de la tabla
                    tabla = "<table border=1>"+
                            "<tr>"+
                                "<th>ID</th>"+
                                "<th>Torneo</th>"+
                                "<th>Fecha</th>"+
                            "</tr>";
                    for(i = 0; i< rows.length; i++){
                        console.log("For i: "+i);
                        tabla +=    "<tr>"+
                                        "<td>"+rows[i].ID+"</td>"+
                                        "<td>"+rows[i].NOMBRE+"</td>"+
                                        "<td>"+rows[i].FECHA+"</td>"+
                                    "</tr>";
                                    ID = rows[i].ID;
                                    NOMBRE = rows[i].NOMBRE;
                                    FECHA = rows[i].FECHA;
                                    jsonListado += "{ id:"+ID+", Nombre:" + NOMBRE + ", Fecha:" + FECHA + "} ,";
                    }
                    var objetoListado = { Torneos: '' };
                    objetoListado.Juegos = JSON.stringify(jsonListado.replace("\"", ''));
                    tabla += "</table>";
                    console.log(tabla);
                    console.log(jsonListado);
                    console.log("-------------------");
                    console.log(JSON.stringify(jsonListado));

                    console.log("Status 201");
                    var pagina = retornaPagina(tabla);
                    //res.send(tabla);
                    res.send(pagina);
                }
                // objetoTorneo.id = num;
                // objetoTorneo.Nombre = Nombre;
                // objetoTorneo.Fecha = fecha;
                // res.status(201).json(objetoTorneo);
            }, err => {
                return database.close().then(() => {
                    throw err;
                })
            })
});

//servicio para empezar la simulación de un nuevo torneo
router.put('/empezarTorneo', (req, res)=>{
    var respuesta = {
        Torneo: 0,
        ID_Jugador:0,
        Nombre_Jugaor: "empty"
    }
    var objetoTorneo = {
        ID: 0,
        NOMBRE: "empty",
        FECHA: "00-00-00"
    }

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

    var id = req.query.id;
    console.log(id);
    const regex = /^[0-9]*$/;
    const verificacion = regex.text(id);

    if(verificacion == false){
        res.statusMessage = "Id de partida no válido";
        res.status(404).json(objetoJuego);
    }else{
        var idTorneo = Number(id);
        //aqui se debe hacer una búsqueda de los datos del juego en base de datos.
        var database = new db();
        var sql = 'SELECT * FROM TORNEOS WHERE id =' + id;
        var existe = false;
        database.query(sql)
            .then(rows => {
                objetoTorneo.ID = rows[0].ID;
                objetoTorneo.NOMBRE = rows[0].NOMBRE;
                objetoTorneo.FECHA = rows[0].FECHA;
                existe = true;
            }, err => {
                return database.close().then(() => {
                    existe = false;
                    throw err;
                })
            })
        //si la consulta retorna un torneo se obtendrá el id
        if (existe == true){
            var idTorneoEmpezado = objetoTorneo.ID;

            //se consumirá el servicio de usuarios para obtener el total de usuarios.
            //URL del microservicio de usuarios
            var url = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/totalUsuarios/";
            var req = new XMLHttpRequest();
            req.open("GET",url);
            var totalUsuarios = 0;

            try{
                console.log("Total de Usuarios: " + req.responseText);
                totalUsuarios = req.responseText;

            }catch(err){
                totalUsuarios = 0;
                console.log(err);
            }

            //si la cantidad de usuarios en listado es mayor que cero, se procede a definir las partidas.
            if (totalUsuarios > 0){
                var urlJugador = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/jugadores/";
                var cantidadLlaves = Number(totalUsuarios) / 2;
                var cantidadRondas = totalRondas(totalUsuarios);
                var jugador1 = 0;
                var jugador2 = 0;

                if(cantidadRondas>0){
                    //se hará un ciclo para crear una partida por cada llave
                    var i = 0;
                    var j = 0;
                    var idJugador1;
                    var jugador1;
                    var idJugador2;
                    var jugador2;
                    for(i=0; i<cantidadRondas-1; i++){
                        for(j=0; j<cantidadLlaves; j++){
                            //se solicita al jugador 1 llamando un random
                            idJugador1 = jugadorRandom(totalUsuarios);
                            //se consume el servicio de usuarios para traer la informaciòn del jugador1
                            req.open("GET",urlJugador+idJugador1);
                            req.onreadystatechange = function() {
                                if(req.readyState == 4 && req.status == 200) { 
                                    //req.responseText;
                                    try{
                                        jugador1 = JSON.parse(req.responseText);
                                        console.log("jugador1: " + jugador1);
                                    }catch(err){
                                        console.log(err);
                                    } 
                                }
                            }
                            req.close();

                            //se obtiene el id de jugador 2 para la partida
                            idJugador2 = jugadorRandom(totalUsuarios);
                            //mientras el id2 sea igual al de id jugador 1 se seguirà solicitando un nùmero hasta que sea distinto
                            while(idJugador2 == idJugador1){
                                idJugador2 = jugadorRandom(totalUsuarios);
                            }

                            //se consume el servicio de usuarios para traer la informaciòn del jugador1
                            req.open("GET",urlJugador+idJugador2);
                            req.onreadystatechange = function() {
                                if(req.readyState == 4 && req.status == 200) { 
                                    //req.responseText;
                                    try{
                                        jugador2 = JSON.parse(req.responseText);
                                        console.log("jugador1: " + jugador2);
                                    }catch(err){
                                        console.log(err);
                                    }
                                    
                                }
                            }
                            req.close();
                            //ya que se tienen los dos jugadores, se procederá a crear la partida.
                            //Para este punto ya se cuenta con el id de Torneo, Jugador1, Jugador2
                            //Pendiente: hacer función para obtener id de juego random
                            var urlTotalJuegos = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/getTotalJuegos";
                            var urlIpJuego = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/getJuego/";
                            var totalJugadoresTorneo;
                            var idJuegoTorneo;
                            var IpJuegoTorneo;

                            //se obtiene el total de juegos para seleccionar un juego al azar
                            req.open("GET",urlTotalJuegos);
                            req.onreadystatechange = function() {
                                    //req.responseText;
                                try{
                                    totalJugadoresTorneo = req.responseText;
                                    console.log("[JUEGOS]:Total de juegos registrados: " + totalJugadoresTorneo);
                                }catch(err){
                                    console.log(err);
                                } 
                            }
                            req.close();
                            //Se verifica si el total de torneos es mayor a cero para elegir un id de juego.
                            if (totalJugadoresTorneo > 0){
                                idJuegoTorneo = juegoRandom(totalJugadoresTorneo);
                            }else{
                                idJuegoTorneo = 0;
                            }
                            
                            //Se consume el servicio para traer la IP de un juego especifico
                            req.open("GET",urlIpJuego);
                            req.onreadystatechange = function() {
                                    //req.responseText;
                                try{
                                    IpJuegoTorneo = req.responseText
                                    console.log("[JUEGOS]:IP del juego seleccionado para la partida: " + IpJuegoTorneo);
                                }catch(err){
                                    console.log(err);
                                } 
                            }
                            req.close();

                            if(IpJuegoTorneo == undefined){
                                IpJuegoTorneo = "0.0.0.0";
                            }

                            //para este punto ya tenemos: 
                            // -> ID Jugador1
                            // -> ID Jugador2
                            // -> ID de Torneo
                            // -> IP del juego 

                            //Ahora se procede a generar la partida del torneo 
                            //Primero se debe obtener un uuid para la partida a crear
                            var urlUuid = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/getUuid";
                            var uuidPartida; 
                            req.open("GET",urlUuid);
                            req.onreadystatechange = function() {
                                    //req.responseText;
                                try{
                                    uuidPartida = req.responseText
                                    console.log("[PARTIDA]:UUID => "+uuidPartida);
                                    console.log("[PARTIDA]:Se generó el uuid de la partida exitosamente");
                                }catch(err){
                                    console.log(err);
                                } 
                            }
                            req.close();

                            if(uuidPartida == undefined){
                                uuidPartida = "xxxxx-xxxxx-xxxxx";
                            }

                            //se prepara el JSON que se enviará al servicio de partidas
                            objetoPartida.uuid = uuidPartida;
                            objetoPartida.jugador1 = jugador1.ID;
                            objetoPartida.jugador2 = jugador2.ID;
                            objetoPartida.ip_juego = IpJuegoTorneo;
                            objetoPartida.estado = "Creada";
                            objetoPartida.ganador = "empty";
                            objetoPartida.idTorneo = idTorneoEmpezado;
                            
                            var respuesta;
                            var urlCrearPartida = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/crearPartida";
                            req.open("POST", urlCrearPartida);
                            let jsonDataPartida = JSON.stringify(objetoPartida);
                            req.onreadystatechange = function() {
                                if(req.readyState == 4 && req.status == 201) { 
                                    //req.responseText;
                                    try{
                                        respuesta = JSON.parse(req.responseText);
                                        console.log("respuesta: " + respuesta.id);
                                    }catch(err){
                                        console.log(err);
                                    }
                                    return;
                                }
                            }
                            //Se envia el json con los datos de la partida a crear y se asigna la respuesta al objeto partida.
                            objetoPartida = req.send(jsonDataPartida);
                            console.log("[PARTIDA]:Partida creada exitosamente con la siguiente información: ");
                            console.log(objetoPartida);
                        }

                        //Aqui se realizarà la lògica de jugar la partida y obtener al ganador.
                        
                        //se recalcula la cantidad de llaves
                        cantidadLlaves = Number(cantidadLlaves)/2;
                    }
                }else{
                    console.log('No  hay suficientes usuarios para crear un torneo');
                }
            }
        }
    }

});

router.get('/test', (req, res) => {
    const data = {
        "Tipo": "TEST",
        "Microservicio":"Torneo prueba"
    };
    res.send(data);
  });

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
    pagina += "<a href='http://"+ config.HOST +":"+ config.PORT+"/torneos'>Torneos</a>";
    pagina += "</li>";
    pagina += "</ul>";
    pagina += "</div>";
    pagina += "</nav>";
    pagina += "<div class='jumbotron'  style='padding:40px;'>";
    pagina += "<h1>Gestor de Torneos</h1>";
    pagina += "<p>Enhorabuena. A continuación se muestra un listado de los torneos disponibles: </p>";
    pagina += tabla;
    pagina += "<p><a class='btn btn-primary btn-lg' href='http://"+config.HOST+":"+config.PORT+"/torneos' role='button'>Volver</a></p>";
    pagina += "</div>";
    pagina += "</div>";
    pagina += "</body>";
    pagina += "</html>";
    console.log('.....................................................................');
    console.log(pagina);
    console.log('.....................................................................');
    console.log('');
    return pagina;
}

//devuelve el id de un jugador random
function jugadorRandom(total){
    var t = Number(total);
    var aleatorio = Math.round(Math.random()*t);
    return aleatorio;
}

//Devuelve el id de un juego random
function juegoRandom(total){
    var t = Number(total);
    var aleatorio = Math.round(Math.random()*t);
    return aleatorio;
}

//calcula el total de rondas en base a la cantidad de jugadores
function totalRondas(totalUsuarios){
    var rondas = 0;
    var llaves = 0;
    var i = 0;
    llaves = totalUsuarios;
    while(i!=1){
        llaves = Number(llaves)/2;
        if(llaves!=1){
            rondas++;
        } else if(llaves<1){
            return rondas;
        }
    }
    return rondas;
}
module.exports = router;

