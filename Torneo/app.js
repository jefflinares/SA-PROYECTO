const lib = require('./src/lib');
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const config = require('./config');
const PORT = config.PORT;////para utilizar el puerto definido por la nube, sino utilizar el puerto 3000

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usuarios');
var juegosRouter = require('./routes/juegos');
var torneosRouter = require('./routes/torneos');
var partidasRouter = require('./routes/partidas');

var app = express();
var token;
var fs = require('fs');
var contenido;
// var contenido = fs.readFileSync("prueba.txt").toString();
// var archivoLog = fs.createWriteStream('prueba.txt', {
//   flags: 'a'
// });

// archivoLog.write('\nComo estas?');

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
app.use('/juegos', juegosRouter);
app.use('/partidas', partidasRouter);
app.use('/torneos', torneosRouter);
//app.use('/partidas', partidasRouter);

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


app.listen(PORT, async () => {
  console.log('Servidor corriendo en puerto '+PORT);
  //console.log(await getToken());
});

async function getToken(){
  console.log("*************************************");
  console.log("[APP]:Solicitando token de usuario a servicio jwt...");
  let now = new Date();
  contenido = "\n[MS]:Solicitando token de usuario administrador | "+ now.toLocaleTimeString();
  token = await lib.getToken();
  contenido += "\n[MS]:Token obtenido | " + now.toLocaleTimeString();
  return token;
}

//archivoLog.end();
//console.log(contenido);
console.log("[MS]:LOG ACTUALIZADO");
let actual = fs.readFileSync("torneosLog.txt").toString();
fs.writeFileSync("torneosLog.txt", actual+contenido, "");

module.exports = {app, token};
