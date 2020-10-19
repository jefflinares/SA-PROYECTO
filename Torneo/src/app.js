const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const morgan = require('morgan');
const bodyParser = require('body-parser');

//Configuración para conexión al servidor
app.set('port', process.env.PORT || 3000);

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());

require('./routes/userRoutes')(app);

app.listen(app.get('port'), () => {
    console.log('Server on port 3000');
});