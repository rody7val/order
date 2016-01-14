var mongoose = require("mongoose");
var config = require('../../config');

// Importar tablas
var Cart = require('./cart');
var User = require('./user');
var Item = require('./item');

// Conectar con MongoDB usando Mongoose.
mongoose.connect(config.db.localhost, function (err) {
    if (err) {
        console.error(err.name+': '+err.message);
    } else {
        // Exportar tablas
        console.log("Connected to database");
        exports.Cart = Cart;
		exports.User = User;
		exports.Item = Item;
    }
});