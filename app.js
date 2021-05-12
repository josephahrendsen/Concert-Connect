const express = require('express');
const app = express();
var session = require('express-session');

// view engine setup
app.set('view engine', 'ejs');

// Session setup
app.use(session({
    secret: 'word',
    resave: false,
    saveUninitialized: true
}));

app.get('/:genre/newConnection', function(req, res){
    res.render('newConnection');
});

app.get('/:genre/savedConnections', function(req, res){
    console.log("in app: savedConnections");
    console.log(req.session.userProfile.userConnections);
    res.render('savedConnections.ejs', {theUser: req.session.userProfile.user, userConnections: req.session.userProfile.userConnections});
});

app.get('/:genre/login', function(req, res){
    res.render('login.ejs');
});

// Setting up static files path
app.use('/assets', express.static('assets'));
app.use('/jquery', express.static('jquery'));



const mainController = require('./routes/mainController.js');
const concerts = require('./routes/concerts.js');
const userController = require('./routes/userController');

// Routes
app.use('/', mainController);
app.use('/genres', concerts);
app.use('/connections', userController);




app.listen(8084, '127.0.0.1');

module.exports = app;