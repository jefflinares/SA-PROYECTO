
const config = require('./config');
const PORT = config.PORT;////para utilizar el puerto definido por la nube, sino utilizar el puerto 3000

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuarios');

var app = express();
var token = getToken();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Configuración para conexión al servidor
app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/usuarios', usersRouter);
//app.use('/torneos', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(PORT, () => {
  console.log('Servidor corriendo en puerto '+PORT);
});

function getToken(){
  var url = config.JWT_SERVICE_HOST + ":" + config.JWT_SERVICE_PORT + "/token";

    var req = new XMLHttpRequest();
    req.open("POST",url);
    req.setRequestHeader('Authorization', 'Bearer ' + access_token);
    req.setRequestHeader('Content-Type', 'application/json',true);
    
    var text = JSON.stringify({"id":config.TORNEOS_SERVICE_ID, "secret":config.TORNEOS_SERVICE_SECRET});
    var respuesta;
    
    req.onreadystatechange = function() {
        if(req.readyState == 4 && req.status == 201) { 
            //req.responseText;
            try{
                respuesta = JSON.parse(req.responseText);
                console.log("Token: "+respuesta.jwt);
                return respuesta.jwt;
            }catch(err){
                console.log(err);
            }
            return;
        }  
    }
    req.send(text);
}
module.exports = {app, token};
