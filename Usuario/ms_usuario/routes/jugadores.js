var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
var Db = require('./Db.js');


/* GET users listing. */
router.get('/:id', function(req, res, next) { //consigue los datos de un jugador
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
module.exports = router;
