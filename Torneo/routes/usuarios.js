const config = require('../config');
var express = require('express');
var router = express.Router();
const path = require('path');
const token = require('../app').token;
var http = require('http');

//const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

router.post('/insertar', (req, res) => {

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
    console.log(req.body);

    var id = 0;
    var email = usuario.email;
    var nombres = usuario.nombre;
    var apellidos = usuario.apellido;
    var password = usuario.password;

    if(email == undefined || nombres == undefined || apellidos == undefined || password == undefined){
        console.log("Datos de usuario no válidos");
        res.statusMessage = "Datos incorrectos";
        res.status(406).json(objetoUsuario);
    }else{

        //preparación de objeto json para el usuario
        objetoUsuario.email = email;
        objetoUsuario.nombres = nombres;
        objetoUsuario.apellidos = apellidos;
        objetoUsuario.administrador = administrador;

        //Luego enviar el token al microservicio de usuarios con la información del formulario
        //id=0, email, nombre, apellido, password, administrador(true, false)  -> direccion /jugadores
        var url = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/jugadores/";

    var req = new XMLHttpRequest();
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
            }catch(err){
                console.log(err);
            }
            return;
        }
    }
    req.send(text);
    }
});

//servicio para consumir el servicio GET /jugadores del microservicio de usuarios.
router.get('/listadoUsuarios', (req, res)=>{
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
                totalUsuarios = obtenerTotal(respuesta);

            }catch(err){
                totalUsuarios = 0;
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
    objetoUsuario = {
        id: 0,
        email: "user@example.com",
        nombres: "string",
        apellidos: "string",
        administrador: true
    }
    var idJugador = req.query.id;

    //URL del microservicio de usuarios
    var url = "http://"+config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/jugadores/"+idJugador;
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

module.exports = router;