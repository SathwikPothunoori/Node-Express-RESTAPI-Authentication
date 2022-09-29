var express = require('express');

const bodyParser = require('body-parser')
var User = require('../models/user')
var userRouter = express.Router();
userRouter.use(bodyParser.json())
 
/* GET users listing. */
userRouter.get('/', function(req, res, next) {
  res.send('respond with a resource');
})

userRouter.post('/signup', function(req, res, next) {
  User.findOne({username:req.body.username})
  .then((user)=>{
    if(user != null){
      var err = new Error(`User with username ${req.body.username} already exists`)
      err.status =403
      next(err)
    }
    else{
        return User.create({
          username:req.body.username,
          password:req.body.password
        })
    }
  })
  .then((user)=>{
    res.statusCode = 200
    res.setHeader('Content-Type' ,  'application/json')
    res.json({status:'Registration Successfull' , user:user})
  } , (err)=> {next(err)})
  .catch((err)=>{next(err)})
});

userRouter.post( '/login', (req,res,next)=>{
  if(!req.session.user)
  { //!req.signedCookies.user for cookies
    var authHeader = req.headers.authorization;
  if(!authHeader){
    var err= new Error("You are not authenticated!!")

    res.setHeader('WWW_Authenticate' , 'Basic')
    err.status = 401;
    return next(err)
  }

  var  auth = new Buffer.from(authHeader.split(' ')[1] , 'base64').toString().split(':');

  var username = auth[0];
  var password = auth[1];
  User.findOne({username:username})
  .then((user)=>{
    if(user==null){
    var err= new Error("User "+username+" does'nt exist!!")
    err.status = 403;
    next(err)
    }
    else if(user.password!==password){
      var err= new Error("User password incorrect!!")
      err.status = 403;
      next(err)
    }
   else if(user.username===username && user.password===password){
      // for cookie res.cookie('user','admin',{signed:true}) 
      req.session.user='authenticated'
      res.statusCode=200
      res.setHeader('Content-Type' ,  'text/plain')
      res.end('You are authenticated!!') 
      
    }
  })
  .catch((err)=>{next(err)})
  
}
else{
  res.statusCode=200
  res.setHeader('Content-Type' ,  'text/plain')
  res.end('You are already authenticated!!') 

}
})

userRouter.get('/logout',(req,res,next)=>{
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id')
    res.redirect('/');
  }
  else{
    var err= new Error("You are not logeed in!!") 
      err.status = 403;
      next(err)
  }
})
module.exports = userRouter;
