var express = require('express');
var router = express.Router();
const lib = require('../src/lib');
const config = require('../config');
const juego = require('../src/juego');
const querystring = require('querystring');
const DataBaseHandler = require('../db/mysql-con');
const mysql_lib = require("../db/mysql-lib");

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


router.get('/:id', async function(req, res, next) {
    
    let user_id = req.params.id;
    console.log('User_id: ',user_id );
    //consultar juegos de este paisa
    let query = 'SELECT * FROM PARTIDA WHERE id_jugador1 = '+user_id+' or id_jugador2 = '+user_id+';';
    if(connection == null){
        if(!conectar()){
        console.log('Ocurrio un error al Conectar a la base de datos de Juegos');
        res.status(500).send({msg: 'Error al intentar conectar con la DB'});
        return;
        }
        
    }

    let partidas_select = await mysql_lib.execute(connection, query, 1);

    let partidas_json = partidas_select.map( v => Object.assign({},v));

    console.log('Partidas del jugador: ',partidas_json);
    /*let body = {
        juegos : partidas_json,
        user_info : user_info
    };
*/
    res.render('juegos', {juegos: partidas_json});
})


module.exports = router;