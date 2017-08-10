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
var chooserAvatar = $('#avatar-chooser');
var imageTest = $('#test-image');
var buttonDone = $('#done-button');
var buttonInfo = $('#info-button');
var labelInfoTop = $('#info-top-label');
var buttonCloseDialog = $('#close-dialog-button');
var imageCropper = $('#cropper-image');
var labelFeedback = $('#feedback-label');
var buttonUploadFile = $('#upload-file-button');
var hiddenUploadFile = $('#upload-file-hidden');
var buttonEditImage = $('#edit-image-button');
var inputUrl = $('#url-input');
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
 * when the avatar-image is clicked, show the avatar-chooser popup dialog
 */
imageAvatar.on('click ', function() {
  chooserAvatar.modal();
});

/**
 * when the avatar-chooser is finished loading, overlay the
 * image-cropper on top of the cropper-image
 */
chooserAvatar.on('shown.bs.modal', function(e) {
  imageCropper.cropper({
    aspectRatio: 1,
    background: false,
    crop: function(e) {
      console.log(e.x);
      console.log(e.y);
      console.log(e.width);
      console.log(e.height);
      console.log(e.rotate);
      console.log(e.scaleX);
      console.log(e.scaleY);
    }
  });
});

/**
 * when the done-button is clicked, copy the cropped-image canvas to the
 * avatar-image's src attribute, and close the avatar-chooser dialog
 */
buttonDone.on('click', function() {
  var cropImage = imageCropper.cropper('getCroppedCanvas').toDataURL('image/png');
  imageAvatar.attr('src', cropImage);
  chooserAvatar.modal('hide');
  // [TODO] SHOW THE UNDO BUTTON FOR THE AVATAR
});

/**
 *
 */
hiddenUploadFile.on('change', function() {
  // var fileType = $(this).val().split('.').pop().toLowerCase();
  // if (fileType !== 'jpg' && fileType !== 'png' && fileType !== 'gif' && fileType !== 'svg') {
  //   alert('error: file-type must be one of jpg, png, gif, or svg');
  //   return;
  // }
  // upload the image file
  $(this).prop('form').submit();

  // inputUrl.val(hiddenUploadFile.val().split('\\').pop());
  // uploadedFile = true;
  // buttonUploadFile.hide();
  // buttonEditImage.show();
});

/**
 * when the image-url changes in the text-input, try to load
 * that image-url into the non-visible test-image
 */
inputUrl.on('input', function() {
  if (inputUrl.val() === '') {
    labelFeedback.css('visibility', 'hidden');
    inputUrl.css('background-color', '#ffffff');
    buttonEditImage.hide();
    buttonUploadFile.show();
  }
  else {
    buttonUploadFile.hide();
    buttonEditImage.show();
  }
});


// buttonEditImage.on('click', function() {
//   // if (uploadedFile) {
//   //   imageTest.attr('src', hiddenUploadFile.val());
//   // }
//   // else {
//   imageTest.attr('src', inputUrl.val());
//   // }
// });

/**
 * when an image-url successfully loads into the test-image,
 * load that image-url into the cropper-image
 */
// imageTest.on('load', function() {
//   if (imageTest.prop('width') === 500 && imageTest.prop('height') === 374) {
//     console.log('error: cannot load image ' + imageTest.prop('src'));
//     labelFeedback.css('visibility', 'visible');
//     inputUrl.css('background-color', '#ffbfbf');
//   }
//   else {
//     labelFeedback.show(); //css('visibility', 'hidden');
//     inputUrl.css('background-color', '#ffffff');
//     imageCropper.cropper('replace', $(this).attr('src'));
//   }
// });

/**
 * when the image-url fails to load into the test-image, show the error
 * feedback-label, and change the text-input's background color to red
 */
// imageTest.on('error', function() {
//   labelFeedback.css('visibility', 'visible');
//   inputUrl.css('background-color', '#ffbfbf');
// });

/*********************************************************/

/**
 * when any text-input value has changed on the profile-form, make
 * visible the text-input's associated undo-button
 */
$('.form-control').on('input', function() {
  $(this).prev().children().css('visibility', 'visible');
  changed[$(this).attr('data-changed')] = true;
  buttonSave.attr('disabled', false)
});

/**
 * when any undo-button is clicked on the profile-form, reset the
 * value of its associated text-input, and hide the undo-button
 */
$('.undo-button').on('click', function() {
  $('#' + $(this).attr('data-input')).val($('#' + $(this).attr('data-undo')).val());
  $(this).css('visibility', 'hidden');
  changed[$(this).attr('data-changed')] = false;
  if (changed.firstName || changed.lastName || changed.emailAddress || changed.biography) return;
  buttonSave.attr('disabled', true);
});
