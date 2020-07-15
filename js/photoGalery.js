'use strict';

(function () {
  window.photos = [];

  var URL_GET = 'https://javascript.pages.academy/kekstagram/data';

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

  var onUnsuccessfulDataLoaded = function (errorCode, errorText) {
    throw new Error(window.server.getErrorByCode(errorCode, errorText));
  };

  window.server.getDataFromServer(URL_GET, successHandler, onUnsuccessfulDataLoaded);
})();
