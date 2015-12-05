var mongoose = require("mongoose");

// Importar tablas
var Session = require('./session');
var User = require('./user');

// Conectar con MongoDB usando Mongoose.
mongoose.connect('mongodb://localhost/sc', function (err) {
    if (err) {
        console.error(err);
    } else {
        // Exportar tablas
        console.log("Connected to database");
		exports.Session = Session;
		exports.User = User;
    }
});