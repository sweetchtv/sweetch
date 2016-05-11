var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stylus = require('stylus');
var nib = require('nib');
var session = require('express-session');

var credentials = require('./credentials');
var Account = require('./models/account')

var publicDir = path.join(__dirname, 'public');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser(credentials.secret));
app.use(stylus.middleware({
  src: path.join(__dirname, 'public/stylesheets'),
  dest: path.join(__dirname, 'public/stylesheets'),
  compile: function(str, path){
    return stylus(str)
    .set('compress', true)
    .use(nib())
  },
  debug: true,
  force: true
}))
app.use(express.static(publicDir));

app.use(session({
  secret: credentials.secret,
  saveUninitialized: false,
  resave: false
}));

app.use(function(req, res, next){
  res.locals.flash = req.session.flash || {};
  req.session.flash = {};
  next();
});
app.use(function(req, res, next){
  Account.findOne({_id: req.session.signedAccountId}, function(err, account){
    if(err){
      console.error(err.stack)
      return next(err)
    }
    req.session.signedAccount = account
    res.locals.signedAccount = account
    next()
  })
}, function(req, res, next){
  req.isSigned = function(){
    return !!req.session.signedAccountId
  }
  req.logout = function(){
    req.session.signedAccountId = undefined
  }
  next()
})
app.use(function(req, res, next){
  res.renderWithAsset = function(url, locals){
    res.locals.cssPath = '/' + path.join('stylesheets', url+'.css');
    res.locals.jsPath = '/' + path.join('javascripts', url+'.js');
    res.render(url, locals);
  };
  next();
});

var main = require('./routes/main');
var photos = require('./routes/photos');
var accounts = require('./routes/accounts');

app.use('/', main);
app.use('/photos', photos);
app.use('/accounts', accounts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
