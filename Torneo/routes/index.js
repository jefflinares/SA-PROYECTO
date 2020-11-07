var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'MS Torneos' });
});

router.get('/usuarios', function(req, res, next) {
  res.render('usuarios', {title: 'Gestión de Usuarios'});
});

router.get('/juegos', function(req, res, next) {
  res.render('juegos', {title: 'Gestión de Juegos'});
});

router.get('/partidas', function(req, res, next) {
  res.render('partidas', {title: 'Gestión de Partidas'});
});

router.get('/torneos', function(req, res, next) {
  res.render('torneos', {title: 'Gestión de Torneos'});
});

router.get('/llaves', function(req, res, next) {
  res.render('llaves', {title: 'Llaves'});
});

router.get('/test', (req, res) => {
  const data = {
      "Tipo": "TEST",
      "Microservicio":"Torneo prueba"
  };
  res.send(data);
})

module.exports = router;
