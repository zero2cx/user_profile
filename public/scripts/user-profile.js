/**
 * file: public/scripts/user_profile.js
 */

/*********************************************************/
/* declare the dom-elements of the profile-form */
var imageAvatar = $('#avatar-image');
var inputAvatarUndo = $('#avatar-undo-input');
var buttonAvatarUndo = $('#avatar-undo-button');
var inputAvatar = $('#avatar-input');
var buttonReinstate = $('#reinstate-button');
var buttonSuspend = $('#suspend-button');
var buttonSave = $('#save-button');
var formProfile = $('#profile-form');
/*********************************************************/
/* declare the dom-elements of the registration-form */
var formNewUser = $('#new-user-form');
var inputPassword = $('#password-input');
var inputConfirmPassword = $('#confirm-password-input');
/*********************************************************/
/* declare the dom-elements of the avatar-chooser modal */
var modalAvatarChooser = $('#avatar-chooser-modal');
var imageLoadTest = $('#load-test-image');
var buttonDone = $('#done-button');
var buttonInfo = $('#info-button');
var labelInfoTop = $('#info-top-label');
// var buttonCloseModal = $('#close-modal-button');
var imageCropper = $('#cropper-image');
var labelFeedback = $('#feedback-label');
var buttonUploadFile = $('#upload-file-button');
var inputUploadFile = $('#upload-file-input');
var buttonLoadUrl = $('#load-url-button');
var inputLoadUrl = $('#load-url-input');
/*********************************************************/
/* declare global-variables */
var changed = {
  firstName: false,
  lastName: false,
  emailAddress: false,
  biography: false,
  avatar: false
};

/*********************************************************/

/**
 * when the avatar-image is clicked, show the avatar-chooser modal
 */
// imageAvatar.on('click ', function() {
//   chooserAvatar.modal();
// });

/**
 * when the avatar-chooser modal is finished loading,
 * overlay the image-cropper on top of the cropper-image
 */
modalAvatarChooser.on('shown.bs.modal', function(e) {
  imageCropper.cropper({
    aspectRatio: 1,
    background: false,
    /*
    crop: function(e) {
      console.log(e.x);
      console.log(e.y);
      console.log(e.width);
      console.log(e.height);
      console.log(e.rotate);
      console.log(e.scaleX);
      console.log(e.scaleY);
    }*/
    // ready: function(e) {
    //   console.log('cropper 1 ready');
    // }
  });
});

/**
 * when the done-button is clicked, copy the cropped-image canvas to
 * the avatar-image's src attribute, and close the avatar-chooser modal
 */
buttonDone.on('click', function() {
  var cropImage = imageCropper.cropper('getCroppedCanvas').toDataURL('image/png');
  imageAvatar.attr('src', cropImage);
  imageAvatar.prev().css('visibility', 'visible');
  changed['avatar'] = true;
  buttonSave.attr('disabled', false)
  modalAvatarChooser.modal('hide');
});

/**
 *
 */
inputUploadFile.on('change', function() {
  // var fileType = $(this).val().split('.').pop().toLowerCase();
  // if (fileType !== 'jpg' && fileType !== 'png' && fileType !== 'gif' && fileType !== 'svg') {
  //   alert('error: file-type must be one of jpg, png, gif, or svg');
  //   return;
  // }
  // upload the image file
  labelFeedback.hide();
  $(this).prop('form').submit();
});

/**
 * when the image-url changes in the text-input, try to load
 * that image-url into the non-visible test-image
 */
// inputUrl.on('input', function() {
//   if (inputUrl.val() === '') {
//     labelFeedback.css('visibility', 'hidden');
//     inputUrl.css('background-color', '#ffffff');
//   }
// });

/**
 * when the load-url button is clicked, then load the image-url
 * input's 'value' attribute into the load-test image
 */
buttonLoadUrl.on('click', function() {
  imageLoadTest.attr('src', inputLoadUrl.val());
});

/**
 * when an image successfully loads into the load-test image, then
 * test it against the known params for the 'image_unavailable.jpg'
 * image from flickr, and then either show an error via the
 * feedback-label, or load the image-url into the cropper-image
 */
imageLoadTest.on('load', function() {
  if (imageLoadTest.prop('width') === 500 && imageLoadTest.prop('height') === 374) {
    labelFeedback.show();
    // inputUrl.css('background-color', '#ffbfbf');
  }
  else {
    labelFeedback.hide();
    // inputUrl.css('background-color', '#ffffff');
    imageCropper.cropper('replace', $(this).attr('src'));
  }
});

/**
 * when the image-url fails to load into the load-test image,
 * then show the error via the feedback-label, and change the
 * text-input's background color to red
 */
imageLoadTest.on('error', function() {
  labelFeedback.show();
  // inputUrl.css('background-color', '#ffbfbf');
});

/*********************************************************/

/**
 * when any text-input 'value' or avatar-url 'src' attribute
 * has changed, make visible the associated undo-button
 */
$('.form-control').on('input', function() {
  $(this).prev().children().css('visibility', 'visible');
  changed[$(this).attr('data-changed')] = true;
  buttonSave.attr('disabled', false)
});

/**
 * when any undo-button is clicked, reset the associated
 * avatar-image 'src' or text-input 'value' attribute, and
 * then hide the undo-button, and then disable the save-changes
 * button if this was the last remaining changed data with
 * respect to the original form data
 */
$('.undo-button').on('click', function() {
  if ($(this).attr('data-target') === 'avatar-image') {
    // the avatar-image needs the src attribute to be undone
    $('#' + $(this).attr('data-target')).attr('src', $('#' + $(this).attr('data-undo')).val());
  }
  else {
    // the input-fields need the value attribute to be undone
    $('#' + $(this).attr('data-target')).val($('#' + $(this).attr('data-undo')).val());
  }
  $(this).css('visibility', 'hidden');
  changed[$(this).attr('data-changed')] = false;
  if (changed.firstName || changed.lastName || changed.emailAddress || changed.biography || changed.avatar) return;
  buttonSave.attr('disabled', true);
});

/**
 * when the save-changes button is clicked, update the hidden
 * avatar-input, and then submit the profile-form
 */
function saveProfile() {
  inputAvatar.val(imageAvatar.attr('src'));
  formProfile.submit();
}

/**
 * disable the default behavior for a dragover event
 */
document.addEventListener('dragover', function(e) {
  e.preventDefault();
}, false);

/**
 * enable the drop event for the cropper area only, then load
 * the dropped image-url into the load-test-image
 */
document.addEventListener('drop', function(e) {
  e.preventDefault();
  if (e.target.className.match(/^cropper/)) {
    imageLoadTest.attr('src', e.dataTransfer.getData('text'));
  }
});

/*********************************************************/

/**
 * disable normal click behavior on dropdown-menus and dropdown-submenus
 */
$('a.dropdown-submenu').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  if ($(this).hasClass('dropdown-submenu-close')) {
    // clicked item was closed, so close all other items, then open this item
    $(this).parent().siblings().children('ul').toggle(false)
    $(this).parent().siblings().children('a').removeClass('dropdown-submenu-open');
    $(this).parent().siblings().children('a').addClass('dropdown-submenu-close');
    $(this).removeClass('dropdown-submenu-close');
    $(this).addClass('dropdown-submenu-open');
    $(this).parent().children('ul').toggle(true)
    // console.log($(this));
  }
  else {
    // clicked item was open, so close this item
    $(this).removeClass('dropdown-submenu-open');
    $(this).addClass('dropdown-submenu-close');
    $(this).parent().children('ul').toggle(false)
    // console.log($(this));
  }
});



/*
$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(e) {
  e.stopPropagation();
  e.preventDefault();
  console.log('\nsiblings()');
  console.log($(this).parent().siblings());
  console.log('\nsiblings().children(ul)');
  console.log($(this).parent().siblings().children('ul'));
  $(this).parent().siblings().children('ul').toggle(false);
  $(this).next('ul.dropdown-menu').toggle()
});*/
