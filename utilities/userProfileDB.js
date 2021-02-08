var UserConnection = require("../models/UserConnection");

var mongoose = require('mongoose');

var Connect = new mongoose.Schema({
  connectionId: { type: String, required: true },
  connectionHeading: { type: String, required: true },
  connectionName: { type: String, required: true }
});

var UserSchema = new mongoose.Schema({
  User_id: { type: String, required: true },
  connection: Connect,
  rsvp: { type: String, default: "Yes", required: true }
});

var userData = mongoose.model('UserProfile', UserSchema);

class UserProfileDB {

  getUserProfile(userId) {
    return new Promise((resolve, reject) => {
      userData
        .find({
          $or: [{ User_id: userId }],
        })
        .then((data) => {
          var userList = [];
          data.forEach((item) => {
            
            var userObj = new UserConnection();

            userObj.setConnection(item.connection);
            userObj.setRsvp(item.rsvp);

            userList.push(userObj);
           
          })
          
          resolve(userList);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  } 

  
  updateRSVP(userId, conn, rsvp) {
    return new Promise((resolve, reject) => {
      userData
        .findOneAndUpdate(
          {
            $and: [
              { User_id: userId },
              { "connection.connectionId": conn.connectionId },
            ],
          },
          {
            $set: {
              User_id: userId,
              connection: conn,
              rsvp: rsvp
            }
          },
          { new: true, upsert: true },
          function (err, data) {
            console.log("RSVP is updated or added");
            console.log(data);
            resolve(data);
          }
        )
        .catch((err) => {
          return reject(err);
        });
    });
  } 

 
  removeConnection(conn) {
    return new Promise((resolve, reject) => {
      userData
        .deleteOne({
          "connection.connectionId": conn.connectionId
        })
        .then(function () {
          resolve();
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

}

module.exports = UserProfileDB;
