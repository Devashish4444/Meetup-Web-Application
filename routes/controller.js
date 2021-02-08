var express = require('express');
var router = express.Router();
var Connection = require('../models/Connection');
var ConnectionDB = require('../utilities/connectDB');
var connectDB = new ConnectionDB();
var UserProfileDB = require('../utilities/userProfileDB');
var UserProfile = new UserProfileDB();
const { check, validationResult } = require('express-validator');

async function IdValidation(req,res,connectionId){
  var connectionId = String(req.query.connectionId).match(/^[a-z0-9]+$/);
  
  var connectdata = await connectDB.getConnection(req.query.connectionId);
  if(connectionId !== 0 && connectdata !== undefined){
    res.render('connection', {data: connectdata, session: req.session.userSession});
  }
}

router.get('/', function(req, res){
  res.render('index', {session: req.session.userSession});
});

router.get('/index', function(req, res){
  res.render('index', {session: req.session.userSession});
});

router.get('/newconnection', function(req, res){
  if (req.session.userSession) {
    res.render('newConnection', { session: req.session.userSession, errors: undefined });
  } else {
    
    res.redirect('/login');
  }
});

router.post('/newconnection',
[
   
  check('topic').matches(/^[a-zA-Z ]*$/).withMessage('"Topic" must only contain letters'),
  check('name').matches(/^[a-zA-Z ]*$/).withMessage(' "Name" must only contain letters'),
  check('details').matches(/^[a-zA-Z0-9 ]*$/).withMessage(' "Details" must only contain letters and numbers'),
  check('where').matches(/^[a-zA-Z0-9 ]*$/).withMessage('"Where" must only contain letters and numbers'),
  check('when').matches( /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/).withMessage('"When" must be after todays date')
  .custom((value, {req})=>{
    var Time = new Date().toJSON().split('T')[0];
     var value = req.body.when;
     
     if(value <= Time)
     {
       throw new Error('date should be after todays date');
     }
     return true;
  }),
  check('time').matches("([0-9]|0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])").withMessage('Enter Time in hh:mm '), 
],

async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    var validateArr = [];
    errors.array().forEach(function(item){
      validateArr.push('Invalid value'+ " " + item.value + " " + item.msg);
    });
    console.log('validateArr', validateArr);
    return res.render('newConnection', { session: req.session.userSession, errors: validateArr})
  }
  if (Object.keys(req.body).length != 0) {
    if (req.body.addConn) {
      var lastConn =  await connectDB.getLastConnectionID();
      var id = lastConn[0].connectionId;
      var name = req.body.name;
      var topic = req.body.topic;
      var details = req.body.details;
      var time = req.body.time;
      var date = req.body.when;
      var place = req.body.where;
      var host = req.session.userSession.First_Name;
      var imageUrl = '../assets/images/paws.jpg';
      var going = "1";

      
      var Model = new Connection();

      Model.setconnectionId(parseInt(id)+1);
      Model.setheading(topic);
      Model.setname(name);
      Model.setdetails(details);
      Model.settime(time);
      Model.setdate(date);
      Model.setplace(place);
      Model.sethostedBy(host);
      Model.setimage(imageUrl);
      Model.setgoing(going);

      
      var newConnection = await connectDB.addConnection(Model);
      
     
      await UserProfile.updateRSVP(req.session.userSession.User_id, newConnection, "Yes");

      res.redirect('/savedConnections');
    }
  } else {
    res.render('connections', { session: req.session.userSession });
  }
});


router.get('/about',function(req,res){
  res.render('about', {session: req.session.userSession});
});

router.get('/contact',function(req,res){
  res.render('contact', {session: req.session.userSession});
});

router.get('/connections', async function(req, res){
  var Heading = {}
  var connectionInfo = await connectDB.getConnections();

 
  connectionInfo.forEach(function(conn){
    if(conn.connectionHeading in Heading){
      Heading[conn.connectionHeading ].push([conn.connectionName, conn.connectionId]);
    } else {
      Heading[conn.connectionHeading ] = [[conn.connectionName, conn.connectionId]];
    }
  });
  res.render('connections', {data:Heading, session: req.session.userSession});
});

router.get('/connection', function(req, res){
  IdValidation(req, res, req.query.connectionId);
});

router.post('/connection', function(req, res){
  IdValidation(req, res, req.query.connectionId);
});

router.get('/*', function(req, res){
  res.render('404', {session: req.session.userSession});
});


module.exports = router;




