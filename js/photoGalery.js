'use strict';

(function () {
  window.photos = [];

  var URL_GET = 'https://javascript.pages.academy/kekstagram/data';
  var URL_POST = 'https://javascript.pages.academy/kekstagram';

  var pictureTemplate = document.querySelector('#picture');
  var pictureContent = pictureTemplate.content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');

  var createPhotoElement = function (photo) {
    var photoElement = pictureContent.cloneNode(true);
    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__likes') .textContent = photo.likes;
    photoElement.querySelector('.picture__comments') .innerHTML = photo.comments.length;

    return photoElement;
  };

  var successHandler = function (photos) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(createPhotoElement(photos[i]));
    }

    picturesList.appendChild(fragment);
    window.photos = photos;
  };

  window.server.getDataFromServer(URL_GET, successHandler, onErrorLoad);

  var onErrorLoad = function (errorCode, errorText) {
    throw new Error(window.server.getErrorByCode(errorCode, errorText));
  };

  var onSuccessUpload = function () {
    window.form.closeUploadOverlayHandler();
    window.form.showImgUploadSuccessMessage();
  };

  var onErrorUpload = function (errorCode, errorText) {
    window.form.closeUploadOverlayHandler();
    window.form.showImgUploadErrorMessage();
    throw new Error(window.serverErrors.getErrorByCode(errorCode, errorText));
  };

  var imgUploadForm = document.querySelector('.img-upload__form');
  imgUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    var formData = new FormData(imgUploadForm);
    window.server.uploadDataToServer(URL_POST, formData, onSuccessUpload, onErrorUpload);
  });

})();
