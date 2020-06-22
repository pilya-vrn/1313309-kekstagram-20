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
var comments = uploadOverlay.querySelector('.text__description');


var onUploadOverlayEscPress = function (evt) {

  if (evt.key === 'Escape' && evt.target !== hashtags && evt.target !== comments) {
    closeUploadOverlay();
  }
};

var openUploadOverlay = function () {
  body.classList.add('modal-open');
  uploadOverlay.classList.remove('hidden');

  document.addEventListener('keydown', onUploadOverlayEscPress);
};

var closeUploadOverlay = function () {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  uploadFile.value = '';

  document.removeEventListener('keydown', onUploadOverlayEscPress);
};

uploadFile.addEventListener('change', function () {
  openUploadOverlay();
});

uploadCancel.addEventListener('click', function () {
  closeUploadOverlay();
});

// масштаб
var scaleField = uploadOverlay.querySelector('.img-upload__scale');
var scaleSmaller = scaleField.querySelector('.scale__control--smaller');
var scaleBigger = scaleField.querySelector('.scale__control--bigger');
var scaleValue = scaleField.querySelector('.scale__control--value');
var uploadPreview = uploadOverlay.querySelector('.img-upload__preview');

var onScaleSmallerClick = function () {
  // scaleValue.value = '100%';  // изменил значение в разметке, как сделать в Js не понял
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
  // scaleValue.value = '100%'; // чтобы начальное значение было 100% и считалось от него, но при добавлении вообще не работает scale
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
scaleBigger.addEventListener('click', onScaleBiggerClick);

// эффект на изображение
var imgPreview = uploadPreview.querySelector('img');
var filterInputs = document.querySelectorAll('.effects__radio');
// var fieldset = document.querySelectorA('fieldset');
var effectLevel = document.querySelector('.img-upload__effect-level');

if (document.querySelector('#effect-none').checked) {
  effectLevel.style.display = 'none';
}

var addFilter = function (evt) {
  imgPreview.removeAttribute('class');
  imgPreview.classList.add('effects__preview--' + evt.target.value);

  if (document.querySelector('#effect-none').checked) {
    effectLevel.style.display = 'none';
  } else {
    effectLevel.style.display = 'block';
  }
};

for (var inp = 0; inp < filterInputs.length; inp++) {
  filterInputs[inp].addEventListener('change', addFilter);
}
// хотел сделать с fieldset делегирование, но не работает. fieldset.addEventListener('change', addFilter);

// валидация хештегов
var checkSameHashtags = function (arr) {
  for (var i = 0; i < arr.length - 1; i++) {
    for (var j = i + 1; j < arr.length; j++) {
      var hTagRe = new RegExp('^' + arr[i] + '$', 'i');
      if (hTagRe.test(arr[j])) {
        return true;
      }
    }
  }

  return false;
};


var checkHashtags = function () {
  hashtags.addEventListener('input', function () {
    var hashTegRe = /^#[0-9a-zA-Zа-яА-я]{1,19}$/i;
    var numberErrorsHashtags = 0;

    var text = hashtags.value.trim();
    if (text) {
      var hashtagsArray = text.split(' ');

      for (var i = 0; i < hashtagsArray.length; i++) {
        if (!hashTegRe.test(hashtagsArray[i])) {
          numberErrorsHashtags++;
        }
      }

      if (numberErrorsHashtags) {
        hashtags.setCustomValidity('Исправьте ошибки в  хэштеге');
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
  });

  hashtags.addEventListener('focus', function () {
    document.removeEventListener('keydown', onUploadOverlayEscPress);
  });

  hashtags.addEventListener('blur', function () {
    document.addEventListener('keydown', onUploadOverlayEscPress);
  });
};

checkHashtags();
