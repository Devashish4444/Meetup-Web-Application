
var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
var connectionDB = require('../utilities/connectDB');
var connectDB = new connectionDB();
var UserProfileDB = require('../utilities/userProfileDB');
var UserProfile = new UserProfileDB();
var User = require('../utilities/userDB');
var userDB = new User();
var newUser = require('../models/user');
var urlencodedParser = bodyParser.urlencoded({extended: false});
const { check, validationResult } = require('express-validator');


router.get('/signup', function(req,res){
  
  res.render('signup',{session: undefined, errors: null});
});

router.post('/signup',
[
   
  check('userid').matches(/^[a-zA-Z0-9 ]*$/).withMessage(' "Userid" must only contain letters and numbers'),
  check('firstname').matches(/^[a-zA-Z ]*$/).withMessage(' "First Name" must only contain letters'),
  check('lastname').matches(/^[a-zA-Z ]*$/).withMessage('"Last Name" must only contain letters'),
  check('emailaddress').isEmail().withMessage(' "email" must be a valid email address'),
  check('city').matches(/^[a-zA-Z ]*$/).withMessage('"City" must only contain letters'),
  check('state').matches(/^[a-zA-Z ]*$/).withMessage('"State" must only contain letters'),
  check('country').matches(/^[a-zA-Z ]*$/).withMessage('"Country" must only contain letters'),
  check('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).withMessage(' "Password" must contain at least one number and one uppercase and lowercase letter, one special character and at least 8 or more characters'),
  
],
async function(req,res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var validateArr = [];
    errors.array().forEach(function(item){
      validateArr.push('Invalid value'+ " " + item.value + " " + item.msg);
    });
    return res.render('signup', { errors: validateArr, session: undefined})
  }

  var userid = req.body.userid;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var emailaddress = req.body.emailaddress;
  var city = req.body.city;
  var state = req.body.state;
  var country = req.body.country;
  var password =req.body.password;

  var Model = new newUser();

Model.setUserID(userid);
Model.setFirstName(firstname);
Model.setLastName(lastname);
Model.setEmailAddress(emailaddress);
Model.setCity(city);
Model.setState(state);
Model.setCountry(country);
Model.setPassword(password);

await userDB.addNewUser(Model);

res.redirect('/login');
});



router.get('/login', function(req, res){
  res.render('login', {session: undefined, signIn: undefined, errors: null});
});

router.post('/login', 
[
   
check('username').matches(/^[a-zA-Z0-9 ]*$/).withMessage(' "Username" must only contain letters and numbers'),
check('password').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/).withMessage(' "Password" must contain at least one number and one uppercase and lowercase letter, one special character and at least 8 or more characters'),
  
],


async function(req, res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var validateArr = [];
    errors.array().forEach(function(item){
      validateArr.push('Invalid value'+ " " + item.value + " " + item.msg);
    });
  }

  if(req.body.username){
    var uname = req.body.username;

    if(req.body.password){
      var pass = req.body.password;
      var user = await userDB.getUser(uname, pass);
   
      if(user != "" || user.length != 0){
 
        req.session.userSession = user;

        res.redirect('savedConnections');
      } else {
        req.session.signIn = "Nil";
        res.render('login', { session: undefined, signIn: req.session.signIn, errors: validateArr});
      }

    }
  } else {
    res.render('login', { session: undefined, signIn: undefined});
  }

});


router.get('/logout', function(req, res){
  req.session.destroy(function(err){
    if(err){
      res.negotiate(err);
    }
    res.redirect('/');
  });
});


router.get('/savedConnections', async function(req, res){
  if (req.session.userSession != undefined) {

    
    req.session.listSession = await UserProfile.getUserProfile(req.session.userSession.User_id);
    console.log('req.session.userSession.User_id', req.session.userSession.User_id)
   
    var userList = req.session.listSession;
    var usersession = req.session.userSession;
    
    res.render('savedConnections', { userConnList: userList, session: usersession });
  } else {
    
    res.redirect('/login');
  }
});

router.post('/savedConnections', urlencodedParser, async function(req, res){
  
  var newSession = req.session.userSession;
  
  var action = req.query.action;
 
  var Id = req.query.connectionId;
  
  var Response = req.body.response;

  if(action == 'save'){
    await UserProfile.updateRSVP(newSession.User_id, await connectDB.getConnection(Id), Response);

    
  } else if(action == 'delete'){
    await UserProfile.removeConnection(await connectDB.getConnection(Id));
  }
  var Profile = await UserProfile.getUserProfile(newSession.User_id);

  console.log('here currentUserProf', Profile);
  req.session.listSession = Profile;

  
  res.render('savedConnections',{userConnList: req.session.listSession, session: newSession });

});

module.exports = router;
