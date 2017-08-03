/**
 * file: app.js
 */

var filename = __filename.split("/").pop();
var express = require('express');
var app = express();
// var router = express.Router({ mergeParams: true }); // var router = express.Router();
var mongoose = require('mongoose');
var methodOverride = require("method-override");
var bodyParser = require('body-parser');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var seedDatabase = require("./seeds");
var databaseUrl = process.env.DATABASE_URL || "mongodb://localhost/user_profile";

mongoose.Promise = global.Promise;
mongoose.connect(databaseUrl);
seedDatabase();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
  secret: "Kitty leans on the windowpane.",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  next();
}, function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      console.error(' ** error: [%s] %s', filename, err);
    }
    else {
      // console.log('++++++  users  ++++++\n' + users);
      res.locals.users = users;
      next();
    }
  });
});


/**
 * ROUTE: GET /
 *  display landing page
 */
app.get('/', function(req, res) {
  res.render('landing');
});


/**
 * ROUTE: GET /index
 *  display all users
 */
app.get('/index', function(req, res) {
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
app.get('/new', function(req, res) {
  res.render('new');
});


/**
 * ROUTE: POST /new
 *  create the current user
 */
app.post('/new', function(req, res) {
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
app.post('/login', passport.authenticate('local', {
  successRedirect: '/index',
  failureRedirect: '/login'
}), function(req, res) {
  //empty callback
});



/**
 * ROUTE: GET /logout
 *  log out the user
 */
app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('index');
});


/**
 * ROUTE: GET /:id
 *  display a user profile
 */
app.get('/:id', function(req, res) {
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
 *  LISTEN: start the app server
 */
app.listen(process.env.PORT, process.env.IP, function() {
  console.info(' ++ info: [%s] listening on port %d', filename, process.env.PORT);
});
