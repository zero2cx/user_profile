/**
 * file: public/scripts/user_profile.js
 */

/*********************************************************/
/* declare the dom-elements of the profile-form */
var imageAvatar = $('#avatar-image');
var buttonReinstate = $('#reinstate-button');
var buttonSuspend = $('#suspend-button');
var buttonSave = $('#save-button');
/*********************************************************/
/* declare the dom-elements of the registration-form */
var formNewUser = $('#new-user-form');
var inputPassword = $('#password-input');
var inputConfirmPassword = $('#confirm-password-input');
/*********************************************************/
/* declare the dom-elements of the avatar-chooser */
var dialogAvatarChooser = $('#avatar-chooser-dialog');
var imageCropper = $('#cropper-image');
var inputCropperUrl = $('#cropper-url-input');
var imageTest = $('#test-image');
// var containerCropper = $('#cropper-container');
/*********************************************************/
/* declare global-variables */
var changed = {
  firstName: false,
  lastName: false,
  emailAddress: false,
  biography: false
};

/*********************************************************/

/**
 * when the avatar-image is clicked, show the avatar-chooser dialog
 */
imageAvatar.on('click', function() {
  dialogAvatarChooser.modal();
});

/**
 * when the modal-dialog is finished loading, overlay the
 * image-cropper on top of the cropper-image
 */
dialogAvatarChooser.on('shown.bs.modal', function(e) {
  // alert('new cropper')
  imageCropper.cropper({
    aspectRatio: 1,
    background: false
  });
});

/**
 * when the image-url changes in the text-input, try to load
 * that image-url into the hidden test-image
 */
inputCropperUrl.on('input', function() {
  imageTest.attr('src', inputCropperUrl.val());
});

/**
 * when an image-url successfully loads into the test-image,
 * load that image-url into the cropper-image
 */
imageTest.on('load', function() {
  imageCropper.cropper('replace', $(this).attr('src'));
});

/**
 * when the image-url fails to load into the test-image, inform
 * the user, and change the text-input's background color to red
 */
imageTest.on('error', function() {
  alert('** error: not a valid image url');
  inputCropperUrl.css('background-color', '#ffbfbf');
});

/*********************************************************/

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
