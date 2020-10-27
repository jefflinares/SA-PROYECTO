var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
var Db = require('./Db.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var usuario={
    email: "",
    password:""
  };
  usuario.email= req.query.email;
  usuario.password= req.query.password;


  
  var objectUsuario={
    id:0,
    nombres:"string",
    apellidos:"string",
    administrador:false
  };


  if(usuario==undefined){ //Si no viene un json con los datos del usuario
    console.log('El usuario no esta definido');
    res.statusMessage="Usuario o contraseña no coinciden";
    res.status(400).json(objectUsuario);
    
  }
  else if(usuario.email==undefined){
    console.log('email no definido');
    res.statusMessage="Usuario o contraseña no coinciden";
    res.status(400).json(objectUsuario);
  }
  else if(usuario.password==undefined){
    console.log('contraseña no definida');
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
          if(numAdmin==0){
            objectUsuario.administrador=false;
          }
          else{
            objectUsuario.administrador=true;
          }
        
          objectUsuario.email=rows[0].EMAIL;
          database.close();
          console.log('Ingreso exitoso');
          res.statusMessage="Ingreso Exitoso";
          res.status(200).json(objectUsuario);
        
      }, err => {
          return database.close().then(() => {
              throw err;
          })
      })
      .catch(err => {
          console.log(err);
          console.log('contraseña no definida');
          res.statusMessage="Usuario o contraseña no coinciden";
          res.status(400).json(objectUsuario);
      });
  }
});

module.exports = router;
