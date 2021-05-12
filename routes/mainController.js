const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {theUser: req.session.theUser});
});

router.get('/about', function(req, res, next) {
    res.render('about', {theUser: req.session.theUser});
});

router.get('/contact', function(req, res, next) {
    res.render('contact', {theUser: req.session.theUser})
});

module.exports = router;

