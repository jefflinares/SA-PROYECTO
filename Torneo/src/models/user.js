const mysql = require('mysql');

//creando la conexión con la BD.
connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'bd'
});

let userModel = {};

//codigo para obtener los usuarios de la base de datos.
userModel.getUsers = (callback) => {
    if (connection) {
        connection.query(
            'SELECT * FROM users ORDER BY id',
            (err, rows) => {
                if (err) {
                    throw 'Error al intentar obtener la informaciòn de la BD';
                } else {
                    callback(null, rows);
                }
            }
        )
    }
};

userModel.insertUser = (userData, callback) => {
    if (connection) {
        connection.query(
            'INSERT INTO users SET ?', userData,
            (err, result) => {
                if (err) {
                    console.log('No existe conexión con la base de datos.');
                } else {
                    callback(null, {
                        'insertId': result.insertId
                    })
                }
            }
        )
    } else {
        callback(null, {
            'Result': 'El usuario no existe en la BD'
        })
    }
}

userModel.getBienvenida = (callback) => {
    if (connection) {
        callback(null, {
            'Id': '[404]',
            'Result': 'No se estableció la conexión con la BD'
        })
    } else {
        callback(null, {
            'Id': '[304]',
            'Result': 'Prueba de conexión exitosa'
        })
    }
}
module.exports = userModel;