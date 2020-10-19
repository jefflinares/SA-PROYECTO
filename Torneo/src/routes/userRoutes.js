const Usuario = require('../models/user');

module.exports = function (app){
    // app.get('/users', (req, res) => {
    //     Usuario.getUsers((err, data) => {
    //         res.status.json(data);
    //     });
    // });

    app.get('/users', (req, res) => {
        Usuario.getBienvenida((err, data) => {
            //res.status.json(data);
            res.json(data);
        });
    });

    app.post('/users', (req, res) => {
        console.log(req.body);
    });

    //ruta para hacer login en el microservicio de torneo.
    app.post('/ingreso', (req, res)=> {
         const userData = {
             id: null, 
             username: req.body.username,
             password: req.body.password
         };

         Usuario.insertUser(userData, (err, data) => {
             if (data && data.insertId) {
                 res.json({
                     success: true,
                     msg: 'Usuario reconocido', 
                     data: data
                 })
             } else {
                 res.status(500).json({
                     success: false,
                     msg: 'Usuario no reconocido'
                 })
             }
         })
        //console.log(req.body);
    });
}