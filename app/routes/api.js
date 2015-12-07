// Controllers
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

// API
module.exports = function (app, express) {

  var api = express.Router();

  // Home page
  api.get('/', function(req, res, next){
    res.render( 'index', {session: res.locals.session});
  });

  // Autoload de comandos
  api.param('userId', userController.load); //autoload :

  // Session
  api.get('/login', sessionController.new);       //formulario crear token {get}
  api.post('/login', sessionController.create);   //crear token {post}
  api.get('/logout', sessionController.destroy);  //borrar token {post}

  // User
  api.get('/user/signup', userController.new);                                              //formulario crear usuario {get}
  api.post('/user', userController.create);                                                 //crear usuario {post}
  api.get('/user', userController.index);                                                   //devolver usuarios {get}
  api.get('/user/:userId', userController.show);                                            //devolver usuario :userId {get}
  api.get('/user/:userId/edit', sessionController.loginRequired, userController.edit);      //formulario editar usuario :userId {get}
  api.put('/user/:userId', sessionController.loginRequired, userController.update);         //editar usuario :userId {put}
  api.delete('/user/:userId', sessionController.loginRequired, userController.delete);      //eliminar usuario :userId {delete}
  api.post('/user/:userId/active', sessionController.loginRequired, userController.active); //eliminar usuario :userId {post}

  return api;
};
