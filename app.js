var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db=require('./config/connection');
var hbs = require('express-handlebars');
var usersRouter = require('./routes/users');
var tutorRouter = require('./routes/tutor');
var app = express();
 app.io = require('socket.io')();
const fileUpload = require('express-fileupload')
const session=require('express-session')
const MongoStore = require('connect-mongo')(session)
var objectId=require('mongodb').ObjectId



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs')
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

app.use(session({
  store: new MongoStore({
      url:'mongodb+srv://admin:CNojm0HyXo4iA9Z5@cluster0.shb7d.mongodb.net/classRoom?retryWrites=true&w=majority'
  }),

  secret: 'keyyyyyy',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 * 2 // two weeks
    }
})); 

const exhbs= hbs.create({
  extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/',partialsDir:__dirname+'/views/partials/',
  helpers:{
    iff:(a,b,options)=>{
     console.log("A,B",a,b)
      a=a.toString();
      b=b.toString();
      if ( a === b ){
       
        return "<h2>"+ options.fn({status:true}) +"</h2>"
      }
    },
    Inn:(array,day,options)=>{
      let exits=array.findIndex(att=>att.Date==day)
     
      if(exits!=-1){
        return "<h2>"+options.fn({inn:true}) +"</h2>"
      }else{
        return "<h2>"+options.fn({inn:false}) +"</h2>"
      }
    },ifId:(a,b,options)=>{
      console.log("A,B",a,b)
       
       if ( objectId(a).toString() === objectId(b).toString() ){
        console.log("trueeee")
         return "<h2>"+ options.fn({status:true}) +"</h2>"
       }else{
         console.log("false...")
        return "<h2>"+ options.fn({status:false}) +"</h2>"
       }
     }
  }

})

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
