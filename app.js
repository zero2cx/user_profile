// app.js

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
 * import module files and declare global variables
 */
var filename = __filename.split("/").pop();
var express = require('express');
var mongoose = require('mongoose');
var methodOverride = require("method-override");
var bodyParser = require('body-parser');
var passport = require("passport");
var multer = require('multer');
// var mimeTypesFilter = require('meanie-multer-mime-types-filter');
var LocalStrategy = require("passport-local");
var User = require("./models/user");
var userRoutes = require("./routes/user");
var seedDatabase = require("./seeds");
var app = express();
var databaseUrl = process.env.DATABASE_URL || "mongodb://localhost/user_profile";

/**
 * initialize the database connection and re-seed with test data
 */
mongoose.Promise = global.Promise;
mongoose.connect(databaseUrl);
seedDatabase();

/**
 * fine-tune the app's configuration
 */
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(require("express-session")({
  secret: "Kitty leans on the windowpane.",
  resave: false,
  saveUninitialized: false
}));

/**
 * import and initialize passport functionality
 */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var upload = multer({
  storage: multer.diskStorage({
    destination: function(req, file, callback) {
      callback(null, 'public/uploads/');
    },
    filename: function(req, file, callback) {
      callback(null, Date.now() + '-' + file.originalname);
    }
  }),
  fileFilter: function(req, file, callback) {
    var fileType = file.originalname.split('.').pop().toLowerCase();
    if (fileType !== 'jpg' && fileType !== 'png' && fileType !== 'gif' && fileType !== 'jpeg') {
      return callback(new Error('error: only image files are allowed'))
    }
    callback(null, true)
  },
  limits: {
    fileSize: 1000000,
    files: 1
  }
});

var nightMode = true;
// var nightMode = false;

/**
 * set some variables scoped for all routes
 */
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.uploadFile = '';
  res.locals.nightMode = nightMode;
  next();
}, function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      console.error(' ** error: [%s] %s', filename, err);
    }
    else {
      res.locals.users = users;
      next();
    }
  });
});

/**
 * ROUTE: GET /
 * display landing page
 */
app.get('/', function(req, res) {
  res.render('landing', {
    user: req.user
  });
});

/**
 * ROUTE: POST /upload/image
 * display the profile-page with an open avatar-chooser
 * featuring the uploaded file
 */
app.post('/user/:id/upload', upload.single('upload_file'), function(req, res) {
  var imageFile = req.file.path.replace(/public/, '');
  User.findById(req.params.id, function(err, user) {
    if (err) {
      console.error(' ** error: [%s] %s [%s]', filename, err, 'ROUTE: GET /:id');
      res.redirect('/');
    }
    else {
      res.render('user/show', {
        user: user,
        uploadFile: imageFile
      });
    }
  });
});

app.get('/terms', function(req, res) {
  res.sendFile(__dirname + '/public/terms.html');
});

/**
 * import the user routes
 */
app.use('/user', userRoutes);

/**
 * start the app server
 */
app.listen(process.env.PORT, process.env.IP, function() {
  console.info(' ++ info: [%s] listening on port %d', filename, process.env.PORT);
});
