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

  var commentTemplate = bigPicture.querySelector('.social__comment');

  var createSocialComment = function (comment) {
    var socialComment = commentTemplate.cloneNode(true);

    socialComment.querySelector('img').src = comment.avatar;
    socialComment.querySelector('img').alt = comment.name;
    socialComment.querySelector('.social__text').textContent = comment.message;

    return socialComment;
  };

  var createSocialComments = function (comments) {
    var fragment = document.createDocumentFragment();
    var comment;

    for (var i = 0; i < comments.length; i++) {
      comment = createSocialComment(comments[i]);
      fragment.appendChild(comment);
    }

    return fragment;
  };

  var fillBigPicture = function (picture) {
    bigPicture.querySelector('.big-picture__img img').src = picture.url;
    bigPicture.querySelector('.likes-count').textContent = picture.likes;
    bigPicture.querySelector('.comments-count').textContent = picture.comments.length;
    bigPicture.querySelector('.social__caption').textContent = picture.description;

    var comments = bigPicture.querySelector('.social__comments');
    var commentsElements = createSocialComments(picture.comments);

    comments.appendChild(commentsElements);


  };

  var showBigPicture = function (evt) {
    var target = evt.target;
    var pictureElement = target.closest('.picture__img');

    if (pictureElement) {
      evt.preventDefault();
      var src = pictureElement.getAttribute('src');
      var picture = photoList.find(function (value) {
        return value.url === src;
      });

      if (picture) {
        renderBigPicture(picture);
      }
    }
    bigPictureCancel.addEventListener('click', hideBigPicture);
    pictureElement.addEventListener('keydown', onPictureEscPress);
  };

  var hideBigPicture = function () {
    document.body.classList.remove('modal-open');
    bigPicture.classList.add('hidden');
    bigPictureCancel.removeEventListener('click', hideBigPicture);
    document.removeEventListener('keydown', onPictureEscPress);
  };

  var onPictureEscPress = function (evt) {
    if (evt.key === 'Escape' && socialFooterText !== document.activeElement) {
      evt.preventDefault();
      hideBigPicture();
    }
  };

  picturesList.addEventListener('click', showBigPicture);


  var renderBigPicture = function (picture) {
    bigPicture.classList.remove('hidden');
    document.body.classList.add('modal-open');
    bigPicture.querySelector('.social__comment-count').classList.add('hidden');
    bigPicture.querySelector('.comments-loader').classList.add('hidden');

    fillBigPicture(picture);
  };
})();
