const jwt   = require('jsonwebtoken');
const fs   = require('fs');
const publicKEY  = fs.readFileSync('./Keys/public.key', 'utf8');  
const config = require('../config');
const http = require('http');
const querystring = require('querystring');
const axios = require('axios');


async function appendToLog(text){
    //console.log('TExto: ', text);
    fs.appendFile( './src/files/log.txt', text, function(err){
        if ( err ) throw err;
      //  console.log('Escribio en el archivo '+ fs.readFileSync('./src/files/log.txt'));
    })
}

function getDate(){
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours() - 6;
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
  
    let fulldate=year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    return fulldate
  }



/**
 * Función que solicita un token para el microservicio de juegos
 */
async function getToken(){
    var token_acceso='';

    let url = 'http://'+config.JWT_SERVICE_HOST + ":"+ config.JWT_SERVICE_PORT+"/token";
    const parameters = {
        id: config.JUEGOS_SERVICE_ID,
        secret: config.JUEGOS_SERVICE_SECRET
    }
    
    const post_data = querystring.stringify(parameters);

    url += "?"+post_data;

    const options = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };


    let res = await makePostPetition(url, null, options);

    switch(res.status){
        case 201: 
            token_acceso = res.data.jwt;
            break;
        default:
            console.log(res.data);
    }
    //console.log('Token solicitado: ', decode(token_acceso));
    return token_acceso;

}

/**
 * Función para refrescar el token en caso la fecha de expiración haya culminado
 * @param {'Token Actual'} token 
 */
async function refrescarToken(token){
    var token_verify=verify(token);
    if(token_verify){
        var token_decode= decode(token);  
        const unixTimestamp = token_decode.payload.exp;
        const milliseconds = unixTimestamp * 1000;
        const dateObject = new Date(milliseconds);  
        const humanDateFormat = dateObject.toLocaleString();
        
        if(Date.now() < dateObject){
            console.log('Token aún activo vence: '+humanDateFormat);
            return token;
        }
        else{
            console.log('Token vencido');
            let new_token = await getToken();
            if(new_token.length == 0){
                console.log("Error: Al intentar solicitar de nuevo el token");
            }
            return new_token;
        }
    }
}

/**
 * Funcion para hacer una petición del tipo post
 * @param {'Url del destino'} url 
 * @param {'Json del cuerpo de la peticion'} body 
 * @param {'Opciones (headers, y demas)'} options 
 */
async function makePostPetition(url, body, options)
{

    return new Promise( (resolve, reject) => {

        axios.post(url, body,options)
        .then((res) => {
           resolve(res);
        }).catch((err) => {
            console.error(err);
            reject(err);
        });

    });
}

/**
 * Funcion para realizar una petición del tipo get
 * @param {'Url del destino'} url 
 * @param {'Json del cuerpo de la peticion'} body 
 * @param {'Opciones (headers, y demas)'} options 
 */
async function makeGetPetition(url, body, options)
{
    return new Promise( (resolve, reject) => {

        axios.get(url, options)
        .then((res) => {
           resolve(res);
        }).catch((err) => {
            console.error(err);
            reject(err);
        });

    });
}

/**
 * Función para validar que el token recibido tenga acceso a la petición solicitada
 * @param {'Token que se recibe del Request de otro micro-servicio'} token 
 * @param {'Metodo que se quiere validar que el token contenga en el scope'} metodo 
 */

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

/**
 * Función que verifica que el token sea válido dependiendo del tipo de encriptación 
 * ["RS256"] y el tiempo de expiración
 * @param {'Token que se quiere validar con la llave publica'} token 
 */


function verify(token) {
    var verifyOptions = {
        expiresIn:  "25m",
        algorithm:  ["RS256"]
    };
    try{
        return jwt.verify(token, publicKEY, verifyOptions);
    }catch (err){
        console.log(err);
        return false;
    }
}

/**
 * Función que retorna el token ya decodificado
 * @param {'Token que será decodificado'} token 
 */

function decode(token) {
      return jwt.decode(token, {complete: true});
      //returns null if token is invalid
}

module.exports = {
    verify,
    decode,
    validar,
    getToken,
    makeGetPetition,
    makePostPetition,
    refrescarToken,
    appendToLog,
    getDate
}