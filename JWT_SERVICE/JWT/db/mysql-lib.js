const config = require('../config');
//const async = require('express-async-handler');

const returnQuery = function(service){
    let query = "INSERT INTO servicio(id, pass, methods) VALUES (";
    let id = "";
    let secret = "";
    let services = "";
    switch(service){
      case "dados":
        id = config.DADOS_SERVICE_ID;
        secret = config.DADOS_SERVICE_SECRET;
        break;
      case "users":
        id = config.USERS_SERVICE_ID;
        secret = config.USERS_SERVICE_SECRET;
        break;
      case "torneos":
        id = config.TORNEOS_SERVICE_ID;
        secret = config.TORNEOS_SERVICE_SECRET;
        services = "usuarios.login,"+
                    "usuarios.jugadores.get,"+
                    "usuarios.jugadores.post,"+
                    "usuarios.jugadores.put,"+
                    "juegos.generar,"+
                    "juegos.simular,";
          //          "torneos.partida.get";
        break;
      case "juegos":
        id = config.JUEGOS_SERVICE_ID;
        secret = config.JUEGOS_SERVICE_SECRET;
        services = "dados.tirar,partida.generar,usuarios.jugadores.get,usuarios.login,torneos.partida.put";
        break;
    }
    query += "'"+id+"','"+secret+"','"+services+"');"
    return query;
  }

/**
 * 
 * @param {Objeto de Conexion} con 
 * @param {Consulta a ejecutar} query 
 * @param {0 Insert, 1 Select} option 
 */
  async function execute (con, query, option){
    console.log("Query: "+query);
    if ( con ){
      switch(option)
      {
        case 0: //INSERT
          try {
            con.query(query, function(err, result){
              if( err ) { throw err;}
              console.log("1 record inserted");
              return true;
            });
            break;
          } catch (error) {
            console.log("Error al insertar: "+error);
          } finally{
            break;
          }
        case 1: //SELECT
        try {
          return new Promise( (resolve, reject) => {
            con.query(query, function (err, result, fields){
              if(err){ reject(err);  throw err; }
              resolve(result);
            });
          });
        } catch (error) {
           console.log("Error al realizar query: "+error);
        }
      }
    }
    else {
      console.log("No existe la conexión");
    }
    return null;
  }

  module.exports = {
    returnQuery,
    execute
  }