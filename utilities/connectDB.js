var Connection = require("../models/connection.js");
var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
  connectionId: { type: String, required: true, default: 000 },
  connectionHeading: { type: String, required: true, default: "Animals for Petting" },
  connectionName: { type: String, required: true, default: "Cats" },
  details: { type: String, required: true, default: "Details about event" },
  date: { type: String, required: true, default: "01-30-2020" },
  time: { type: String, required: true, default: "5:30 pm" },
  place: { type: String, required: true, default: "Charlotte" },
  image: { type: String, required: true, default: "../assets/images/paws.jpg" },
  hostedBy: { type: String, required: true, default: "Dev" },
  going: { type: String, required: true, default: "0" },
});

var Data = mongoose.model('Connection', Schema);

class ConnectionDB {
  
  addConnection(connection) {
    return new Promise((resolve, reject) => {
      Data
        .findOneAndUpdate(
          {
            $and: [
              { connectionId: connection.getconnectionId() },
              { connectionHeading: connection.getheading() },
              { connectionName: connection.getname() },
              { details: connection.getdetails() },
              { hostedBy: connection.gethostedBy() },
              { image: connection.getimage() },
              { going: connection.getgoing() }
            ],
          },
          {
            $set: {
              time: connection.gettime(),
              date: connection.getdate(),
              place: connection.getplace()
            }
          },
          { new: true, upsert: true },
          function (err, data) {
            console.log("connection successfully updated or added.");
            console.log(data);
            resolve(data);
          }
        )
        .catch((err) => {
          return reject(err);
        });
    });
  } 

  getConnections() {
    return new Promise((resolve, reject) => {
      Data
        .find({})
        .then((data) => {
          console.log("Connections fetched from database");

          var connections = [];
          data.forEach((connection) => {
            var item = new Connection();

            item.setconnectionId(connection.connectionId);
            item.setheading(connection.connectionHeading);
            item.setname(connection.connectionName);
            item.setdetails(connection.details);
            item.setdate(connection.date);
            item.settime(connection.time);
            item.setimage(connection.image);
            item.sethostedBy(connection.hostedBy);
            item.setgoing(connection.going);

            connections.push(item);
          });

          
          resolve(connections);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  } 

  
  getConnection(connectionId) {
    return new Promise((resolve, reject) => {
      Data
        .find({
          $or: [{ connectionId: connectionId }],
        })
        .then((data) => {
          console.log('getconnection data', data)
          var item = new Connection();

          item.setconnectionId(data[0].connectionId);
          item.setheading(data[0].connectionHeading);
          item.setname(data[0].connectionName);
          item.setdetails(data[0].details);
          item.setdate(data[0].date);
          item.settime(data[0].time);
          item.setplace(data[0].place);
          item.setimage(data[0].image);
          item.sethostedBy(data[0].hostedBy);
          item.setgoing(data[0].going);

          
          resolve(item);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  } 

  getLastConnectionID(){
    return new Promise((resolve, reject) => {
      Data
        .find({})
        .sort({connectionId: -1})
        .limit(1)
        .then((item) => {
          resolve(item);
        })
        .catch((err) => {
          return reject(err);
        });
    });
  }

}

module.exports = ConnectionDB;
