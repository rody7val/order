var mongoose = require("mongoose");

// Importar tablas
var Cart = require('./cart');
var User = require('./user');
var Item = require('./item');

// Conectar con MongoDB usando Mongoose.
mongoose.connect('mongodb://localhost/sc', function (err) {
    if (err) {
        console.error(err);
    } else {
        // Exportar tablas
        console.log("Connected to database");
        exports.Cart = Cart;
		exports.User = User;
		exports.Item = Item;
    }
});