'use strict';

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
// var COMMENTS_NUMBER = 5;

var pictureTemplate = document.querySelector('#picture');
var pictureContent = pictureTemplate.content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var bigPictureCancel = document.querySelector('.big-picture__cancel');
var socialFooterText = document.querySelector('.social__footer-text');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var addToFragment = function (elements, callback) {
  if (callback && typeof callback === 'function') {
    var fragment = document.createDocumentFragment();

    elements.forEach(function (element) {
      fragment.appendChild(callback(element));
    });

    return fragment;
  }

  return null;
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
  photoElement.querySelector('.picture__img').alt = photo.description;
  photoElement.querySelector('.picture__likes') .textContent = photo.likes;
  photoElement.querySelector('.picture__comments') .textContent = photo.comments.length;

  return photoElement;
};

picturesList.appendChild(addToFragment(photoList, createPhotoElement));
/*
var renderPhotos = function (photos) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < NUMBER_PHOTOS; i++) {
    fragment.appendChild(createPhotoElement(photos[i]));
  }

  picturesList.appendChild(fragment);

};

renderPhotos(photoList); */

var commentsList = bigPicture.querySelector('.social__comments');
var commentTemplate = bigPicture.querySelector('.social__comment');

var createSocialComment = function (comment) {
  var socialComment = commentTemplate.cloneNode(true);

  socialComment.querySelector('img').src = comment.avatar;
  socialComment.querySelector('img').alt = comment.name;
  socialComment.querySelector('.social__text').textContent = comment.message;

  return socialComment;
};

var createSocialComments = function (comment) {
  var fragment = document.createDocumentFragment();
  var newComment;

  for (var i = 0; i < comment.length; i++) {
    newComment = createSocialComment(comment[i]);
    fragment.appendChild(newComment);
  }

  return fragment;
};

var renderComments = function (list, fragment) {
  list.innerHTML = '';
  list.appendChild(fragment);
};

var usersPictures = picturesList.querySelectorAll('.picture__img');

var fillBigPicture = function (picture) {
  usersPictures.forEach(function (element, index) {

    if (picture === element) {
      bigPicture.querySelector('.big-picture__img img').src = photoList[index].url;
      bigPicture.querySelector('.likes-count').textContent = photoList[index].likes;
      bigPicture.querySelector('.comments-count').textContent = photoList[index].comments.length;
      bigPicture.querySelector('.social__caption').textContent = photoList[index].description;

      renderComments(commentsList, addToFragment(photoList[index].comments, createSocialComments));
    }
  });
};
// console.log(photoList);

var openBigPicture = function (node) {
  node.classList.remove('hidden');
  document.body.classList.add('modal-open');
  node.classList.add('active-popup');
  document.addEventListener('keydown', onBigPictureEscPress);
  node.setAttribute('tabIndex', '0');
  node.focus();
};

var closeBigPicture = function () {
  var node = document.querySelector('.active-popup');

  node.classList.add('hidden');
  document.body.classList.remove('modal-open');
  node.classList.remove('active-popup');
  document.removeEventListener('keydown', onBigPictureEscPress);
  node.removeAttribute('tabIndex');
};

var onBigPictureEscPress = function (evt) {
  if (evt.key === 'Escape' && socialFooterText !== document.activeElement) {
    evt.preventDefault();
    closeBigPicture();
  }
};
// на энтер не работает
var onEnterClickBigPictureOpener = function (evt) {
  if (evt.key === 'Enter') {
    evt.preventDefault();
    openBigPicture();
  }
};

picturesList.addEventListener('click', function (evt) {
  var target = evt.target;
  var picture = target.matches('.picture__img');

  if (target && picture) {
    evt.preventDefault();
    bigPicture.querySelector('.social__comment-count').classList.add('hidden');
    bigPicture.querySelector('.comments-loader').classList.add('hidden');
    fillBigPicture(target);
    openBigPicture(bigPicture);
    onEnterClickBigPictureOpener(); // не работает
  }
});

bigPictureCancel.addEventListener('click', function (evt) {
  evt.preventDefault();
  closeBigPicture();
});
/*
var renderBigPicture = function () {
  bigPicture.classList.remove('hidden');
  document.body.classList.add('modal-open');

  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');

  fillBigPicture(photoList[0]);
};

renderBigPicture(); */

