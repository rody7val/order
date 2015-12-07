var express = require("express");
var favicon = require('serve-favicon');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var models = require('./app/models/models.js');
var methodOverride  = require('method-override');
var morgan = require("morgan");
var config = require("./config");
var cors = require('cors');
var path = require('path');
var app = express();


// Using CORS to reduce CROSS Origine.
app.use(cors());
app.use(morgan('dev'));

app.use(favicon(__dirname + '/public/favicon.ico'));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser('semilla'));
app.use(session({
    secret: 'semilla',
    resave: false,
    saveUninitialized: true
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// helper dinamico
app.use(function(req, res, next){
    // guardar path en session.redir para despues de login
    if(!req.path.match(/\/login|\/logout/)){
      req.session.redir = req.path;
    }

    //auto-logout
    var time = Number( new Date().getTime() );
    var timeOut = 4200; // 120 == 2 minutos
    if (req.session.contador && req.session.user) {
        if ((time - req.session.contador) > timeOut*1000) {
            delete req.session.user;
            res.redirect('/login');
        }
    }

    req.session.contador = time;
    req.session.cart = models.Cart; //cart

    // hacer visible req.session en las vistas
    res.locals.session = req.session;
    console.log(req.session)
    next();
})

var api = require('./app/routes/api')(app, express);
app.use('/', api);

app.locals.moment = require('moment');

app.use(function(err, req, res, next){
  res.render('error', err);
})

app.listen(config.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Listening on port "+config.port);
    }
});

