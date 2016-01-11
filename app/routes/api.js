var multer = require('multer');
var upload_user = multer({ dest: 'public/uploads/user/' });
var upload_item = multer({ dest: 'public/uploads/item/' });

// Controllers
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');
var cartController = require('../controllers/cart_controller');
var itemController = require('../controllers/item_controller');

// API
module.exports = function (app, express) {

  var api = express.Router();

  // Home page
  api.get('/', function(req, res, next){
    res.render( 'index', {session: res.locals.session});
  });

  // Autoload de comandos
  api.param('userId', userController.load);                                                 //autoload usuario id
  api.param('itemId', itemController.load);                                                 //autoload articulo id

  // Session
  api.get('/login', sessionController.new);                                                 //formulario crear token {get}
  api.post('/login', sessionController.create);                                             //crear token {post}
  api.get('/logout', sessionController.destroy);                                            //borrar token {post}

  // User

  api.get('/user/signup', userController.new);                                              //formulario crear usuario {get}
  api.post('/user', userController.create);                                                 //crear usuario {post}
  api.get('/user', userController.index);                                                   //devolver usuarios {get}
  api.get('/user/:userId', userController.show);                                            //devolver usuario :userId {get}
  api.get('/user/:userId/edit', sessionController.loginRequired, userController.edit);      //formulario editar usuario :userId {get}
  api.put('/user/:userId', sessionController.loginRequired, userController.update);         //editar usuario :userId {put}
  api.delete('/user/:userId', sessionController.loginRequired, userController.delete);      //eliminar usuario :userId {delete}
  api.post('/user/:userId/active', sessionController.loginRequired, userController.active); //activar usuario :userId {post}
  api.post('/user/loadImg', upload_user.single('user[img]'), userController.loadImg);       //cargar imagen {post}

  // Cart
  api.get('/cart/add_item', cartController.add_item);                                       //aniadir articulo a linea de pedido {get}
  api.get('/cart/add_qty', cartController.add_qty);                                         //sumar cantidad de articulos {get}
  api.get('/cart/remove_item', cartController.remove_item);                                 //borrar articulo de linea de pedido {get}
  api.get('/cart/total', cartController.total);                                             //obtener el total en pesos {get}

  // Item
  api.get('/item/new', sessionController.loginRequired, itemController.new);                //formulario crear articulo {get}
  api.post('/item', sessionController.loginRequired, upload_item.single('item[img]'), itemController.create);//crear articulo {post}
  api.get('/item', itemController.index);                                                   //devolver articulos {get}
  api.get('/item/:itemId', itemController.show);                                            //devolver articulo :itemId {get}
  api.get('/item/:itemId/edit', sessionController.loginRequired, itemController.edit);      //formulario editar articulo :itemId {get}
  api.put('/item/:itemId', sessionController.loginRequired, itemController.update);         //editar articulo :itemId {put}
  api.delete('/item/:itemId', sessionController.loginRequired, itemController.delete);      //eliminar articulo :itemId {delete}

  return api;
};
