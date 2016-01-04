var models = require('../models/models');


// Cargar parametro :itemId
exports.load = function(req, res, next, itemId){

  models.Item.findOne({_id: itemId}, function(err, item){

    if (err) { next(new Error(err)); return } 
    // console.log(item)
    req.item = item;
    next();

  });

}

// Mostrar todos los articulos
exports.index = function (req, res, next) {

  models.Item.find({}, function (err, items) { 

    if (err) { next(new Error(err)); return }

    res.render('item/show_items.jade', {
      session: res.locals.session,
      items: items
    });

  });

}

// Formulario nuevo Articulo
exports.new = function(req, res){

  var item = models.Item;

  res.render('item/new.jade', {
    session: res.locals.session,
    item: item
  });

}

// Guardar nuevo Articulo en la BD
exports.create = function(req, res, next){

  var userId = req.session.user._id;
  models.User.findOne({_id: userId}, function(errUser, user) {

    if (errUser) { next(new Error(errUser)); return } 

    if (req.file) {
      console.log('\n**img');
      console.log(req.file);
      var imgPath = req.file.path 
    }

    var post = req.body.item;
    var item = models.Item({ 
      name: post.name,
      desc: post.desc,
      price: post.price,
      category: post.category,
      imgPath: imgPath.split('public')[1],
      userId: user._id
    });
    
    console.log('\n**item');
    console.log(item);

    item.save(function (err) {   // guardar articulo
      if (err) {
        res.render('item/new.jade', {
          session: res.locals.session,
          item: item, //modelo articulo
          err: err.errors // errores
        });
      }else{
        res.redirect('/item');
      }
    });

  });

}

// Mostrar Articulo
exports.show = function(req, res){

}

// Formulario editar Articulo
exports.edit = function(req, res){

}

// Editar Articulo en la BD
exports.update = function(req, res, next){

}

// Borrar Articulo en la BD
exports.delete = function(req, res, next){

  var item = req.item;

  item.remove(function(err){
    if (err) {
      next(new Error(err));
    }else{
      res.redirect('/item');
    }
  });

}