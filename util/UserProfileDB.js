const mongoose = require('mongoose');
const dbPath = 'mongodb://localhost/ConcertConnect';
const UserProfile = require('../util/userProfile');
const Connection = require("../models/connection");
const UserConnection = require('../models/userConnection');


// Connect to db
mongoose.connect(dbPath, {useNewUrlParser:true, useUnifiedTopology: true})
.then(function(result){
    console.log('mongoDB connected');
})
.catch(function(error){
    console.log('Error : ' + error);
}) 

class UserProfileDB {
    constructor(user, userConnections) {
        this.user = user;
        this.userConnections = userConnections;
    }

    async getUserProfile(userID) {                
        return new Promise(async function(resolve, reject) {
            await UserProfile.find({'user._id': userID}, function (err, data) {
                if (err) reject(err);
                resolve(data);
            });     
        });
    }

    getUserConnections() {
        return new Promise(function(resolve, reject) {
            UserProfile.find(function (err, data) {
                if (err) reject(console.error(err));
                resolve(data);
            });     
        });
    }

    // Pass in a user connection object to add to list. 
    async updateUserConnection(connection, rsvp, userID){
        var userConnection = {
            connection: connection,
            rsvp: rsvp
        };

        // Find matching userProfile from userID
        var userProfile = await UserProfile.find({'user._id': userID})

        var updatedUserConnections = userProfile[0].userConnections;

        var update = false;
        // Update an existing userConnection and save it to db
        for(var i=0; i<updatedUserConnections.length; i++) {
            if (userConnection.connection.id == updatedUserConnections[i].connection.id) {
                update = true;
                updatedUserConnections[i].rsvp = userConnection.rsvp;
                await UserProfile.findOneAndUpdate({'user._id': userID}, {$set: { userConnections: updatedUserConnections}}, {new: true});
            } 
        }

        // Insert a new userConnection and save it to db
        if(update == false) {
           updatedUserConnections.push(userConnection);
           await UserProfile.findOneAndUpdate({'user._id': userID}, {$set: { userConnections: updatedUserConnections}});
        }
    }
    
    async deleteUserConnection(connection, rsvp, userID){
        var userConnection = {
            connection: connection,
            rsvp: rsvp
        };

        // Find matching userProfile from userID
        var userProfile = await UserProfile.find({'user._id': userID})

        var updatedUserConnections = userProfile[0].userConnections;

        // Delete a userConnection
        for(var i=0; i<updatedUserConnections.length; i++) {
            if (userConnection.connection.id == updatedUserConnections[i].connection.id) {
                updatedUserConnections.splice(i, 1);
                await UserProfile.findOneAndUpdate({'user._id': userID}, {$set: { userConnections: updatedUserConnections}}, {new: true});
            } 
        }
    }
}

module.exports = UserProfileDB;

