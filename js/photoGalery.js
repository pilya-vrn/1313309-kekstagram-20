'use strict';

(function () {
  var MESSAGES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var AUTHOR_NAMES = ['Иван', 'Хуан Себастьян', 'Мария', 'Кристоф', 'Виктор', 'Юлия', 'Люпита', 'Вашингтон'];
  var NUMBER_PHOTOS = 25;
  var MIN_LIKES = 15;
  var MAX_LIKES = 200;
  var MIN_COMMENTS = 0;
  var MAX_COMMENTS = 100;


  var pictureTemplate = document.querySelector('#picture');
  var pictureContent = pictureTemplate.content.querySelector('.picture');
  var picturesList = document.querySelector('.pictures');

  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var createComment = function () {
    return {
      avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
      message: MESSAGES[getRandomNumber(0, MESSAGES.length - 1)],
      name: AUTHOR_NAMES[getRandomNumber(0, AUTHOR_NAMES.length - 1)]
    };
  };

  var createComments = function () {
    var comments = [];

    for (var i = 0; i <= getRandomNumber(MIN_COMMENTS, MAX_COMMENTS); i++) {
      comments.push(createComment());
    }

    return comments;
  };

  var createPhoto = function (i) {
    return {
      url: 'photos/' + (i + 1) + '.jpg',
      description: '',
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
      comments: createComments()
    };
  };

  var createPhotos = function () {
    var photos = [];

    for (var i = 0; i < NUMBER_PHOTOS; i++) {
      photos.push(createPhoto(i));
    }

    return photos;
  };

  var photoList = createPhotos(NUMBER_PHOTOS);

  var createPhotoElement = function (photo) {
    var photoElement = pictureContent.cloneNode(true);
    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__likes') .textContent = photo.likes;
    photoElement.querySelector('.picture__comments') .innerHTML = photo.comments.length;

    return photoElement;
  };

  var renderPhotos = function (photos) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < NUMBER_PHOTOS; i++) {
      fragment.appendChild(createPhotoElement(photos[i]));
    }

    picturesList.appendChild(fragment);
  };

  renderPhotos(photoList);
})();