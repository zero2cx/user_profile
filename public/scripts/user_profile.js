/**
 * file: public/scripts/user_profile.js
 */

// set dom-variables for the profile-form
var iconAdmin = $('#admin-icon');
var bannerUsername = $('#username-banner');
var bannerSuspension = $('#suspension-banner');
var thumbAvatar = $('#avatar-thumb');
var bannerJoinDate = $('#join-date-banner');
var inputFirstName = $('#first-name-input');
var inputLastName = $('#last-name-input');
var inputEmailAddress = $('#email-address-input');
var inputBiography = $('#biography-input');
var buttonReinstate = $('#reinstate-button');
var buttonSuspend = $('#suspend-button');
var buttonReset = $('#reset-button');
var buttonSave = $('#save-button');
// set dom-variables for the admin-form
var adminForm = $('#admin-form');
var adminAction = $('#admin-action');
// set dom-variables for the registration-form
var formNewUser = $('#new-user-form');
var inputPassword = $('#password-input');
var inputConfirmPassword = $('#confirm-password-input');

// set global-variables
var adminCode = '0000';
var profileUser;

function submitNewUserForm() {
  if (inputPassword.val() === inputConfirmPassword.val()) {
    formNewUser.submit();
  }
  else {
    alert('password entries do not match');
  }
}
