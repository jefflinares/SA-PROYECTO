const config = require('../config');
var express = require('express');
var router = express.Router();
const path = require('path');
const token = require('../app').token;

router.post('/insertar', (req, res) => {

    //codigo para solicitar el token 
    //enviar id y secret para solicitar token
    var objetoUsuario = {
        id: 0,
        email: "usuario@usuario.com",
        nombre: "emtpy",
        apellido: "empty",
        password: "1234",
        administrador: false
    }

    var usuario = req.body;
    console.log(req.body);

    var id = 0;
    var email = usuario.email;
    var nombre = usuario.nombre;
    var apellido = usuario.apellido;
    var password = usuario.password;

    if(email == undefined || nombre == undefined || nombre == undefined || apellido == undefined || password == undefined){
        console.log("Datos de usuario no válidos");
        res.statusMessage = "Datos incorrectos";
        res.status(406).json(objetoUsuario);
    }else{

        var url = config.USERS_SERVICE_HOST + ":" + config.USERS_SERVICE_PORT + "/jugadores/";

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
                console.log("respuesta: "+respuesta.id);
            }catch(err){
                console.log(err);
            }
            return;
        }
    }
    req.send(text);
    }


    //Luego enviar el token al microservicio de usuarios con la información del formulario
    //id=0, email, nombre, apellido, password, administrador(true, false)  -> direccion /jugadores

    var data = {
        respuesta: "hola mundo"
    }
    console.log('obtener');
    res.send('hola mundo');
});

module.exports = router;