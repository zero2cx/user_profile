/**
 * file: routes/user.js
 */

var filename = __filename.split("/").pop();
var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

/**
 * ROUTE: GET /
 *  display landing page
 */
router.get('/', function(req, res) {
  res.render('landing');
});


/**
 * ROUTE: GET /index
 *  display all users
 */
router.get('/index', function(req, res) {
  User.find({}, function(err, users) {
    if (err) {
      console.error('1 ** error: [%s] %s', filename, err);
      res.redirect('/');
    }
    res.render('index', {
      users: users
    });
  });
});


/**
 * ROUTE: GET /new
 *  display new user form
 */
router.get('/new', function(req, res) {
  res.render('new');
});


/**
 * ROUTE: POST /new
 *  create the current user
 */
router.post('/new', function(req, res) {
  var newUser = new User({
    username: req.body.username,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    avatar_url: req.body.avatar_url,
    email_address: req.body.email_address,
    join_date: req.body.join_date,
    biography: req.body.biography
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.error('2 ** error: [%s] %s', filename, err);
      return res.redirect('new');
    }
    passport.authenticate('local')(req, res, function() {
      console.log(' ++ info: [%s] create user "%s"', filename, user.username);
      res.render('show', {
        user: user
      });
    });
  });
});


/**
 * ROUTE: POST /login
 *  login the current user
 */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/loginSuccess',
  failureRedirect: '/loginFailure'
}), function(req, res) {
  //empty callback
});

router.get('/loginSuccess', function(req, res, next) {
  res.redirect('back');
});

router.get('/loginFailure', function(req, res, next) {
  res.redirect('back');
});


/**
 * ROUTE: GET /logout
 *  log out the user
 */
router.get('/logout', function(req, res) {
  req.logout();
  // res.redirect(req.get('referer'));
  res.redirect('back');
});


/**
 * ROUTE: GET /:id
 *  display a user profile
 */
router.get('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.error('3 ** error: [%s] %s', filename, err);
      res.redirect('/');
    }
    else {
      res.render('show', {
        user: user
      });
    }
  });
});

module.exports = router;
