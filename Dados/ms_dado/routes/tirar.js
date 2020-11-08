var express = require('express');
var router = express.Router();
var request = require('request');
const jwt   = require('jsonwebtoken');
const fs   = require('fs');
const { Console } = require('console');
var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');  


/* GET tirar dados listing. */
router.get('/:cantidad', function(req, res, next) { // /tirar/3
  try{

    fs.appendFile('./LogsG/logs.txt','\nMS-DADOS-TIRAR(GET) '+ getDate(), function(err) {
      if(err) return console.error(err);
    });

    var token = req.headers['authorization']     
    if(!token){    
        fs.appendFile('./LogsG/logs.txt',' status 401', function(err) {
          if(err) return console.error(err);
        });     
        res.status(401).send({           
        error: "Es necesario el token de autenticación"         })         
        return     
      }      
    console.log('validar token');
    token = token.replace('Bearer ', '')
    
    switch (validar(token, 'dados.tirar')){
      case 0: 
      case 1: res.status(403).send({msg: 'token no valido'});  return; 
      case 3: res.status(403).send({msg: 'token expirado'});  return; 
      case 2: break;
    }
    
    var cantidad= req.params.cantidad;
    var dados=0;

    fs.appendFile('./LogsG/logs.txt',' /tirar/{'+cantidad+'}', function(err) {
      if(err) return console.error(err);
    });

    const regex = /^[0-9]*$/;
    const verificacion = regex.test(cantidad);
  
    if(verificacion==false){ //Si no viene un numero en el parametro, error
      fs.appendFile('./LogsG/logs.txt',' status 400', function(err) {
        if(err) return console.error(err);
      }); 
      res.statusMessage="Número de dados a tirar no es válido"
      res.status(400).json({dados:[0]});
      return;
    }
    
    let arrayNumber=[];
    var objectRes= {
      dados: arrayNumber
    };

    dados=Number(cantidad);
    
    for (let index = 0; index < dados; index++) {
      const element = generateRandom(1,7);
      objectRes.dados.push(element); //Se guarda el numero generado aleatorimente
    }
    fs.appendFile('./LogsG/logs.txt',' status 200', function(err) {
      if(err) return console.error(err);
    });
    res.statusMessage="Tiro Exitoso";
    res.status(200).json(objectRes);
    
  }
  catch(x){
    console.log(x);
    fs.appendFile('./LogsG/logs.txt',' status 400', function(err) {
      if(err) return console.error(err);
    });
    res.statusMessage="Número de dados a tirar no es válido"
    res.status(400).json({dados:[0]});
  }
});

function generateRandom(min, max) { //Devuelve el numero random 
  return Math.floor(Math.random() * (max - min)) + min;
}


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





function getToken(){
  var token_acceso='';
    request.post('http://localhost:5000/token', 
    {form:{id:'dados', secret:'dados1234'}},function(err,res, body){
      console.log(err)
      if(res!=undefined){
        if (res.statusCode==201){
          var cuerpo = JSON.parse(body.body)       
          console.log(token_acceso);  
          
          return 
        }
        else {
          return undefined;
        }
      }
      else{return undefined;}
    });
}



function verify(token) {
  var verifyOptions = {
      expiresIn:  "10m",
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