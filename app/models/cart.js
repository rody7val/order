var config = require('../../config.js');
var shop = require('cornershop');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

var Cart = shop(config.cartname, true);

module.exports = Cart;