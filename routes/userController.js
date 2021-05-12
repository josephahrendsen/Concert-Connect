const express = require('express');
const router = express.Router();

var bodyParser = require('body-parser');
const session = require('express-session');
const User = require('../models/user');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))
router.use(express.json());
router.use(express.urlencoded());
//var urlencodedParser = bodyParser.urlencoded({ extended: true });

router.post("/login", async function(req, res) {
    var UserDB = require("../util/UserDB");
    var UserProfileDB = require("../util/UserProfileDB");

    try {
        // Create userDB model object
        var userDB = new UserDB();

        // Get hardcoded user from database to use for all sessions
        var user = await userDB.getUser("paulblart@gmail.com", 5);

        // Add user object to session
        req.session.theUser = user

        // Create userProfileDB model object. Initalize with user and empty list of userConnections
        var userProfileDB = new UserProfileDB(req.session.theUser, []);

        // Find matching userProfile from userID
        var userProfile = await userProfileDB.getUserProfile(user[0]._id);

        console.log("userProfile at login");
        console.log(userProfile);

        // Add userProfile to session: Contains user and starts with empty list of connections
        req.session.userProfile = userProfile[0];

        res.render('savedConnections.ejs', {theUser: userProfile[0].user, userConnections: userProfile[0].userConnections});  

    } catch(err) {
        console.log(err);
        res.render("404");
    }
});

router.get("/login", function(req, res) { 
    res.render('login.ejs');
});

router.get("/signout", function(req, res) {
    req.session.destroy();
    console.log('Session destroyed');

    res.render('index.ejs');
});

router.post("/rsvp", async function(req, res) {
    if(typeof req.session.userProfile == 'undefined') {
        res.render('login.ejs');
    } else {
        var UserProfileDB = require("../util/userProfileDB");
        var ConnectionDB = require("../util/ConnectionDB");
        var UserDB = require("../util/UserDB")

        // Create a new userProfile to deserialize data from session.
        var userProfile = new UserProfileDB(req.session.userProfile.user, req.session.userProfile.userConnections);

        // Get ID for connection
        var connectionID = req.session.connectionModel.id;

        // Create connectionDB model object and find matching connection
        var connectionDB = new ConnectionDB();
        var connection = await connectionDB.getConcertFromID(connectionID);

        // Create userDB model object and find hardcoded user.
        var userDB = new UserDB();
        var currentUser = await userDB.getUser("paulblart@gmail.com", 5);
        
        // Update matching userConnection from userProfiles collection within database
        await userProfile.updateUserConnection(connection, req.body.rsvp, currentUser[0]._id);

        // Create a new userProfile model object and get the updated userProfile from db
        var updatedUserProfile = new UserProfileDB();
        var updatedUserProfile = await userProfile.getUserProfile(currentUser[0]._id);

        // Add updated userProfile back to session
        req.session.userProfile = updatedUserProfile[0];

        console.log("userProfile after updating:");
        console.log(updatedUserProfile[0]);

        res.render('savedConnections.ejs', {theUser: req.session.userProfile.user, userConnections:req.session.userProfile.userConnections});
    }
});

router.post("/savedConnections/delete", async function(req, res) {
    if(typeof req.session.userProfile == 'undefined') {
        res.render('login.ejs');
    } else {
        var UserProfileDB = require("../util/userProfileDB");
        var ConnectionDB = require("../util/ConnectionDB");
        var UserDB = require("../util/UserDB")

        // Create a new userProfile to deserialize data from session.
        var userProfile = new UserProfileDB(req.session.userProfile.user, req.session.userProfile.userConnections);

        // Get ID for connection
        var connectionID = req.body.delete;

        // Create connectionDB model object and find matching connection
        var connectionDB = new ConnectionDB();
        var connection = await connectionDB.getConcertFromID(connectionID);
        
        // Create userDB model object and find hardcoded user.
        var userDB = new UserDB();
        var currentUser = await userDB.getUser("paulblart@gmail.com", 5);

        // Delete matching userConnection from userProfiles collection within database
        await userProfile.deleteUserConnection(connection, req.body.rsvp, currentUser[0]._id);

        // Create a new userProfile model object and get the updated userProfile from db
        var updatedUserProfile = new UserProfileDB();
        var updatedUserProfile = await userProfile.getUserProfile(currentUser[0]._id);

        // Add updated userProfile back to session
        req.session.userProfile = updatedUserProfile[0];
        
        console.log("userProfile after updating:");
        console.log(updatedUserProfile[0]);

        res.render('savedConnections.ejs', {theUser: req.session.userProfile.user, userConnections:req.session.userProfile.userConnections});
    }
});

router.get("/savedConnections", async function(req, res) {
    res.render('savedConnections.ejs', {theUser: req.session.userProfile.user, userConnections:req.session.userProfile.userConnections});
});


module.exports = router;