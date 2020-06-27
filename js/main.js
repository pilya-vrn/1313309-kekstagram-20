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

var pictureTemplate = document.querySelector('#picture');
var pictureContent = pictureTemplate.content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var createComments = function () {
  var comment = {
    avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
    message: MESSAGES[getRandomNumber(0, MESSAGES.length - 1)],
    name: AUTHOR_NAMES[getRandomNumber(0, AUTHOR_NAMES.length - 1)]
  };
  var comments = [];

  for (var i = 0; i <= getRandomNumber(MIN_COMMENTS, MAX_COMMENTS); i++) {
    comments.push(comment);
  }

  return comments;
};

var createPhotos = function () {
  var photos = [];
  for (var i = 0; i < NUMBER_PHOTOS; i++) {
    var photo = {
      url: 'photos/' + (i + 1) + '.jpg',
      description: '',
      likes: getRandomNumber(MIN_LIKES, MAX_LIKES),
      comments: createComments()
    };
    photos.push(photo);
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

// наполнение биг фото
var createCommentsFragment = function (photo) {
  var commentsFragment;

  var commentTemplate = document.querySelector('#comment')
  .content
  .querySelector('.social__comment');

  for (var i = 0; i < photo.comments.length; i++) {
    var comment = commentTemplate.cloneNode(true);
    var commentAvatar = comment.querySelector('img');
    var commetMessage = comment.querySelector('.social__text');

    commentAvatar.src = photo.comments[i].avatar;
    commentAvatar.alt = photo.comments[i].name;
    commetMessage.textContent = photo.comments[i].messsage;

    commentsFragment.appendChild(comment);
  }

  return commentsFragment;
};

// Отображает биг фото
var bigPicture = document.querySelector('.big-picture');

var renderBigPhoto = function (photo) {
  bigPicture.classList.remove('hidden');

  var bigPictureImg = bigPicture.querySelector('.big-picture__img img');
  var bigPictureLikes = bigPicture.querySelector('.likes-count');
  var bigPictureDescription = bigPicture.querySelector('.social__caption');
  var bigPictureCommentsCount = bigPicture.querySelector('.comments-count');
  var bigPictureComments = bigPicture.querySelector('.social__comments');

  bigPictureImg.src = photo.url;
  bigPictureLikes.textContent = photo.likes;
  bigPictureDescription.textContent = photo.description;

  bigPictureCommentsCount.textContent = photo.comments.length;
  bigPictureComments.textContent = '';
  bigPictureComments.appendChild(createCommentsFragment(photo));

  var bigPictureCommentsCounter = bigPicture.querySelector('.social__comment-count');
  var bigPictureCommentsLoader = bigPicture.querySelector('.comments-loader');

  bigPictureCommentsCounter.classList.add('hidden');
  bigPictureCommentsLoader.classList.add('hidden');
};

var body = document.querySelector('body');
body.classList.add('modal-open');

renderBigPhoto(photoList[0]);

