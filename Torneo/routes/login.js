const lib = require('../src/lib');
const axios = require('../node_modules/axios');
const config = require('../config');
var express = require('express');
var router = express.Router();
const path = require('path');
var token;
var http = require('http');
var fs = require('fs');


router.post('/', async function(req, res, next) {
  
    let email = req.body.email;
    let password = req.body.password;
  
    if(email && password)
    {
      let url_ = 'http://'+config.USERS_SERVICE_HOST+":"+config.USERS_SERVICE_PORT+"/login"
      const parameters = {
        email: email,
        password: password
      }
  
      const post_data = querystring.stringify(parameters);
  
      url_ += "?"+post_data;
  
      const options = {
        headers: {"Authorization" : `Bearer ${token}`}
      };
  
        
      
  
      let response = null;
      try {
        response = await lib.makeGetPetition(url_, null, options);
      } catch (error) {
        //console.log('Error')  ;
      }
  
      let user_info = null;
      if(response)
      {
        switch(response.status)
        {
          case 200:
            user_info = response.data;
            alert('Bienvenido:'+ parameters.email);
            console.log('inicio de sesión válido: ');
            if(user_info.administrador){
                res.redirect(url.format(
                    { pathname: 'http://'+config.HOST+":"+config.PORT+"/usuarios/",
                    }));
                    return;
            }
            else{
                res.redirect(url.format(
                    { pathname: 'http://'+config.JUEGOS_SERVICE_HOST+":"+config.PORT+"/juegos/"+user_info.id,
                    }));
                    return;
            }
            break;
          case 400:
            alert('Contraseña   o password invalidos');
             console.log('MS - Usuarios 400 -> Usuario o contraseña no válidos');
             res.render('login', { title: 'Express' , message : {error:'Usuario o contraseña inválidos', succes: null} });
             return;
            break;
          default:
            console.log(response.data);
            res.render('login', { title: 'Express' , message : {error:'Usuario o contraseña inválidos', succes: null} });
            break;
        }
      }else{
  
      }
    
      
    }else{
      //res.render('login', { title: 'Express' , message : {error:'Usuario o contraseña inválidos', succes: null} });
     
      res.render('login', { title: 'Express' , message : {error:'Usuario o contraseña inválidos', succes: null} });
            
    }
  });
  