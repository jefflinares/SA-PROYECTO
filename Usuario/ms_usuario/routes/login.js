var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
var Db = require('./Db.js');

const jwt   = require('jsonwebtoken');
const fs   = require('fs');
var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');  

/* GET users listing. */
router.get('/', function(req, res, next) {

  //Verificacion de Token
  var token = req.headers['authorization']     
    if(!token){         
       fs.appendFile('./LogsG/logs.txt','\nMS-USUARIO-LOGIN(GET) '+ getDate() + " STATUS 401", function(err) {
         if(err) return console.error(err);
       });
        res.status(401).send({error: "Es necesario el token de autenticación"})         
        return     
    }      
    token = token.replace('Bearer ', '')
    switch (validar(token, 'usuarios.login')){
      case 0: 
      case 1: res.status(403).send({msg: 'token no valido'});  
        fs.appendFile('./LogsG/logs.txt','\nMS-USUARIO-LOGIN(GET) '+ getDate() + " STATUS 403", function(err) {
          if(err) return console.error(err);
        });
      return; 
      case 3: res.status(403).send({msg: 'token expirado'});  
        fs.appendFile('./LogsG/logs.txt','\nMS-USUARIO-LOGIN(GET) '+ getDate() + " STATUS 403", function(err) {
          if(err) return console.error(err);
        });
      return; 
      case 2: break;
    }
  //Fin de verificacion de token
  
  
  var usuario={
    email: "",
    password:""
  };
  usuario.email= req.query.email;
  usuario.password= req.query.password;


  
  var objectUsuario={
    id:0,
    email:"",
    nombres:"string",
    apellidos:"string",
    administrador:false
  };


  if(usuario==undefined){ //Si no viene un json con los datos del usuario
    console.log('El usuario no esta definido');
    res.statusMessage="Usuario o contraseña no coinciden";
    fs.appendFile('./LogsG/logs.txt','\nMS-USUARIO-LOGIN(GET) '+ getDate() + " STATUS 400 Usuario o Password no coinciden", function(err) {
      if(err) return console.error(err);
    });
    res.status(400).json(objectUsuario);
    
  }
  else if(usuario.email==undefined){
    console.log('email no definido');
    fs.appendFile('./LogsG/logs.txt','\nMS-USUARIO-LOGIN(GET) '+ getDate() + " STATUS 400 Usuario o Password no coinciden", function(err) {
      if(err) return console.error(err);
    });
    res.statusMessage="Usuario o contraseña no coinciden";
    res.status(400).json(objectUsuario);
  }
  else if(usuario.password==undefined){
    console.log('contraseña no definida');
    fs.appendFile('./LogsG/logs.txt','\nMS-USUARIO-LOGIN(GET) '+ getDate() + " STATUS 400 Usuario o Password no coinciden", function(err) {
      if(err) return console.error(err);
    });
    res.statusMessage="Usuario o contraseña no coinciden";
    res.status(400).json(objectUsuario);
    
  }
  else{
    console.log(req.body);
    //Consulta Aqui
    var database= new Db();
    var sql = 'SELECT * FROM USUARIO WHERE EMAIL=\''+usuario.email+'\' AND PASS=\''+usuario.password+'\'';
    database.query(sql)
      .then(rows => {
          objectUsuario.id=Number(rows[0].ID);
          objectUsuario.nombres=rows[0].NOMBRES;
          objectUsuario.apellidos=rows[0].APELLIDOS;
          var numAdmin=rows[0].ADMINISTRADOR;
          objectUsuario.email=usuario.email;
          if(numAdmin==0){
            objectUsuario.administrador=false;
          }
          else{
            objectUsuario.administrador=true;
          }
        
          objectUsuario.email=rows[0].EMAIL;
          database.close();
          console.log('Ingreso exitoso');
          fs.appendFile('./LogsG/logs.txt','\nMS-USUARIO-LOGIN(GET) '+ getDate() + " STATUS 200 Ingreso exitoso", function(err) {
            if(err) return console.error(err);
          });
          res.statusMessage="Ingreso Exitoso";
          res.status(200).json(objectUsuario);
        
      }, err => {
          return database.close().then(() => {
              throw err;
          })
      })
      .catch(err => {
          console.log(err);
          fs.appendFile('./LogsG/logs.txt','\nMS-USUARIO-LOGIN(GET) '+ getDate() + " STATUS 400 Usuario o Password no coinciden", function(err) {
            if(err) return console.error(err);
          });
          console.log('contraseña no definida');
          res.statusMessage="Usuario o contraseña no coinciden";
          res.status(400).json(objectUsuario);
      });
  }
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
function getDate(){
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours()-6;
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();

  let fulldate=year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  return fulldate
}
module.exports = router;
