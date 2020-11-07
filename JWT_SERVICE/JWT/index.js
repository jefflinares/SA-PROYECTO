'use strict';
const config = require("./config");
const express = require('express');
const app = express();
var bodyParser  = require('body-parser');
const jwt_service = require("./jwt_service");
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


const DataBaseHandler = require('./db/mysql-con');
const mysql_lib = require("./db/mysql-lib");


var connection = null;
async function conectar(){
    try{
      if(!connection)
      {
        var dataBaseHandler = new DataBaseHandler();
        connection = dataBaseHandler.createConnection();
      
        let query = "SELECT id_servicio FROM servicio "+
        "WHERE id = 'dados';";
        

        let existe = await mysql_lib.execute(connection, query, 1 );
        if(existe && existe.length > 0){
          //Si existe un servicio con esas credenciales
          let id_servicio = existe[0].id_servicio;
          
        }else{
          mysql_lib.execute(connection, mysql_lib.returnQuery("dados"), 0);
          mysql_lib.execute(connection, mysql_lib.returnQuery("users"), 0);
          mysql_lib.execute(connection, mysql_lib.returnQuery("torneos"), 0);
          mysql_lib.execute(connection, mysql_lib.returnQuery("juegos"), 0);
        }
      }
    }catch(erro)
    {
        console.log(erro);
    }
}

try {
  conectar();
 
} catch (error) {
  console.log("Error al conectar DB: "+error)  ;
}



/**
	MIDDLEWARES

*/


function logger(req, res, next){
  console.log("Route Received: "+ req.protocol+"://"+req.get('host')+req.orginalUrl);
  
    next();
}

app.get('/', (req, res)=> {
    conectar();
    

    res.send("Servidor de tokens - Grupo 8");
});


app.post('/token', async function (req, res)  {
  //Obtener las credenciales
  const id = req.query["id"];
  const secret = req.query["secret"];


  //Buscar credenciales en la DB
  let query = "SELECT id_servicio, methods FROM servicio "+
              "WHERE id = '"+id+"' AND "+
              "pass = '"+secret+"';";
  
  let existe = await mysql_lib.execute(connection, query, 1 );
  
  if(existe && existe.length > 0){
    //Si existe un servicio con esas credenciales
    let id_servicio = existe[0].id_servicio;
    let methods =  existe[0].methods;
    console.log(id_servicio, methods);
    if(id_servicio != null && methods != null){
      var payload = {
        'scope': methods.split(',')
      };
      let response = {
        "jwt":jwt_service.sign(payload)
      }
      res.status(201).send(response);
    }else {
      res.status(500).send({message:"mi huevo dijo la gallina"});
    }
  }else{
    res.status(400).send({message:'Usuario o Secret no válidos'});
  }
  
})

app.listen(config.PORT, () => {
  var token = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiZGFkb3MudGlyYXIiLCJ0b3JuZW9zLnBhcnRpZGEucHV0IiwidXN1YXJpb3MuanVnYWRvcmVzLmdldCIsInVzdWFyaW9zLmxvZ2luIl0sImlhdCI6MTYwNDc2ODA1NSwiZXhwIjoxNjA0NzY4NjU1fQ.RNph9sWWASNKLMAG0KL_4lQBOLi8y2rq9ATM02W53gKhEAR3Zq7xsKZRYlq0LexXk3upQ--k3SEVacdymWt-Mgj6OZRQCiefamnz4Ssb9KKYPoxwmt_eOjS_kbgks2KjM0vwfTqHjxpesUGdx99y-niafRq6TlEOxJGzqBAF90s";
  if(jwt_service.verify(token)){
    console.log('Token validado');
  }else{
    console.log('Token no se pudo validar');
  }
  console.log(`Example app listening at http://localhost:${config.PORT}`)
})
