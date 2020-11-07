const config = require('../config');
var express = require('express');
var router = express.Router();
const path = require('path');
const token = require('../app').token;
var http = require('http');
var fs = require('fs');
var archivo;
var now = new Date();

const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

router.post('/insertar', (req, res) => {
    archivo += "\n[USUARIOS]:Entra POST de un nuevo usuario en usuarios/insertar | " + now.toLocaleTimeString();
    console.log("****************************************");
    console.log("[USUARIOS]:Ha ingresado un POST hacia usuarios/insertar ...");
    //codigo para solicitar el token 
    //enviar id y secret para solicitar token
    var objetoUsuario = {
        id: 0,
        email: "usuario@example.com",
        nombres: "empty",
        apellidos: "empty",
        password: "1234",
        administrador: false
    }

    var usuario = req.body;
    console.log("[USUARIOS]:POST de usuario con la siguiente información:");
    console.log(req.body);

    var id = 0;
    var email = usuario.email;
    var nombres = usuario.nombre;
    var apellidos = usuario.apellido;
    var password = usuario.password;
    var administrador = usuario.administrador;

    if(email == undefined || nombres == undefined || apellidos == undefined || password == undefined){
        console.log("[USUARIOS]:Datos de usuario no válidos: "+ email + "|"+nombres+"|"+apellidos+"|"+password);
        console.log("[USUARIOS]:STATUS 406");
        archivo += "\n[USUARIOS]:STATUS 406 DATOS INCORRECTOS| " + now.toLocaleTimeString();
        res.statusMessage = "Datos incorrectos";
        res.status(406).json(objetoUsuario);
    }else{

        //preparación de objeto json para el usuario
        console.log("[USUARIOS]:Datos válidos");
        archivo += "\n[USUARIOS]:DATOS CORRECTOS| " + now.toLocaleTimeString();
        objetoUsuario.email = email;
        objetoUsuario.nombres = nombres;
        objetoUsuario.apellidos = apellidos;
        objetoUsuario.administrador = administrador;
        console.log("asigna bien los paràmetros");
        //Luego enviar el token al microservicio de usuarios con la información del formulario
        //id=0, email, nombre, apellido, password, administrador(true, false)  -> direccion /jugadores
        var url = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/jugadores/";
    try{
        var req = new XMLHttpRequest();
        console.log("[USUARIOS]:Token obtenido => "+token);
        archivo += "\n[USUARIOS]:Se obtiene token => "+ token +"| " + now.toLocaleTimeString();
        req.open("POST",url);
        req.setRequestHeader('Authorization', 'Bearer ' + token);
        req.setRequestHeader('Content-Type', 'application/json',true);
    
        var text = JSON.stringify(objetoUsuario);
        var respuesta;
    
        req.onreadystatechange = function() {
            if(req.readyState == 4 && req.status == 201) { 
                //req.responseText;
                try{
                    respuesta = JSON.parse(req.responseText);
                    console.log("respuesta: " + respuesta.id);
                    console.log("[USUARIOS]:Usuario insertado exitosamente!");
                    archivo += "\n[USUARIOS]:Usuarios insertar exitosamente! | " + now.toLocaleTimeString();
                    console.log(text);
                    req.statusMessage("[USUARIOS]:Usuario insertado exitosamente!");
                    req.send(text);
                }catch(err){
                    console.log(err);
                }
                //return;
            }else{
                req.statusMessage("[USUARIOS]:Usuario insertado exitosamente!");
                req.status(400).json(objetoUsuario);
            }
        }
    }catch(x){
        console.log("[USUARIOS]:Error al comunicarse con el servicio de usuarios...");
        archivo += "\n[USUARIOS]:Error al comunicarse con el servicio de usuarios... | " + now.toLocaleTimeString();
        console.log(x);
    }
    }
    
});

//servicio para consumir el servicio GET /jugadores del microservicio de usuarios.
router.get('/listadoUsuarios', (req, res)=>{
    archivo += "\n[USUARIOS]:Solicitud GET de listado de usuarios en usuarios/listadoUsuarios | " + now.toLocaleTimeString();
    objetoUsuario = {
        id: 0,
        email: "user@example.com",
        nombres: "string",
        apellidos: "string",
        administrador: true
    }
    //URL del microservicio de usuarios
    var url = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/jugadores/";

    var req = new XMLHttpRequest();
    req.open("GET",url);
    req.setRequestHeader('Authorization', 'Bearer ' + token);
    req.setRequestHeader('Content-Type', 'application/json',true);
    
    var text = JSON.stringify(objetoUsuario);
    var respuesta;
    var totalUsuarios = 0;
    req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 200) { 
            //req.responseText;
            try{
                respuesta = JSON.parse(req.responseText);
                console.log("respuesta: " + respuesta);
                archivo += "\n[USUARIOS]:Respuesta de microservicio: "+ respuesta +" | " + now.toLocaleTimeString();
                totalUsuarios = obtenerTotal(respuesta);

            }catch(err){
                totalUsuarios = 0;
                console.log(err);
            }
            return totalUsuarios;
        }
    }
    //req.send(text);
    req.send(text);
});

//servicio para consumir el servicio GET /jugadores del microservicio de usuarios.
router.get('/totalUsuarios', (req, res)=>{
    archivo += "\n[USUARIOS]:GET del total de usuarios en usuarios/totalUsuarios| " + now.toLocaleTimeString();
    objetoUsuario = {
        id: 0,
        email: "user@example.com",
        nombres: "string",
        apellidos: "string",
        administrador: true
    }
    //URL del microservicio de usuarios
    var url = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/jugadores/";

    var req = new XMLHttpRequest();
    req.open("GET",url);
    req.setRequestHeader('Authorization', 'Bearer ' + token);
    req.setRequestHeader('Content-Type', 'application/json',true);
    
    var text = JSON.stringify(objetoUsuario);
    var respuesta;
    var totalUsuarios = 0;
    req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 200) { 
            //req.responseText;
            try{
                respuesta = JSON.parse(req.responseText);
                console.log("respuesta: " + respuesta);
                archivo += "\n[USUARIOS]:Listado de usuarios retornado exitosamente | " + now.toLocaleTimeString();
                totalUsuarios = obtenerTotal(respuesta);

            }catch(err){
                totalUsuarios = 0;
                archivo += "\n[USUARIOS]:Error en comunicación con BD | " + now.toLocaleTimeString();
                console.log(err);
            }
            return totalUsuarios;
        }
    }
    //req.send(text);
    req.send(totalUsuarios);
});

//servicio para consumir el servicio GET /jugadores del microservicio de usuarios.
router.get('/jugadores', (req, res)=>{
    archivo += "\n[USUARIOS]:GET de jugador por ID usuarios/jugadores/{id} | " + now.toLocaleTimeString();
    objetoUsuario = {
        id: 0,
        email: "user@example.com",
        nombres: "string",
        apellidos: "string",
        administrador: true
    }
    var idJugador = req.query.id;

    //URL del microservicio de usuarios
    var url = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/jugadores?id="+idJugador;
    console.log('url servicio GET Jugador: '+ url);

    var req = new XMLHttpRequest();
    req.open("GET",url);
    req.setRequestHeader('Authorization', 'Bearer ' + token);
    req.setRequestHeader('Content-Type', 'application/json',true);
    
    var text = JSON.stringify(objetoUsuario);
    var respuesta;
    var totalUsuarios = 0;
    req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 200) { 
            //req.responseText;
            try{
                respuesta = JSON.parse(req.responseText);
                console.log("jugador: " + respuesta);
            }catch(err){
                console.log(err);
                archivo += "\n[USUARIOS]:Error en ejecución de búsqueda de jugadores. | " + now.toLocaleTimeString();
            }
            return respuesta;
        }
    }
    req.send(text);
});

function obtenerTotal(usuarios){
    var totalUsuarios = Object.keys(usuarios).length;
    console.log('Total de Usuarios: ' + totalUsuarios);
    return totalUsuarios;
}
let actual = fs.readFileSync("torneosLog.txt").toString();
console.log("actual: "+actual);
fs.writeFileSync("torneosLog.txt", actual+archivo, "");
module.exports = router;