var express = require('express');
var router = express.Router();
const path = require('path');
const bodyParser = require('body-parser');
var db = require('./db.js');
var config = require('../config');
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

router.post('/registrar', function (req, res){
    var database = new db();

    var objetoJuego = {
        id: 0,
        Nombre: "example", 
        IP: "0.0.0.0"
    };

    var juego = req.body;
    console.log(req.body);

    //var idJuego = juego.id;
    var nombreJuego = juego.Nombre;
    var IPJuego = juego.IP;

    console.log("Nombre de juego: "+juego.Nombre);
    console.log("IP de juego: "+juego.IP);

    if(nombreJuego == undefined || IPJuego==undefined){
        console.log("No se encontraron datos en la BD");
        res.statusMessage = "Datos incorrectos";
        res.status(406).json(objetoJuego);
    }else{
        try{
            console.log("Entro a codigo para realizar la insersión");
            var query = database.query('INSERT INTO BDTORNEOS.JUEGOS(Nombre, IP) VALUES(?,?)', [nombreJuego, IPJuego] , function (error, result){
                if(error){
                    console.log("Error al insertar en la base de datos.");
                    res.statusMessage = "Datos icorrectos"
                    res.status(406).json(objetoJuego);
                }else{
                    console.log("--------------Dato insertado correctamente---------------------");
                }});
        }
        catch(x){
            console.log("Excepción no controlada: "+ x);
            res.statusMessage = "Datos incorrectos";
            res.status(406).json(objetoJuego);
            return;
        }
        console.log("-------està intentando consultar el id de juego creado");
        var sql = 'SELECT ID FROM BDTORNEOS.JUEGOS WHERE NOMBRE=\''+nombreJuego+'\'';
        database.query(sql)
            .then(rows => {
                var num = Number(rows[0].ID);
                console.log("----------respuesta de insersion-----------------");
                console.log(rows);
                console.log("id de juego retornado: "+ rows[0].ID);
                console.log(num);
                objetoJuego.id = num;
                database.close();

                objetoJuego.id = num;
                objetoJuego.Nombre = nombreJuego;
                objetoJuego.IP = IPJuego;
                console.log('Status:201');
                console.log(objetoJuego);
                req.body.mensaje = "Exito";
                console.log(req.body.mensaje);
                res.status(201).json(objetoJuego);
                //res.send('<script>alert("Juego Almacenado Exitosamente")</script>');
                
                
            }, err => {
                console.log("esta mostrando el error de intentar consultar el id de juego");
                return database.close().then(() => {
                    throw err;
                })
            })
    }
});

//ruta para listar todos los juegos que han sido registrados en el sistema
router.get('/listar', (req, res) => {
    var objetoJuego = {
        id:0,
        Nombre: "example",
        IP: "0.0.0.0"
    }
    
    
    //aqui se debe hacer una búsqueda de los datos del juego en base de datos.
    var database = new db();
    var sql = 'SELECT * FROM BDTORNEOS.JUEGOS';
    try{
        database.query(sql)
        .then(rows => {
            objetoJuego.id = Number(rows[0].ID);
            objetoJuego.Nombre = rows[0].NOMBRE;
            objetoJuego.IP = rows[0].IP;

            var i = 0;
            var ID = "";
            var NOMBRE = "";
            var IP = "";
            var jsonListado = '';
            var tabla = "";
            if (rows[0]!=null){
                //se crean los encabezados de la tabla
                tabla = "<table border=1>"+
                        "<tr>"+
                            "<th>ID</th>"+
                            "<th>Juego</th>"+
                            "<th>IP</th>"+
                        "</tr>";
                for(i = 0; i< rows.length; i++){
                    console.log("For i: "+i);
                    tabla +=    "<tr>"+
                                    "<td>"+rows[i].ID+"</td>"+
                                    "<td>"+rows[i].NOMBRE+"</td>"+
                                    "<td>"+rows[i].IP+"</td>"+
                                "</tr>";
                                ID = rows[i].ID;
                                NOMBRE = rows[i].NOMBRE;
                                IP = rows[i].IP;
                                jsonListado += "{ id:"+ID+", Nombre:" + NOMBRE + ", IP:" + IP + "} ,";
                }
                var objetoListado = { Juegos: '' };
                objetoListado.Juegos = JSON.stringify(jsonListado.replace("\"", ''));
                tabla += "</table>";
                console.log(tabla);
                console.log(jsonListado);
                console.log("-------------------");
                console.log(JSON.stringify(jsonListado));

                //res.statusMessage = "Listado de Juegos Encontrado";
                //res.status(201).json(objetoListado);
                console.log("Status 201");
                var pagina = retornaPagina(tabla);
                //res.send(tabla);
                res.send(pagina);
            }
        }, err => {
            return database.close().then(() => {
                throw err;
            })
        })
        // .catch(err => {
        //     console.log(err);
        //     res.statusMessage = "Error al intentar retornar la información de juegos de la BD";
        //     res.status(404).json(objetoJuego);
        // });
    }catch(x){
        console.log(x);
        res.statusMessage = "Error al ejecutar la consulta en la BD";
        res.status(404).json(objetoJuego);
    }
});

//función para traer la ip de un juego especifico por ID
router.get('/getJuego', (req, res)=>{
    var id = req.query.ID;
    const regex = /^[0-9]*$/;
    const verificacion = regex.text(id);
    console.log('[JUEGOS]:Se solicita la IP del juego con ID:'+id);
    var objetoJuego = {
        id:0,
        Nombre: "example",
        IP: "0.0.0.0"
    }

    if(verificacion == false){
        console.log('[JUEGO]:Id de juego no válido');
        res.statusMessage = "Id de juego no válido";
        res.status(404).json(objetoJuego);
    }else{
        var idJuego = Number(id);
        //aqui se debe hacer una búsqueda de los datos del juego en base de datos.
        var database = new db();
        var sql = 'SELECT * FROM DBTORNEOS.JUEGOS WHERE ID =' + id;
        database.query(sql)
            .then(rows => {
                objetoJuego.id = Number(rows[0].ID);
                objetoJuego.Nombre = rows[0].NOMBRE;
                objetoJuego.IP = rows[0].IP;
                console.log("Status 201");
                req.status(201).text(objetoJuego.IP);
                res.send(objetoJuego.IP);

            }, err => {
                return database.close().then(() => {
                    throw err;
                })
            })
    }
});

//función para traer el total de juegos registrados
router.get('/getTotalJuegos', (req, res)=>{
    console.log('[JUEGOS]:Se solicita el total de juegos');
    var totalJuegos = 0;
    try{
        //aqui se debe hacer una búsqueda de los datos del juego en base de datos.
        var database = new db();
        var sql = 'SELECT COUNT(*) AS TOTAL FROM DBTORNEOS.JUEGOS';
        database.query(sql)
            .then(rows => {
                totalJuegos = rows[0].TOTAL;
                console.log("[JUEGOS]:Status 201");
                console.log("[JUEGOS]:Total de juegos: "+totalJuegos);
                res.send(totalJuegos);

            }, err => {
                return database.close().then(() => {
                    throw err;
                })
            })
    }catch(x){
        console.log('[JUEGOS]:Error al intentar consultar el total de juegos');
        console.log(x);
        res.send(totalJuegos);
    }
});

router.get('/uuid', (any, res) => {
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
            res.status(201).json(respuesta);


    }catch(x){
        console.log('entro en la exception');
            res.statusMessage = 'No entro a la creación de uuid';
            res.status(406).json(respuesta);
    }
    
});

function listarJuegos(){
    var objetoJuego = {
        id:0,
        Nombre: "example",
        IP: "0.0.0.0"
    }
    
    
    //aqui se debe hacer una búsqueda de los datos del juego en base de datos.
    var database = new db();
    var sql = 'SELECT * FROM BDTORNEOS.JUEGOS';
    try{
        database.query(sql)
        .then(rows => {
            objetoJuego.id = Number(rows[0].ID);
            objetoJuego.Nombre = rows[0].NOMBRE;
            objetoJuego.IP = rows[0].IP;

            var i = 0;
            var ID = "";
            var NOMBRE = "";
            var IP = "";
            var jsonListado = '';
            var tabla = "";
            if (rows[0]!=null){
                //se crean los encabezados de la tabla
                tabla = "<table border=1>"+
                        "<tr>"+
                            "<th>ID</th>"+
                            "<th>Juego</th>"+
                            "<th>IP</th>"+
                        "</tr>";
                for(i = 0; i< rows.length; i++){
                    console.log("For i: "+i);
                    tabla +=    "<tr>"+
                                    "<td>"+rows[i].ID+"</td>"+
                                    "<td>"+rows[i].NOMBRE+"</td>"+
                                    "<td>"+rows[i].IP+"</td>"+
                                "</tr>";
                                ID = rows[i].ID;
                                NOMBRE = rows[i].NOMBRE;
                                IP = rows[i].IP;
                                jsonListado += "{ id:"+ID+", Nombre:" + NOMBRE + ", IP:" + IP + "} ,";
                }
                var objetoListado = { Juegos: '' };
                objetoListado.Juegos = JSON.stringify(jsonListado.replace("\"", ''));
                tabla += "</table>";
                console.log(tabla);
                console.log(jsonListado);
                console.log("-------------------");
                console.log(JSON.stringify(jsonListado));

                //res.statusMessage = "Listado de Juegos Encontrado";
                //res.status(201).json(objetoListado);
                return tabla;
            }
        }, err => {
            return database.close().then(() => {
                throw err;
            })
        })
        // .catch(err => {
        //     console.log(err);
        //     res.statusMessage = "Error al intentar retornar la información de juegos de la BD";
        //     res.status(404).json(objetoJuego);
        // });
    }catch(x){
        console.log(x);
        console.log("Error al ejecutar la consulta en la BD");
        console.log("status 404");
        //res.status(404).json(objetoJuego);
    }
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
    pagina += "<a href='http://"+ config.HOST +":"+ config.PORT+"/juegos'>Juegos</a>";
    pagina += "</li>";
    pagina += "</ul>";
    pagina += "</div>";
    pagina += "</nav>";
    pagina += "<div class='jumbotron'  style='padding:40px;'>";
    pagina += "<h1>Gestor de Juegos</h1>";
    pagina += "<p>Enhorabuena. A continuación se muestra un listado de los juegos disponibles: </p>";
    pagina += tabla;
    pagina += "<p><a class='btn btn-primary btn-lg' href='http://"+config.HOST+":"+config.PORT+"/juegos' role='button'>Volver</a></p>";
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

module.exports = router;