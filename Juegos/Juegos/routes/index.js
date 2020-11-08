var express = require('express');
const axios = require('axios');
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
  lib.appendToLog("[MS - JUEGOS] GENERAR (POST) ");
  let fecha_hora_peticion = lib.getDate() +"\n";
  var token = req.headers['authorization']     
  if(!token){         
      res.status(401).send(
          {           
              error: config.MSG_TOKEN_AUTENTICACION
          }
      ); 
      lib.appendToLog(" Status 404 - " + config.MSG_TOKEN_AUTENTICACION)        
      return     
  }      
  //console.log('validar token');
  token = token.replace('Bearer ', '')
  
  switch (lib.validar(token, 'juegos.generar')){
    case 0: 
    case 1: res.status(403).send({msg: 'token no valido at: '+fecha_hora_peticion}); 
            lib.appendToLog(" Status 403 Token No válido at: "+fecha_hora_peticion); return; 
    case 3: res.status(403).send({msg: 'token expirado'});
    lib.appendToLog(" Status 403 Token Expirado at: "+fecha_hora_peticion);  return; 
    case 2: break;
  }


  let id = req.body.id;
  let jugadores = req.body.jugadores;

  if(jugadores && id)
  {   
      if(jugadores.length != 2)
          {res.status(406).send({msg: 'Parámetros no válidos'});  return;}
      
      //BUSCAR A LOS JUGADORES
      
      let player1_id = jugadores[0];
      let player2_id = jugadores[1];
      let player1_response = await findPlayer(player1_id);
      let player2_response = await findPlayer(player2_id);

      if(player1_response){
            lib.appendToLog('Usuario1 encontrado:  '+player1_id);
      }else{
        console.log('Generar Jugador 1 no encontrado en el ms de usuarios');
        lib.appendToLog(' Status 404 - Jugador1 no Encontrado: '+player1_id+" at: "+fecha_hora_peticion);
        res.status(404).send({msg: 'Jugador no encontrado: '+player1_id});
        return;
      }
      
      if(player2_response){
            lib.appendToLog('Usuario2 encontrado:  '+player2_id);
      }else{
        lib.appendToLog(' Status 404 - Jugador2 no Encontrado: '+player1_id+" at: "+fecha_hora_peticion);
        res.status(404).send({msg: 'Jugador no encontrado: '+player2_id});
        return;
      }




      if(connection == null){
        if(!conectar()){
          console.log('Ocurrio un error al Conectar a la base de datos de Juegos');
          lib.appendToLog('Status 500 - Error al intentar conectar con la DB at: '+fecha_hora_peticion);
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
        lib.appendToLog('Status 500 - Error al intentar conectar con la DB at: '+fecha_hora_peticion);
        res.status(500).send({msg: 'Error al intentar insertar el juego con la DB'});
        return;
      }
      else{
        //if(response_query == true ){
          lib.appendToLog(' Status 201 - Partida Creada at: '+fecha_hora_peticion);
          res.status(201).send({msg: 'Partida Creada'});
        //} 
      }
      
      

  }else{
    //NO ENVÍO LOS PARÁMETROS VÁLIDOS
    lib.appendToLog(' Status 406 - Parametros no válidos: '+fecha_hora_peticion);
    res.status(406).send({msg: 'Parámetros no válidos'}); return;
  }


})


async function findPlayer(id)
{
  let fecha_hora_peticion = lib.getDate();
    if(token === null){
      try {
        token = await lib.getToken();
      } catch (error) {
        console.log(error);
      }

    }else{
      token = await lib.refrescarToken(token);
    }
  console.log('Token del servidor de juegos para buscar jugador: '+token);
    let url = 'http://'+config.USERS_SERVICE_HOST+":"+config.USERS_SERVICE_PORT+"/jugadores/"+id;

    

    try {

      return new Promise( (resolve, reject) => {
        axios.get(
          url, 
           
          { 
              headers: {
                  "Authorization" : `Bearer ${token}`
              }
          } 
          )
      .then(res => {
          //console.log("Respuesta: ",res.data);
          switch(res.status){
              case 200:
                  lib.appendToLog('[MS - JUEGOS] Usuarios -> Obtener usuario Status 200 at: '+fecha_hora_peticion);
                  console.log('Partida ha sido actualizada en el MS - Torneos', res.data);
                  resolve(true);
                  break;
              case 404:
                  lib.appendToLog('[MS - JUEGOS] Usuarios -> Obtener usuario Status 404 at: '+fecha_hora_peticion);
                  console.log("MS Usuarios -obtener usuario 404 Part", res.data);
                  resolve(false);
              default:
                  console.log(res.data);
                  resolve(false);
          }
          
      })
      .catch((error) => {
          console.log(error);
          resolve(false);
      });

      });
      
  } catch (error) {
      console.log('Error con el MS Usuarios',error); 
      return false;       
  } 
}



router.post('/simular', async function(req, res) {

  lib.appendToLog("[MS - JUEGOS] SIMULAR (POST) ");
  let fecha_hora_peticion = lib.getDate() +"\n";
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
    case 1: 
      res.status(403).send({msg: 'token no valido'});  
      lib.appendToLog(' Status 403 - Token no Valido at: '+fecha_hora_peticion);
      return; 
    case 3: 
      res.status(403).send({msg: 'token expirado'});  
      lib.appendToLog(' Status 403 - Token expirado at: '+fecha_hora_peticion);
      return; 
    case 2: break;
  }


  let id = req.body.id;
  let jugadores = req.body.jugadores;

  if(id && jugadores){
    if(jugadores.length != 2){
      res.status(406).send({msg: 'Parámetros no válidos'}); 
      lib.appendToLog(' Status 406 - Parametros no válidos at: '+fecha_hora_peticion);
      return;
    }

    if(connection == null){
      if(!conectar()){
        console.log('Ocurrio un error al Conectar a la base de datos de Juegos');
        res.status(500).send({msg: 'Error al intentar conectar con la DB'});
        lib.appendToLog(' Status 500 - Error al intentar conectar con la DB'+fecha_hora_peticion);
        return;
      }
    }

      //BUSCAR A LOS JUGADORES
      let player1_id = jugadores[0];
      let player2_id = jugadores[1];
      let player1_response = await findPlayer(player1_id);
      let player2_response = await findPlayer(player2_id);

      if(player1_response){
            lib.appendToLog('Usuario1 encontrado:  '+player1_id);
        
      }else{
        lib.appendToLog('Status 404 - Usuario1 no encontrado:  '+player1_id + fecha_hora_peticion);
        res.status(404).send({msg: 'Jugador no encontrado: '+player1_id});
        return;                
      }
      if(player2_response){
          lib.appendToLog('Usuario2 encontrado:  '+player2_id);
      }else{
        lib.appendToLog('Status 404 - Usuario2 no encontrado:  '+player2_id + fecha_hora_peticion);
        res.status(404).send({msg: 'Jugador no encontrado: '+player2_id});

      }

      
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
          lib.appendToLog('Status 201 - Partida Simulada '+fecha_hora_peticion);

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
          lib.appendToLog('Status 406 - El juego ya se ha simulado anteriormente');
          return;
        }
      }else{
        res.status(406).send({msg: 'Parametro ID inválido'})
        lib.appendToLog('Status 406 - Parametro ID inválido' +fecha_hora_peticion);
        return;
      }
    


      

  }else{
    res.status(406).send({msg:'Parámetros no válidos'});
    lib.appendToLog('Status 406 - Parametros no válidos' +fecha_hora_peticion);
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
