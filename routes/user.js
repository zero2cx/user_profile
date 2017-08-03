/**
 * file: routes/user.js
 */

/**
 * import modules and declare global variables
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
  successRedirect: '/login/success',
  failureRedirect: '/login/failure'
}), function(req, res) {});

/**
 * ROUTE: GET /login/success
 *  redirect a successful login back to the same view
 */
router.get('/login/success', function(req, res, next) {
  res.redirect('back');
});

/**
 * ROUTE: GET /login/failure
 *  redirect a failed login back to the same view
 */
router.get('/login/failure', function(req, res, next) {
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

/**
 * export the local instance of express.Router()
 */
module.exports = router;
