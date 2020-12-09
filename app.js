var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db=require('./config/connection');
var hbs = require('express-handlebars');
var usersRouter = require('./routes/users');
var tutorRouter = require('./routes/tutor');
var session=require('express-session')
var app = express();
const fileUpload = require('express-fileupload')
const fs = require('fs')


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload())
app.use(express.static(path.join(__dirname, 'public')));
db.connect((err)=>{
  if(err) console.log("connection error:",err)
  else console.log("Database Connected*")
})
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})
app.use(session({secret:"Key",cookie:{maxAge:600000}}))
const exhbs=hbs.create({ extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/',partialsDir:__dirname+'/views/partials/'});
app.engine('hbs',exhbs.engine)
app.use('/', usersRouter);
app.use('/admin',tutorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
