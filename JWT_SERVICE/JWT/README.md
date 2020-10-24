# JWT Service

1. Instalar jsonwebtoken, y crear una variable del tipo
```javascript
const jwt   = require('jsonwebtoken');
```

2. Copiar la llave pública en una carpeta dentro de cada servicio

3. Obtener credenciales de cada servicio y definirlas en un archivo de 
variables de entorno, puede definir uno como el archivo [.env.test](.env.test).

4. Este servicio generará tokens para autenticación Oauth 2.0 utilizando
Client_Credentials y la encriptación en base a llaves pública/privada.

- ClientCredentials

Cada Servicio contará con un id y un secret, los cuales son envíados al 
endpoint del servicio IP:PORT/token?id=X&secret=Y

5. Solicitar token: 
Si se logra autenticar con las credenciales el servicio devuelve un token que
contendrá la siguiente estructura:
```json
//HEADER
{
    alg: "RS256", //algoritmo utilizado
    type:"JWT" //tipo de token
}.
//PAYLOAD
{
    scope: [
        "servicio1.metodo1" //lista de scopes a los que el usuario tiene acceso
    ],
    iat: 1603496301, //Fecha y hora de creación
    exp: 1606088301 //Fecha y hora de expiración (30 días)
}.
//FIRMA
[signature] //firma para desencriptar dicho token (Pública)
```



6. Verifcar el token

Se deberá primero verificar si el token es valido para ello deberá 
crear un metodo de verificación en cada servicio puede basarse en el metodo
Verify en el archivo [jwt_servide.js](jwt_service.js), el cual 
debe utilizar junto con la llave pública y las opciones del token necesarias
en este caso son, el tiempo de expiracion y el algoritmo, este metodo
retornaría true si el token es válido, deberá implemntarlo en cada servicio.

```javascript
 verify: (token) => {
  var verifyOptions = {
      expiresIn:  "30d",
      algorithm:  ["RS256"]
  };
   try{
     return jwt.verify(token, publicKEY, verifyOptions);
   }catch (err){
     return false;
   }
},

```

7. Decodificar el token

Debe implementar un metodo que luego de verificar el token lo decofique
por suerte esta libreria ya lo hace devolviendo un string que puede convertir
en JSON para decodifcar el token y luego hacer las validaciones respectivas.

```javascript
 decode: (token) => {
    return jwt.decode(token, {complete: true});
    //returns null if token is invalid
 }
 ```



