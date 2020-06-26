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
var SCALE_MIN = 25;
var SCALE_MAX = 100;
var SCALE_STEP = 25;

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

// загрузка нового изображения
var body = document.querySelector('body');
var uploadFile = document.querySelector('#upload-file');
var uploadCancel = document.querySelector('#upload-cancel');
var uploadOverlay = document.querySelector('.img-upload__overlay');
var hashtags = uploadOverlay.querySelector('.text__hashtags');
var textDescription = uploadOverlay.querySelector('.text__description');

var onUploadOverlayEscPress = function (evt) {
  if (evt.key === 'Escape' && evt.target !== hashtags && evt.target !== textDescription) {
    evt.reventDefault();
    closeUploadOverlayHandler();
  }
};

var uploadOverlayHandler = function () {
  body.classList.add('modal-open');
  uploadOverlay.classList.remove('hidden');

  document.addEventListener('keydown', onUploadOverlayEscPress);
};

var closeUploadOverlayHandler = function () {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadFile.value = '';

  document.removeEventListener('keydown', onUploadOverlayEscPress);
};

uploadFile.addEventListener('change', uploadOverlayHandler);
uploadCancel.addEventListener('click', closeUploadOverlayHandler);

// масштаб
var scaleField = uploadOverlay.querySelector('.img-upload__scale');
var scaleSmaller = scaleField.querySelector('.scale__control--smaller');
var scaleBigger = scaleField.querySelector('.scale__control--bigger');
var scaleValue = scaleField.querySelector('.scale__control--value');
var uploadPreview = uploadOverlay.querySelector('.img-upload__preview');

var onScaleChangeClick = function (evt) {
  var currentScale = parseInt(scaleValue.value, 10);

  var setScaleValue = function (scale) {
    scaleValue.value = scale + '%';
    uploadPreview.style.transform = 'scale(' + scale / 100 + ')';
  };

  switch (evt.target) {
    case scaleSmaller:
      var scale = Math.max(SCALE_MIN, currentScale - SCALE_STEP);
      setScaleValue(scale);
      break;
    case scaleBigger:
      scale = Math.min(SCALE_MAX, currentScale + SCALE_STEP);
      setScaleValue(scale);
      break;
  }
};

scaleField.addEventListener('click', onScaleChangeClick);
/*  if (evt.target === scaleSmaller) {
    scale = Math.max(SCALE_MIN, currentScale - SCALE_STEP);
    scaleValue.value = scale + '%';
    uploadPreview.style.transform = 'scale(' + scale / 100 + ')';
  }

  if (evt.target === scaleBigger) {
    scale = Math.min(SCALE_MAX, currentScale + SCALE_STEP);
    scaleValue.value = scale + '%';
    uploadPreview.style.transform = 'scale(' + scale / 100 + ')';
  }
}; */

/* var onScaleSmallerClick = function () {
  var scale = parseInt(scaleValue.value, 10);
  var currentScale = scale - SCALE_STEP;

  if (currentScale >= SCALE_MIN) {
    currentScale = scale - SCALE_STEP;
  } else {
    currentScale = SCALE_MIN;
  }

  scaleValue.value = currentScale + '%';
  uploadPreview.style.transform = 'scale(' + currentScale / 100 + ')';
};

var onScaleBiggerClick = function () {
  var scale = parseInt(scaleValue.value, 10);
  var currentScale = scale + SCALE_STEP;

  if (currentScale <= SCALE_MAX) {
    currentScale = scale + SCALE_STEP;
  } else {
    currentScale = SCALE_MAX;
  }

  scaleValue.value = currentScale + '%';
  uploadPreview.style.transform = 'scale(' + currentScale / 100 + ')';
};

scaleSmaller.addEventListener('click', onScaleSmallerClick);
scaleBigger.addEventListener('click', onScaleBiggerClick); */

// эффект на изображение
var imgPreview = uploadPreview.querySelector('img');
var imgUploadEffects = document.querySelector('.effects');
var effectLevel = document.querySelector('.img-upload__effect-level');
var previewWithoutEffect = document.querySelector('#effect-none');

effectLevel.style.display = 'none';

var onFilterSwitch = function (evt) {
  imgPreview.className = '';
  imgPreview.classList.add('effects__preview--' + evt.target.value);

  effectLevel.style.display = previewWithoutEffect.checked ? 'none' : 'block';
  /* if (previewWithoutEffect.checked) {
    effectLevel.style.display = 'none';
  } else {
    effectLevel.style.display = 'block';
  }
  /* if (uploadCancel.target) {
    imgUploadEffects.style.display = '';
  } */
};

imgUploadEffects.addEventListener('change', onFilterSwitch);

// валидация хештегов
var checkSameHashtags = function (arr) {
  var inLowerCaseStrings = arr.map(function (value) {
    return value.toLowerCase();
  });

  for (var i = 0; i < inLowerCaseStrings.length - 1; i++) {
    for (var j = i + 1; j < inLowerCaseStrings.length; j++) {
      if (inLowerCaseStrings[i] === inLowerCaseStrings[j]) {
        return true;
      }
    }
  }

  return false;
};

var onHashTagsChange = function () {
  var hashTagRegExp = /^#[0-9a-zA-Zа-яА-я]{1,19}$/i;
  var errorHashtag = false;

  var text = hashtags.value.trim();

  if (text) {
    var hashtagsArray = text.split(' ');

    for (var i = 0; i < hashtagsArray.length; i++) {
      if (!hashTagRegExp.test(hashtagsArray[i])) {
        errorHashtag = true;
        break;
      }
    }

    if (errorHashtag) {
      hashtags.setCustomValidity('Исправьте ошибки в хэштеге');
      hashtags.reportValidity();
    } else if (hashtagsArray.length > 5) {
      hashtags.setCustomValidity('Не больше 5 хэштегов');
      hashtags.reportValidity();
    } else if (checkSameHashtags(hashtagsArray)) {
      hashtags.setCustomValidity('Удалите одинаковые хэштеги');
      hashtags.reportValidity();
    } else {
      hashtags.setCustomValidity('');
    }
  }
};

hashtags.addEventListener('input', onHashTagsChange);

// длина коммента
var onCommentsChange = function () {
  var commentsArray = textDescription.value.toLowerCase();

  for (var i = 0; i < commentsArray.length; i++) {
    if (commentsArray.length > 140) {
      textDescription.reportValidity();
      textDescription.setCustomValidity('Количество введенных символов не должно превышать 140');
    } else {
      hashtags.setCustomValidity('');
    }
  }
};

textDescription.addEventListener('input', onCommentsChange);
