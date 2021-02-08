var User = require("../models/user.js");
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  User_id: { type: String, default: "AB00", required: true },
  First_Name: { type: String, default: "Dev", required: true },
  Last_Name: { type: String, default: "Bhadoria" },
  Email_Address: { type: String, default: "dev@gmail.com" },
  City: { type: String, default: "Charlotte" },
  State: { type: String, default: "NC" },
  Country: { type: String, default: "United States" },
  Password: {type:String}
});

var Data = mongoose.model('User', Schema);

class UserDB {
  getUser(userId, Password) {
    return new Promise((resolve, reject) => {
      Data
        .find({
          $and: [{ User_id: userId ,Password: Password}],
        })
        .then((data) => {
          if(data.length != 0){
          var useritem = new User();

          useritem.setUserID(data[0].User_id);
          useritem.setFirstName(data[0].First_Name);
          useritem.setLastName(data[0].Last_Name);
          useritem.setEmailAddress(data[0].Email_Address);
          useritem.setCity(data[0].City);
          useritem.setState(data[0].State);
          useritem.setCountry(data[0].Country);
          useritem.setPassword(data[0].Password);

          
          resolve(useritem);
          } else {
            resolve("");
          }
        })
        .catch((err) => {
          return reject(err);
        });
    });
  } 
  addNewUser(user) {
    return new Promise((resolve, reject) => {
      var newUser = new Data({
        User_id: user.getUserID(),
        First_Name: user.getFirstName(),
        Last_Name: user.getLastName(),
        Email_Address: user.getEmailAddress(),
        City: user.getCity(),
        State: user.getState(),
        Country: user.getCountry(),
        Password: user.getPassword()
      });
  
      newUser.save(function (err, data) {
        console.log("user added.");
        console.log(data);
        if (data) resolve(data);
        else return reject(err);
      });
    });
  } 

}




module.exports = UserDB;
