var express = require('express');
var router = express.Router();
const lib = require('../src/lib');
const config = require('../config');
const juego = require('../src/juego');
const querystring = require('querystring');
const DataBaseHandler = require('../db/mysql-con');
const mysql_lib = require("../db/mysql-lib");
const url = require('url');
const { response } = require('express');
const { connect } = require('http2');

var connection = null;
function conectar(){
    try{
      if(!connection)
      {
        var dataBaseHandler = new DataBaseHandler();
        connection = dataBaseHandler.createConnection();
        return true;
      }
    }catch(erro)
    {
        console.log(erro);
        return false;
    }
}


var token = null;



/* GET home page. */
router.get('/', async function(req, res, next) {

  
  if(token === null){
    try {
      token = await lib.getToken();
      res.render('login', { title: 'Express' , message : {error:null, succes: 'Bienvenido'} });
    } catch (error) {
      res.render('login', { title: 'Express' , message : {error:'Error al intentar obtener el Token', succes: null} });
      //return next(error);      
    }

  }
  else{
    //VERIFICAR QUE EL TOKEN SEA VALIDO
    try {
      token = await lib.refrescarToken(token);
      res.render('login', { title: 'Express' , message : {error:null, succes: 'Bienvenido'} });
    } catch (error) {
      //next(error);
      res.render('login', { title: 'Express' , message : {error:'Error al intentar refrescar el Token', succes: null} });
    }
  }
});





router.post('/signin', async function(req, res, next) {
  
  let email = req.body.email;
  let password = req.body.password;

  if(email && password)
  {
    let url_ = 'http://'+config.USERS_SERVICE_HOST+":"+config.USERS_SERVICE_PORT+"/login"
    const parameters = {
      email: email,
      password: password
    }

    const post_data = querystring.stringify(parameters);

    url_ += "?"+post_data;

    const options = {
      headers: {"Authorization" : `Bearer ${token}`}
    };

      
    

    let response = null;
    try {
      response = await lib.makeGetPetition(url_, null, options);
    } catch (error) {
      //console.log('Error')  ;
    }

    let user_info = null;
    if(response)
    {
      switch(response.status)
      {
        case 200:
          user_info = response.data;
          console.log('inicio de sesión válido: ');
          break;
        case 400:
          console.log('MS - Usuarios 400 -> Usuario o contraseña no válidos');
          break;
        default:
          console.log(response.data);
          break;
      }
    }else{

    }
  
    //TRAER LOS JUEGOS DESDE ACA DE UNA 
    res.redirect(url.format(
      {
        pathname: 'http://'+config.HOST+":"+config.PORT+"/juegos/"+user_info.id,
      }
      ));
    //res.render('juegos', {juegos: []});
  }else{
    res.render('login', { title: 'Express' , message : {error:'Usuario o contraseña inválidos', succes: null} });
  }

  
});



router.post('/generar', async function(req, res, next) {
  let peticion = "GENERAR (POST) "+String(new Date());
  var token = req.headers['authorization']     
  if(!token){         
      res.status(401).send(
          {           
              error: config.MSG_TOKEN_AUTENTICACION
          }
      ); 
      lib.appendToLog(peticion + "Status 404 - " + config.MSG_TOKEN_AUTENTICACION)        
      return     
  }      
  //console.log('validar token');
  token = token.replace('Bearer ', '')
  
  switch (lib.validar(token, 'juegos.generar')){
    case 0: 
    case 1: res.status(403).send({msg: 'token no valido'}); 
            lib.appendToLog(peticion + " Status 403") return; 
    case 3: res.status(403).send({msg: 'token expirado'});  return; 
    case 2: break;
  }


  let id = req.body.id;
  let jugadores = req.body.jugadores;

  if(jugadores && id)
  {   
      if(jugadores.length != 2)
          {res.status(406).send({msg: 'Parámetros no válidos'}); lib.appendToLog() return;}
      
      //BUSCAR A LOS JUGADORES
      /*
      let player1_id = jugadores[0];
      let player2_id = jugadores[1];
      let player1_response = await findPlayer(player1_id);
      let player2_response = await findPlayer(player2_id);

      if(player1_response){
        switch(player1_response.status)
        {
          case 200:
            console.log('Usuario encontrado: '+player1_response.data.id);
            break;
          case 404:
            res.status(404).send({msg: 'Jugador no encontrado: '+player1_id});
            return;                
        }
      }
      
      if(player2_response){
        switch(player2_response.status){
          case 200: 
            console.log('Usuario encontrado: '+player2_response.data.id);
            break;
          case 404:
            res.status(404).send({msg: 'Jugador no encontrado: '+player2_id});
        }
      }

*/


      if(connection == null){
        if(!conectar()){
          console.log('Ocurrio un error al Conectar a la base de datos de Juegos');
          res.status(500).send({msg: 'Error al intentar conectar con la DB'});
          return;
        }
        
      }
      //INSERTAR PARTIDA
      let query = 'INSERT INTO PARTIDA(id_partida, id_jugador1, id_jugador2, fecha_creacion) VALUES ('+
                "'"+id+"', "+jugadores[0]+", "+jugadores[1]+", "+connection.escape(new Date())+");"

      let response_query = await mysql_lib.execute(connection, query, 0);

      if(response_query == null ){
        console.log('ocurrio un error al intentar ejecutar un comando');
        res.status(500).send({msg: 'Error al intentar insertar el juego con la DB'});
        return;
      }
      else{
        //if(response_query == true ){
          res.status(201).send({msg: 'Partida Creada'});
        //} 
      }
      
      

  }else{
    //NO ENVÍO LOS PARÁMETROS VÁLIDOS
    res.status(406).send({msg: 'Parámetros no válidos'}); return;
  }


})


async function findPlayer(id)
{
    let url = 'http://'+config.USERS_SERVICE_HOST+"/"+config.USERS_SERVICE_PORT+"/jugadores/"+id;

    token = await lib.refrescarToken(token);

    const options = {
      headers: {
          //'Content-Type': 'application/x-www-form-urlencoded'
          Authorization: `Bearer ${token}`
      }
    };

    return await lib.makeGetPetition(url,null, options);

}



router.post('/simular', async function(req, res) {


  var token_request = req.headers['authorization']     
  if(!token_request){         
      res.status(401).send(
          {           
              error: "Es necesario el token_request de autenticación"
          }
      );         
      return     
  }      
  //console.log('validar token_request');
  token_request = token_request.replace('Bearer ', '')
  
  switch (lib.validar(token_request, 'juegos.simular')){
    case 0: 
    case 1: res.status(403).send({msg: 'token no valido'});  return; 
    case 3: res.status(403).send({msg: 'token expirado'});  return; 
    case 2: break;
  }


  let id = req.body.id;
  let jugadores = req.body.jugadores;

  if(id && jugadores){
    if(jugadores.length != 2){
      res.status(406).send({msg: 'Parámetros no válidos'}); 
      return;
    }

    if(connection == null){
      if(!conectar()){
        console.log('Ocurrio un error al Conectar a la base de datos de Juegos');
        res.status(500).send({msg: 'Error al intentar conectar con la DB'});
        return;
      }
    }

      //BUSCAR A LOS JUGADORES
      let player1_id = jugadores[0];
      let player2_id = jugadores[1];
      /*
      
      let player1_response = await findPlayer(player1_id);
      let player2_response = await findPlayer(player2_id);

      if(player1_response){
        switch(player1_response.status)
        {
          case 200:
            console.log('Usuario encontrado: '+player1_response.data.id);
            break;
          case 404:
            res.status(404).send({msg: 'Jugador no encontrado: '+player1_id});
            return;                
        }
      }

      if(player2_response){
        switch(player2_response.status){
          case 200: 
            console.log('Usuario encontrado: '+player2_response.data.id);
            break;
          case 404:
            res.status(404).send({msg: 'Jugador no encontrado: '+player2_id});
        }
      }

      */
      //VERIFICAR QUE EL ID DEL JUEGO SEA VÁLIDO Y QUE NO SE HAYA JUGADO
      
      let query = "SELECT * FROM PARTIDA WHERE id_partida = '"+id+"';"
      let existe = await mysql_lib.execute(connection, query, 1 );
  
      if(existe && existe.length > 0){
        //Si existe un servicio con esas credenciales
        let id_partida = existe[0].id_partida;
        let fecha_finalizado = existe[0].fecha_finalizado;
        
        console.log('Fecha finalizado: '+fecha_finalizado);
        if( String(fecha_finalizado).toLowerCase() === "null"){
          //VERIFICAMOS SI EL TOKEN ACTUAL AÚN ES VÁLIDO
          if(token){
            token = await lib.refrescarToken(token);
          }
          else {
            token = await lib.getToken();
          }

          //BUENO ENTONCES AHORA SI A SIMULAR LA PARTIDA
          let resultado =  await juego.simular(token,player1_id, player2_id, id_partida);
          console.log('Partida simulada FIN.',resultado);
          res.status(201).send({msg:'Partida Simulada'});

          //ACTUALIZAR FECHA QUE SE FINALIZO
          query = 'UPDATE PARTIDA SET fecha_finalizado = '+connection.escape(new Date())+', '+
                  "marcador = '100 - "+resultado.perdedor.casilla_actual+"', "+
                  "se_jugo = TRUE "+
                  "WHERE id_partida = '"+id_partida+"';";
          let actualizo = await mysql_lib.execute(connection, query, 1);

          if(actualizo != null){
            console.log('Se actualizo la fecha y el marcador del juego');
          }

          //RESPONDER AL SERVIDOR DE TORNEOS CON EL MARCADOR
        }else{
          res.status(406).send({msg: 'El juego ya se ha simulado anteriormente'});
          return;
        }
      }else{
        res.status(406).send({msg: 'Parametro ID inválido'})
        return;
      }
    


      

  }else{
    res.status(406).send({msg:'Parámetros no válidos'});
  }

});

router.get('/test', (req, res) => {
  const data = {
      "Tipo": "TEST",
      "Microservicio":"Torneo prueba"
  };
  res.send(data);
})

module.exports = 
{ 
  router,
  token
};
