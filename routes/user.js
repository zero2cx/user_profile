// routes/user.js

/**
 * UserProfile is a browser interface for web site user profiles.
 * Copyright (C) 2017  David Schenck
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
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
 * ROUTE: GET /new
 *  display new user form
 */
router.get('/new', function(req, res) {
  res.render('user/new');
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
      console.error(' ** error: [%s] %s [%s]', filename, err, 'ROUTE: POST /new');
      return res.redirect('new');
    }
    passport.authenticate('local')(req, res, function() {
      console.log(' ++ info: [%s] create user "%s"', filename, user.username);
      res.redirect('/user/' + user._id);
    });
  });
});

/**
 * ROUTE: GET /new/cancel
 *  redirect back from new user form
 */
router.get('/new/cancel', function(req, res) {
  res.redirect('/');
});

/**
 * ROUTE: POST /login
 *  login the current user
 */
router.post('/login', passport.authenticate('local', {
  successRedirect: '/user/login/success',
  failureRedirect: '/user/login/failure'
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
 *  log out the current user
 */
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('back');
});

/**
 * ROUTE: GET /:id
 *  display a user-profile
 */
router.get('/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.error(' ** error: [%s] %s [%s]', filename, err, 'ROUTE: GET /:id');
      res.redirect('/');
    }
    else {
      res.render('user/show', {
        user: user
      });
    }
  });
});

/**
 * ROUTE: POST /:id
 *  update changes to the user-profile in the database
 */
router.post('/:id', function(req, res) {
  User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user) {
    if (err) {
      console.error(' ** error: [%s] %s [%s]', filename, err, 'ROUTE: POST /:id');
      res.redirect('back');
    }
    else {
      res.redirect('/user/' + user._id);
    }
  });
});

/**
 * export the local instance of express.Router()
 */
module.exports = router;
