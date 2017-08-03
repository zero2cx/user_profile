var filename = __filename.split("/").pop();
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require('./models/user');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var userData = [{ // user1
  username: 'buttercup',
  password: 'fancyfeast',
  first_name: 'buttercup',
  last_name: 'le katt',
  avatar_url: 'https://lh6.ggpht.com/z8rGcobymHcqSLtHpIsa42YdiuWOgl1tenbpuoAXRVFmIpdwCPCRZVmlZzQFdnqTOw=w300',
  email_address: 'buttercup@urfrontporch.com',
  biography: `Cats are similar in anatomy to the other felids, with a strong flexible body, quick reflexes, sharp retractable claws, and teeth adapted to killing small prey. Cat senses fit a crepuscular and predatory ecological niche. Cats can hear sounds too faint or too high in frequency for human ears, such as those made by mice and other small animals. They can see in near darkness. Like most other mammals, cats have poorer color vision and a better sense of smell than humans. Cats, despite being solitary hunters, are a social species and cat communication includes the use of a variety of vocalizations (mewing, purring, trilling, hissing, growling, and grunting), as well as cat pheromones and types of cat-specific body language.`,
  join_date: '12/24/2016',
  is_admin: false,
  is_suspended: false
}, { // user2
  username: 'mister_whiskers',
  password: 'mouse',
  first_name: 'mister',
  last_name: 'whiskers',
  avatar_url: 'https://m.media-amazon.com/images/S/aplus-media/vc/403379fa-c998-4610-85b9-f176217dab4c._SR300,300_.jpg',
  email_address: 'mrwhiskers@chasingbugs.io',
  biography: `As of a 2007 study, cats are the second most popular pet in the US by number of pets owned, behind freshwater fish. In a 2010 study they were ranked the third most popular pet in the UK, after fish and dogs, with around 8 million being owned.`,
  join_date: '8/19/2014',
  is_admin: false,
  is_suspended: false
}, { // user3
  username: 'nyancat',
  password: 'meowmix',
  first_name: 'Nyan',
  last_name: 'Cat',
  avatar_url: 'https://lh3.googleusercontent.com/myWZNRjaPOkccysgKCpQDhjIMueEEfmsXg44VH5yL1y3K278p4uYeYJbmLa4_KIAtQ=w300',
  email_address: 'nyan@cat.com',
  biography: `nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan Nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan Nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan nyan`,
  join_date: '04/02/2011',
  is_admin: true,
  is_suspended: false
}, { // user4
  username: 'LasagnaCat',
  password: 'lasagna',
  first_name: 'Garfield',
  last_name: 'Arbuckle ',
  avatar_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlYU1atyL-xNaY0Js04rjn1dMckQutdmEUKnmLhDPRgdYLw7nF',
  email_address: 'torturing.odie@JonsHouse.org',
  biography: `I love torturing my friend, Odie the dog. He's not the brightest bulb in the box and he drools quite a bit. \n\nEveryone seems to think that I eat pans of lasagna just for kicks. But I never ate that pan of lasagna. I swear! It must've been Odie.`,
  join_date: '08/01/2006',
  is_admin: false,
  is_suspended: true
}];

/**
 * use the object elements of the userData array to
 * seed some users into the database users collection
 */
function seedDatabase() {
  // remove existing users from the database
  User.remove({}, function(err) {
    if (err) {
      console.log(' ** error: [%s] %s', filename, err);
      process.exit(1);
    }
    console.log(' ++ info: [%s] remove all users', filename);

    // loop through each user-object in the userData array
    userData.forEach(function(userSeed) {
      // create one user
      User.register(userSeed, userSeed.password, function(err, user) {
        if (err) {
          console.log(' ** error: [%s] %s', filename, err);
          process.exit(1);
        }
        passport.authenticate('local');
        console.log(' ++ info: [%s] create user "%s"', filename, userSeed.username);
      });
    });
  });
}

module.exports = seedDatabase;
