var express = require('express');
var router = express.Router();

/* GET tirar dados listing. */
router.get('/:cantidad', function(req, res, next) { // /tirar/3
  try{
    var cantidad= req.params.cantidad;
    var dados=0;

    const regex = /^[0-9]*$/;
    const verificacion = regex.test(cantidad);
  
    if(verificacion==false){ //Si no viene un numero en el parametro, error
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
    res.statusMessage="Tiro Exitoso";
    res.status(200).json(objectRes);
    
  }
  catch(x){
    res.statusMessage="Número de dados a tirar no es válido"
    res.status(400).json({dados:[0]});
  }
});

function generateRandom(min, max) { //Devuelve el numero random 
  return Math.floor(Math.random() * (max - min)) + min;
}
module.exports = router;
