/**
 * file: public/scripts/user_profile.js
 */

/**
 * declare dom-elements and global variables
 */
/* declare the dom-elements of the profile-form */
var iconAdmin = $('#admin-icon');
var bannerUsername = $('#username-banner');
var bannerSuspended = $('#suspended-banner');
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
/* declare the dom-elements of the admin-form */
var adminForm = $('#admin-form');
var adminAction = $('#admin-action');
/* declare the dom-elements of the registration-form */
var formNewUser = $('#new-user-form');
var inputPassword = $('#password-input');
var inputConfirmPassword = $('#confirm-password-input');
/* declare global-variables */
var adminCode = '0000';
var profileUser;
var changed = {
  firstName: false,
  lastName: false,
  emailAddress: false,
  biography: false
};

/**
 * when the avatar-thumb is clicked, show the avatar-modal dialog
 */
// thumbAvatar.on('click', function() {
// alert('ok');
// $('#avatar-modal').show();
// });

/**
 * when any text-input's value has changed, show the text-input's
 * associated undo-button
 */
$('.form-control').on('input', function() {
  $(this).prev().children().css('visibility', 'visible');
  changed[$(this).attr('data-changed')] = true;
  buttonSave.attr('disabled', false)
});

/**
 * when any undo-button is clicked, reset the value of its
 * associated text-input and hide the undo-button
 */
$('.undo-button').on('click', function() {
  $('#' + $(this).attr('data-input')).val($('#' + $(this).attr('data-undo')).val());
  $(this).css('visibility', 'hidden');
  changed[$(this).attr('data-changed')] = false;
  if (changed.firstName || changed.lastName || changed.emailAddress || changed.biography) return;
  buttonSave.attr('disabled', true);
});
