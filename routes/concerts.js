const express = require('express');
const router = express.Router();

var bodyParser = require('body-parser');
const { json } = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }))
router.use(express.json());
router.use(express.urlencoded());

router.get("/", function(req, res) {
    res.render('connections', {theUser: req.session.theUser});
});

router.post("/", async function(req, res) {
    if(typeof req.session.userProfile == 'undefined') {
        res.render('login.ejs');
    } else {
        var ConnectionDB = require("../util/ConnectionDB");
        var UserDB = require("../util/UserDB");
        var UserProfileDB = require("../util/userProfileDB");

        // Create a new userProfile to deserialize data from session.
        var userProfile = new UserProfileDB(req.session.userProfile.user, req.session.userProfile.userConnections);

        // Create userDB model object and find matching hardcoded user
        var userDB = new UserDB();
        var currentUser = await userDB.getUser("paulblart@gmail.com", 5);
        
        // Create connectionDB model object and create a new connection (concert)
        var connectionDB = new ConnectionDB();
        var newConnection = await connectionDB.createNewConnection(
            currentUser[0], req.body.band, req.body.genre, req.body.details, req.body.where, req.body.date, req.body.time
        );

        // Update matching userConnection from userProfiles collection within database
        await userProfile.updateUserConnection(newConnection, "Yes", currentUser[0]._id);

        // Create a new userProfile model object and get the updated userProfile from db
        var updatedUserProfile = new UserProfileDB();
        var updatedUserProfile = await userProfile.getUserProfile(currentUser[0]._id);

        // Add updated userProfile back to session
        req.session.userProfile = updatedUserProfile[0];

        res.render('connections', {theUser: req.session.userProfile.user});
    }
});

router.get("/:genre", async function(req, res) {
    var Concert = require("../util/ConnectionDB");
    try {
        var concertModel = new Concert();
        var requestedBands = await concertModel.getBands(req.params.genre);
        
        res.render('connectionsExpanded', {bands: requestedBands, theUser: req.session.theUser});
    } catch(err) {
        console.log(err);
        res.render("404");
    }
});

router.get("/:genre/:band", async function(req, res) { 
    var Concert = require("../util/ConnectionDB");

    try {
        // Create model object
        var concertModel = new Concert();

        // This is where we will check if genre and band are valid queries in database.
        var requestedBands = await concertModel.getBands(req.params.genre);
        var requestedBand = await concertModel.getBandNoSpaces(req.params.band);
        
        //add another layer to check for genre too
        var validBand = function() {
            for(var i = 0; i < requestedBands.length; i++) {
                if(requestedBands[i].id == requestedBand.id) {
                    return true;
                }
            }
            return false;
        };

        if(requestedBand == '404' || validBand() == false) {
            res.status(404).render('404'); //fix error of going to 404 page, then coming back to connections and route being genres/genres/rock
        } else {
            // Add concertModel to session
            req.session.connectionModel = requestedBand;
    
            res.render('connection', {band: requestedBand, theUser: req.session.theUser});
        }
    } catch(err) {
        console.log(err);
        res.render("404");
    }
});

router.post("/:genre/:band", async function(req, res) { 
    var Concert = require("../util/ConnectionDB");

    // Create model objects
    var concertModel = new Concert();

    // This is where we will check if genre and band are valid queries in database.
    var requestedBands = await concertModel.getBands(req.params.genre);
    var requestedBand = await concertModel.getBandNoSpaces(req.params.band);

    //add another layer to check for genre too
    var validBand = function() {
        for(var i = 0; i < requestedBands.length; i++) {
            if(requestedBands[i].id == requestedBand.id) {
                return true;
            }
        }
        return false;
    };

    if(requestedBand == '404' || validBand() == false) {
        res.status(404).render('404'); // need to fix error of going to 404 page, then coming back to connections and route being genres/genres/rock
    } else {
        // Add concertModel to session
        req.session.connectionModel = requestedBand;

        res.render('connection', {band: requestedBand, theUser: req.session.theUser});
    }
});



router.get('/newConnection', function (req, res, ) {
    var requestedBand = concertModel.getBandNoSpaces(req.params.band);

    res.render('newConnection', {band: requestedBand, theUser: req.session.theUser});
});

module.exports = router;