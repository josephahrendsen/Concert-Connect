const mongoose = require('mongoose');
const dbPath = 'mongodb://localhost/ConcertConnect';
const User = require('../models/user');

// Connect to db
mongoose.connect(dbPath, {useNewUrlParser:true, useUnifiedTopology: true})
.then(function(result){
    console.log('mongoDB connected');
})
.catch(function(error){
    console.log('Error : ' + error);
}) 

class UserDB {
    getUser(email, userID) {
        return new Promise(function(resolve, reject) {
            User.find({email: email, _id: userID}, function (err, data) {
                if (err) return console.error(err);
                resolve(data);
            });     
        });
    }
}

module.exports = UserDB;