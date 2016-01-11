var models = require('../models/models');


// Agregar articulo a la linea de pedidos
exports.add_item = function(req, res, next){

  var itemId = req.param('item_id');

  if (itemId) {

  	models.Item.findOne({_id: itemId}, function(err, item) {

      if (err) { res.json({success: false}) } 

      var cart = req.session.cart;
      cart.addItem(item);
      cart.save();
      var total = cart.getTotal();
      cart.total = total;
      req.session.cart = cart;
      // res.redirect('/item');
      res.json({success: true, cart: cart, total: total});

    });

  }else{
    res.json({success: false});
  }

}

// Sumar cantidad de articulos
exports.add_qty = function (req, res, next) {

}

// Borrar articulo de la linea de pedidos
exports.remove_item = function (req, res, next){

  var itemId = req.param('item');

  if (itemId) {
  	models.Item.findOne({_id: itemId}, function(err, item) {

  	  if (err) { next(new Error(err)); return } 

    	var cart = req.session.cart;
    	cart.removeItem(itemId);
    	cart.save();
      req.session.cart = cart;
      res.redirect('/item');

  	});
  }else{ 
    next(new Error('Error cart')); return 
  }

}

// Obtener el total en pesos
exports.total = function (req, res, next){

}