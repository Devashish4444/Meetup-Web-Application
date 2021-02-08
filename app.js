var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pets", { useNewUrlParser: true , useUnifiedTopology: true  });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

app.set('view engine', 'ejs');

app.use( session({secret: 'Dev'}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/assets', express.static('assets'));

db.once("open", function(){
  var controller = require('./routes/controller');
  var usercontroller = require('./routes/UserController');
  app.use('/',usercontroller);
  app.use('/',controller);
  app.listen(8080, function(){
    console.log('Yo dawg, Server is listening on port 8080...');
  });
});