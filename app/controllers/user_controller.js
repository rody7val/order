var models = require('../models/models');

// Cargar parametro :userId
exports.load = function(req, res, next, userId){

  models.User.findOne({
    _id: userId
  }).select('name username email active admin imgPath').exec(function(err, user){

    if (err) { next(new Error(err)); return } 
    // console.log(user)
    req.user = user;
    next();

  });

}

// Mostrar todos los usuarios
exports.index = function (req, res, next) {

  if (!req.session.user) {res.redirect('/'); return};

  models.User.find({}, function (err, users) {

    if (err) { next(new Error(err)); return } 

    res.render('user/show_users.jade', {
      session: res.locals.session,
      users: users
    });

  });

}

// Formulario nuevo Usuario
exports.new = function(req, res){

  if (req.session.user) {res.redirect('/'); return};

  var user = models.User;

  res.render('user/new.jade', {
    session: res.locals.session,
    user: user
  });

}

// Guardar nuevo Usuario en la BD
exports.create = function(req, res, next){

  if (req.session.user) {res.redirect('/'); return};

  var user = models.User(req.body.user);

  if (user.admin) {
    user.active = true;
  }

  user.save(function (err) {
    if (err) {
      res.render('user/new.jade', {
        session: res.locals.session,
        user: user, //modelo usuario
        err: err.errors // errores
      });
    }else{
      res.redirect('/user/'+user._id);
    }
  });

}

exports.loadImg = function(req, res, next){

  if (req.file) {
    console.log(req.file);
    res.json({success: true, path: req.file.path})
  }else{
    console.log(req.file);
    res.json({success: false})
  }

}


// Mostrar Usuario
exports.show = function(req, res){

  res.render('user/show_user.jade', {
    session: res.locals.session,
    user: req.user
  });

}

// Formulario editar Usuario
exports.edit = function(req, res){

  var user = req.user;
  user.edit = true;

  if (req.session.user._id != user._id) {res.redirect('/'); return}

  res.render('user/edit.jade', {
    session: res.locals.session,
    user: user
  });

}

// Editar Usuario en la BD
exports.update = function(req, res, next){
  
  if (req.session.user._id != req.user._id) {res.redirect('/'); return}

  models.User.findById(req.user._id, function(err, User){

    if (!User) {
      return next(new Error('No se puede cargar el usuario'));
    }else{
      User.name = req.body.user.name;
      User.modified = new Date();
      User.save(function (err) {
        if (err) {
          res.render('user/edit.jade', {
            session: res.locals.session,
            user: User,
            err: err.errors
          });
        }else{
          res.redirect('/user/'+req.user._id);
        }
      });
    }
    
  });

}

// Borrar Usuario en la BD
exports.delete = function(req, res, next){

  var user = req.user;

  if (req.session.user.admin) { //si existe admin

    user.remove(function(err){
      if (err) { next(new Error(err)) }
      if (req.session.user._id == user._id) {
        delete req.session.user
      };
      res.redirect('/user');
      return;
    });

  } else if (req.session.user._id != user._id) { //si los id son distintos

    res.redirect('/'); 
    return;

  }

  user.remove(function(err){
    if (err) { next(new Error(err)) }
      delete req.session.user;
      res.redirect('/user');
      return;
  });

}

// Activar Usuario en la BD
exports.active = function(req, res, next){

  var user = req.user;

  if (req.session.user._id == user._id || user.active == true) {res.redirect('/'); return};

  user.active = true;

  user.save(function (err){
    if (err) {
      next(new Error(err));
    }else{
      res.redirect('/user/'+user._id);
    }
  });

}

