'use strict'

const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const cors          = require('cors');

const session = require('express-session');
const {Pool}  = require('pg')

let app     = express();
let pool    = new Pool({
  user        : 'zul',
  host        : 'localhost',
  database    : 'project_management',
  password     : '1234',
  port: 5432,
})
pool.connect();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', './images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use(session({
  secret: '2C44-4D44-WppQ38S',
  resave: true,
  saveUninitialized: true
}));
app.use(cors())

//untuk mendaftarkan router
let index         = require('./routes/index')(pool);
let projects      = require('./routes/projects')(pool);
let profile       = require('./routes/profile')(pool);
let user          = require('./routes/user')(pool);
app.use('/',          index);
app.use('/projects',  projects);
app.use('/profile',   profile);
app.use('/user',      user);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
