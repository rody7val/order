var models = require('../models/models');
var jsonwebtoken = require('jsonwebtoken');
var config = require('../../config');
var secretKey = config.secretKey;
var jade = require('jade');


// Formulario nueva Sesion
exports.new = function(req, res){

  if (req.session.user) {res.redirect(req.session.redir||'/'); return};
  res.render('session/login', {session: res.locals.session});

}

// Guardar nueva Sesion en memoria
exports.create = function(req, res){

  if (req.session.user) {res.redirect(req.session.redir||'/'); return};

  models.User.findOne({
      username: req.body.username 
  }).select('name username password active admin imgPath email').exec(function (err, user) {
    // usuario no encontrado
    if (err) {
      res.render('session/login.jade', {
        session: res.locals.session,
        err: "Usuario no encontrado",
        user: {
          username: req.body.username,
          pass: req.body.password
        }
      });
    }
    // username incorrecto
    if (!user) {
      res.render('session/login.jade', {
        session: res.locals.session,
        err: "Usuario no existe",
        user: {
          username: req.body.username,
          pass: req.body.password
        }
      });
    } else if (user) {
      var validPassword = user.comparePassword(req.body.password);
      // incorrect password
      if (!validPassword) {
        res.render('session/login.jade', {
          session: res.locals.session,
          err: "Contrasenia invalida",
          user: {
            username: req.body.username,
            pass: req.body.password
          }
        });
      } else {
        // Crear req.session.user y guardar campos de usuario
        // La session se define por la existencia de req.session.user 
        req.session.user = { 
          token: user.createToken(), 
          _id: user._id, 
          name: user.name,
          username: user.username,
          admin: user.admin,
          active: user.active
        };
        console.log(user)
        console.log('\n**Login:\n**ACTIVIDAD DEl USUARIO: '+user.name);
        console.log('**USER ID: '+user._id);
        console.log('**TIME: '+Date.now());
        console.log('**REST PATH: '+req.path+'\n');

        res.redirect(req.session.redir||'/user/'+user._id); //redireccion a path anterior a login 
      }
    }
  });

}

// Verificar Sesion
exports.loginRequired = function(req, res, next){

  if (!req.session.user) {res.redirect('/login'); return};

  var token = req.session.user.token;
  jsonwebtoken.verify(token, secretKey, function (err, decoded) {
    //session expirada
    if (err) {
      delete req.session.user;
      res.status(403).json({success: false, message: "Mas de 24 min sin actividad. Iniciar session."});
    } else {
      console.log('\n**LoginRequired:\n**ACTIVIDAD DEl USUARIO: '+decoded.username);
      console.log('**USER ID: '+decoded._id);
      console.log('**TIME: '+Date.now());
      console.log('**REST PATH: '+req.path+'\n');
      next();
    }
  });

}

// Eliminar Sesion
exports.destroy = function(req, res){

  if (!req.session.user) {res.redirect('/'); return};

	delete req.session.user;
  res.redirect('/'); //redireccion a path anterior a login 

}

// Helper dinamico
exports.dinamic = function(req, res, next){

  models.User.find({}, function (err, users) {

    if (err) { console.log('err db helper dinamico'); return }

    // guardar path en session.redir para despues de login
    if(!req.path.match(/\/login|\/logout/)){
      req.session.redir = req.path;
    }

    var usersLength = users.length;
    var time = Number( new Date().getTime() );
    var timeOut = 4200; // 120 == 2 minutos

    req.session.usersLength = usersLength;
    req.session.cart = models.Cart; //cart
    req.session.contador = time;
    // hacer visible req.session en las vistas
    res.locals.session = req.session;

    if ( usersLength > 0 || ( req.path.match(/\/user/) && req.method == 'POST' ) ) {
      //auto-logout
      if (req.session.contador && req.session.user) {
        if ((time - req.session.contador) > timeOut*1000) {
          delete req.session.user;
          res.redirect('/login');
        }
      }
      console.log(req.session);
      next();
      return;
    }else{
      console.log(usersLength);
      res.render('user/new.jade', {
        session: res.locals.session,
        admin: true
      });
    }

  });

}