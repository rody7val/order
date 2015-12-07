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
  }).select('name username password active').exec(function (err, user) {
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
        err: "User doenst exist",
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
          err: "Invalid Password",
          user: {
            username: req.body.username,
            pass: req.body.password
          }
        });
      } else {
        // Crear req.session.user y guardar campos id, token, nombre y nombre de usuario
        // La session se define por la existencia de req.session.user 
        req.session.user = { 
          token: user.createToken(), 
          _id: user._id, 
          name: user.name,
          username: user.username,
          active: user.active
        };

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
  res.redirect(req.session.redir||'/'); //redireccion a path anterior a login 

}