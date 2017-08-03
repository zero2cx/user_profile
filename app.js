/**
 * file: app.js
 */

var filename = __filename.split("/").pop();
var express = require('express');
var app = express();
// var router = express.Router({ mergeParams: true });
// var router = express.Router();
var mongoose = require('mongoose');
var methodOverride = require("method-override");
var bodyParser = require('body-parser');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var userRoutes = require("./routes/user");
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


/**
 * set some variables scoped for all routes
 */
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


app.use(userRoutes);

/**
 *  LISTEN: start the app server
 */
app.listen(process.env.PORT, process.env.IP, function() {
  console.info(' ++ info: [%s] listening on port %d', filename, process.env.PORT);
});
