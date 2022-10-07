var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var passport = require('passport')
var authenticate = require('./authenticate')


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter  = require('./routes/dishRouter')
var promRouter  = require('./routes/promoRouter')
var leadRouter  = require('./routes/leaderRouter')


const mongoose = require('mongoose')
const Dishes = require('./models/dishes')

const url = 'mongodb://localhost:27017/conFusion'

const connect = mongoose.connect(url)
connect
.then((db)=>{
  console.log("Connected properly server")
} , (err)=>{
  console.log("Error :" +err)
})


var app = express();

// view engine setup
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('1234-5678-91011-1233'));
app.use(session({
  name:'session-id',
  secret:'1234-5678-91011-1233',
  saveUninitialized: false,
  resave:false,
  store:new fileStore()
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter);
app.use('/users', usersRouter); 

function auth(req , res , next){
    console.log(req.session);
    if(!req.user){ //!req.signedCookies.user for cookies , !req.session.user for session
    
      var err= new Error("You are not authenticated!!")

    //  res.setHeader('WWW_Authenticate' , 'Basic')
      err.status = 403;
     return  next(err)
    }
    else{
      next()
      // if(req.session.user=='authenticated'){ //!req.signedCookies.user for cookies
      //   next()
      // }
      // else{
      // var err= new Error("You are not authenticated!!")
      // err.status = 403;
      // return  next(err)
      // }
    }
    // var  auth = new Buffer.from(authHeader.split(' ')[1] , 'base64').toString().split(':');

    // var username = auth[0];
    // var password = auth[1];

    // if(username==='admin' && password==='password'){
    //   // for cookie res.cookie('user','admin',{signed:true})
    //   req.session.user='admin'
    //   next();
    // }
    // else{
    //   var err= new Error("You are not authenticated!!")

    //   res.setHeader('WWW_Authenticate' , 'Basic')
    //   err.status = 401;
    //   next(err)
    // }
    
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes',dishRouter );
app.use('/promotions', promRouter);

app.set('views', path.join(__dirname, 'views'));

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
