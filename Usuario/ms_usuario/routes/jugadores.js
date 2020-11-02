var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());
var Db = require('./Db.js');

const jwt   = require('jsonwebtoken');
const fs   = require('fs');
var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');  


/* GET users listing. */
router.get('/:id', function(req, res, next) { //consigue los datos de un jugador
  
  //Verificacion de Token
  var token = req.headers['authorization']     
  if(!token){         
      res.status(401).send({error: "Es necesario el token de autenticación"})         
      return     
  }      
  token = token.replace('Bearer ', '')
  switch (validar(token, 'usuarios.jugadores.get')){
    case 0: 
    case 1: res.status(403).send({msg: 'token no valido'});  return; 
    case 3: res.status(403).send({msg: 'token expirado'});  return; 
    case 2: break;
  }
  //Fin de verificacion de token

  var id= req.params.id;
  console.log(id);
  const regex = /^[0-9]*$/;
  const verificacion = regex.test(id); 

  var objectUsuario={
    id:0,
    email: "user@example.com",
    nombres:"string",
    apellidos:"string",
    administrador:false
  };

  if(verificacion==false){//Si el parametro enviado no es un numero
    res.statusMessage="Usuario no encontrado";
    res.status(404).json(objectUsuario);
  }
  else{
    var idUser=Number(id);
    console.log(req.body);
    //Consulta Aqui
    var database= new Db();
    var sql = 'SELECT * FROM USUARIO WHERE ID='+idUser;
    database.query(sql)
      .then(rows => {
          objectUsuario.id=Number(rows[0].ID);
          objectUsuario.nombres=rows[0].NOMBRES;
          objectUsuario.apellidos=rows[0].APELLIDOS;
          var numAdmin=rows[0].ADMINISTRADOR;
          if(numAdmin==0){
            objectUsuario.administrador=false;
          }
          else{
            objectUsuario.administrador=true;
          }
        
          objectUsuario.email=rows[0].EMAIL;
          database.close();
          res.statusMessage="Consigue los datos del jugador";
          res.status(200).json(objectUsuario);
        
      }, err => {
          return database.close().then(() => {
              throw err;
          })
      })
      .catch(err => {
          console.log(err);
          res.statusMessage="Usuario no encontrado";
          res.status(404).json(objectUsuario);
      });
  }
});
router.put('/:id', function (req, res) { //Actualiza los datos de un jugador
  //Verificacion de Token
  var token = req.headers['authorization']     
  if(!token){         
      res.status(401).send({error: "Es necesario el token de autenticación"})         
      return     
  }      
  token = token.replace('Bearer ', '')
  switch (validar(token, 'usuarios.jugadores.put')){
    case 0: 
    case 1: res.status(403).send({msg: 'token no valido'});  return; 
    case 3: res.status(403).send({msg: 'token expirado'});  return; 
    case 2: break;
  }
  //Fin de verificacion de token

  var id= req.params.id;
  const regex = /^[0-9]*$/;
  const verificacion = regex.test(id); 

  var objectUsuario={
    id:0,
    email: "user@example.com",
    nombres:"string",
    apellidos:"string",
    administrador:false
  };

  if(verificacion==false){//Si el parametro enviado no es un numero
    res.statusMessage="Datos Invalidos";
    res.status(406).json(objectUsuario);
  }
  else{
    var idUser=Number(id);
    var usuario=req.body; //json con los datos del usuario.
    var numberUsuario= usuario.id;
    var emailUsuario= usuario.email;
    var nombreUsuario= usuario.nombres;
    var nombreApellidos= usuario.apellidos;
    var passUsuario= usuario.password;
    var usuarioAdmin= usuario.administrador;

    var database = new Db();
    var sql = 'UPDATE USUARIO SET NOMBRES = ?, APELLIDOS = ?, ADMINISTRADOR = ?, EMAIL = ?, PASS = ? WHERE ID = ?';
    var args = [nombreUsuario, nombreApellidos, usuarioAdmin, emailUsuario, passUsuario,idUser];

    try{ 
        var query = database.query(sql, args, function(error, result){
            if(error){
                console.log(error);
                res.statusMessage="Usuario no encontrado";
                res.status(404).json(objectUsuario);
            }
        });
        objectUsuario.nombres=nombreUsuario;
        objectUsuario.apellidos=nombreApellidos;
        objectUsuario.email=emailUsuario;
        objectUsuario.id= idUser;
        objectUsuario.administrador=usuarioAdmin;
        res.statusMessage="Jugador Actualizado";
        res.status(201).json(objectUsuario);
    }
    catch(x){ 
        console.log(x);
        res.statusMessage="Usuario no encontrado";
        res.status(404).json(objectUsuario);
    } 
  }
});
router.post('/', function (req, res) { //Actualiza los datos de un jugador
   //Verificacion de Token
   var token = req.headers['authorization']     
   if(!token){         
       res.status(401).send({error: "Es necesario el token de autenticación"})         
       return     
   }      
   token = token.replace('Bearer ', '')
   switch (validar(token, 'usuarios.jugadores.post')){
     case 0: 
     case 1: res.status(403).send({msg: 'token no valido'});  return; 
     case 3: res.status(403).send({msg: 'token expirado'});  return; 
     case 2: break;
   }
   //Fin de verificacion de token
  
  
  var database = new Db();

  var objectUsuario={
    id:0,
    email: "user@example.com",
    nombres:"string",
    apellidos:"string",
    administrador:false
  };
  var usuario=req.body; //json con los datos del usuario.
  console.log(req.body);
    
  var numberUsuario= usuario.id;
  var emailUsuario= usuario.email;
  var nombreUsuario= usuario.nombres;
  var nombreApellidos= usuario.apellidos;
  var passUsuario= usuario.password;
  var usuarioAdmin= usuario.administrador;

  if(numberUsuario==undefined|| nombreUsuario==undefined|| nombreApellidos==undefined|| usuarioAdmin==undefined|| emailUsuario==undefined|| passUsuario==undefined){
    console.log("Aqui esta la excepcion");
    res.statusMessage="Datos Invalidos";
    res.status(406).json(objectUsuario);
  }
  else{
    //Guardar datos de usuario en bd
      try{ 
        var query = database.query('INSERT INTO USUARIO(NOMBRES,APELLIDOS,ADMINISTRADOR,EMAIL,PASS)  VALUES(?,?,?,?,?)', [nombreUsuario,nombreApellidos,usuarioAdmin,emailUsuario,passUsuario], function(error, result){
            if(error){
              console.log("Error en insert en db ");
              res.statusMessage="Datos Invalidos";
              res.status(406).json(objectUsuario);
            }});
      }
      catch(x){ 
        console.log("aqui se origino: "+x);
        res.statusMessage="Datos Invalidos";
        res.status(406).json(objectUsuario);
        return;
      } 

      //traer id usuario
      var sql = 'SELECT ID FROM USUARIO WHERE EMAIL=\''+emailUsuario+'\'';
      database.query(sql)
        .then(rows => {
            var num=Number(rows[0].ID);
            console.log(num);
            objectUsuario.id=num;
            database.close();

            objectUsuario.nombres=nombreUsuario;
            objectUsuario.apellidos=nombreApellidos;
            objectUsuario.administrador=usuarioAdmin;
            objectUsuario.email= emailUsuario;
            res.status(201).json(objectUsuario);
        }, err => {
            return database.close().then(() => {
                throw err;
            })
        })
        .catch(err => {
            console.log(err);
            res.statusMessage="Datos Invalidos";
            res.status(406).json(objectUsuario);
        });
    }
});
router.get('/', function(req,res, next){
  //Verificacion de Token
  var token = req.headers['authorization']     
  if(!token){         
     res.status(401).send({error: "Es necesario el token de autenticación"})         
     return     
  }      
  oken = token.replace('Bearer ', '')
  switch (validar(token, 'usuarios.jugadores.get')){
    case 0: 
    case 1: res.status(403).send({msg: 'token no valido'});  return; 
    case 3: res.status(403).send({msg: 'token expirado'});  return; 
    case 2: break;
  }
  //Fin de verificacion de token
  //Consulta Aqui
  var database= new Db();
  var sql = 'SELECT ID as id, EMAIL as email, NOMBRES as nombres, APELLIDOS AS apellidos, ADMINISTRADOR as administrador from USUARIO';
  database.query(sql)
    .then(rows => {
        for (let ind = 0; ind < rows.length; ind++) {
          const element = rows[ind];
          if(element.administrador==1){
            element.administrador=true;
          }
          else{
            element.administrador=false;
          }
        }
       
        database.close();
        res.statusMessage="Consigue el listado de todos los jugadores";
        res.status(200).json(rows);
      
    }, err => {
        return database.close().then(() => {
            throw err;
        })
    })
    .catch(err => {
        console.log(err);
        res.statusMessage="Listado no encontrado";
        res.status(404).json({});
    });
});
function validar(token, metodo){
  var token_verify=verify(token);
  if(token_verify){
    var token_decode= decode(token);
    if( token_decode.payload.scope.indexOf(metodo)==-1){
      return 1; //no tiene acceso al metodo
    }
    else{
      const unixTimestamp = token_decode.payload.exp;
      const milliseconds = unixTimestamp * 1000;
      const dateObject = new Date(milliseconds);  
      const humanDateFormat = dateObject.toLocaleString();
      console.log(humanDateFormat); 
      if(Date.now() <= dateObject){
        console.log('fecha valida');
        return 2;
      }
      else{
        console.log('fecha invalida');
        return 3;
      }
    }
  }
  else{
    return 0;  //no se verifico
  }
}
function verify(token) {
  var verifyOptions = {
      expiresIn:  "30d",
      algorithm:  ["RS256"]
  };
   try{
     return jwt.verify(token, publicKEY, verifyOptions);
   }catch (err){
     console.log(err);
     return false;
   }
}
function decode(token) {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
}
module.exports = router;

