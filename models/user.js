/**
 * file: models/user.js
 */

var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  avatar_url: {
    type: String,
    default: 'https://images.duckduckgo.com/iu/?u=http%3A%2F%2F2.bp.blogspot.com%2F-Jkpn4Ghz1Os%2FTkxlMiUN6WI%2FAAAAAAAAANk%2F7e4iMQcDsTg%2Fs1600%2Ffake-facebook-profile-picture-funny-batman-pic.jpg&f=1'
  },
  join_date: {
    type: String,
    default: Date.now()
  },
  first_name: String,
  last_name: String,
  email_address: String,
  biography: String,
  is_admin: {
    type: Boolean,
    default: false
  },
  is_suspended: {
    type: Boolean,
    default: false
  }
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);
