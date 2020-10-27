const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;//para utilizar el puerto definido por la nube, sino utilizar el puerto 3000
const morgan = require('morgan');
const bodyParser = require('body-parser');

//Configuración para conexión al servidor
app.set('port', process.env.PORT || 3000);
app.set('json spaces', 2);

//middleware
app.use(morgan('dev'));
app.use(express.json());//Para interpretar los datos en formato json
app.use(express.urlencoded({extended: false}));//interpretar los datos de inputs a través de formularios
app.use(bodyParser.json());

//Routes
require('./routes/userRoutes')(app);
app.use(require('./routes/index'));

//inicializando el servidor
app.listen(app.get('port'), () => {
    console.log('Server on port 3000');
});