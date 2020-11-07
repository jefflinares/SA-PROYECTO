const config = require('../config');
//const async = require('express-async-handler');

/**
 * 
 * @param {Objeto de Conexion} con 
 * @param {Consulta a ejecutar} query 
 * @param {0 Insert, 1 Select|Update} option 
 */
  async function execute (con, query, option){
    console.log("Query: "+query);
    if ( con ){
      switch(option)
      {
        case 0: //INSERT
          let se_inserto = false;
          try {
            con.query(query, function(err, result){
              if( err ) throw err;
              console.log("1 record inserted");
              se_inserto = true;
            });
            return se_inserto;
          } catch (error) {
            console.log("Error al insertar: "+error);
          } finally{
            return se_inserto;
          }
        case 1: //SELECT
        try {
          return new Promise( (resolve, reject) => {
            con.query(query, function (err, result, fields){
              if(err){ throw err; reject(err);}
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
    execute
  }