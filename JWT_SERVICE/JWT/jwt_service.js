const fs   = require('fs');
const jwt   = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array  (512 bit key)
var privateKEY  = fs.readFileSync('./keys/private.key', 'utf8');
var publicKEY  = fs.readFileSync('./keys/public.key', 'utf8');  
module.exports = {
 sign: (payload) => {

  // Token signing options
  var signOptions = {
      expiresIn:  "10m",    // 30 days validity
      algorithm:  "RS256"    
  };
  return jwt.sign(payload, privateKEY, signOptions);
},

/**
 * ESTE METODO DEBE SER CREADO EN CADA SERVICIO, SE ACONSEJA COPIARLO
 */
verify: (token) => {
  var verifyOptions = {
      expiresIn:  "10m",
      algorithm:  "[RS256]"
  };
   try{
     return jwt.verify(token, publicKEY, verifyOptions);
   }catch (err){
     console.log(err);
     return false;
  }
},
 decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
 }
}