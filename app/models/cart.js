var config = require('../../config.js');
var shop = require('cornershop');

if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

var Cart = shop(config.cartname, true);

// Cart.addItem({
// 	id:10,
// 	name:'Superman Poster',
// 	desc:'10x5 - superman logo',
// 	price:12.5,
// 	qty:2,
// 	image:'/img/shop/superman.png'
// });

// Cart.addItem({
// 	id:9,
// 	name:'Sony TV',
// 	desc:'21" - TV Sony',
// 	price:7.5,
// 	qty:5,
// 	image:'/img/shop/tv.png'
// });

// Cart.save();

module.exports = Cart;