'use strict';

(function () {
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;
  var SCALE_STEP = 25;
  var URL_POST = 'https://javascript.pages.academy/kekstagram';

  // загрузка нового изображения
  var body = document.querySelector('body');
  var uploadFile = document.querySelector('#upload-file');
  var uploadCancel = document.querySelector('#upload-cancel');
  var uploadOverlay = document.querySelector('.img-upload__overlay');
  var hashtags = uploadOverlay.querySelector('.text__hashtags');
  var textDescription = uploadOverlay.querySelector('.text__description');
  var sectionMain = document.querySelector('main');

  var onUploadOverlayEscPress = function (evt) {
    if (evt.key === 'Escape' && evt.target !== hashtags && evt.target !== textDescription) {
      evt.preventDefault();
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
    setDefaultParams();
    // setDefaultParams();
    // scaleValue.value = '100%';
    // uploadPreview.style.transform = 'scale(' + 1 + ')';
    // imgPreview.className = '';
    // effectLevel.style.display = 'none';
    // defaultEffect.checked = true;

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
    if (evt.target === scaleSmaller || evt.target === scaleBigger) {
      var currentScale = parseInt(scaleValue.value, 10);
      var scale;

      switch (evt.target) {
        case scaleSmaller:
          scale = Math.max(SCALE_MIN, currentScale - SCALE_STEP);
          break;
        case scaleBigger:
          scale = Math.min(SCALE_MAX, currentScale + SCALE_STEP);
          break;
        default:
          scale = 0;
          break;
      }

      scaleValue.value = scale + '%';
      uploadPreview.style.transform = 'scale(' + scale / 100 + ')';
    }
  };

  scaleField.addEventListener('click', onScaleChangeClick);

  // эффект на изображение
  var imgPreview = uploadPreview.querySelector('img');
  var imgUploadEffects = document.querySelector('.effects');
  var effectLevel = document.querySelector('.img-upload__effect-level');
  var defaultEffect = document.querySelector('#effect-none');


  effectLevel.style.display = 'none';

  var onFilterSwitch = function (evt) {
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--' + evt.target.value);

    effectLevel.style.display = defaultEffect.checked ? 'none' : 'block';
    effectLevelPin.style.left = 50 + 'px';
    effectLevelValue.value = 50 * 100 / effectLevelLine.offsetWidth;
    effectLevelDepth.style.width = effectLevelValue.value + '%';
  };

  imgUploadEffects.addEventListener('change', onFilterSwitch);

  // ползунок
  var effectLevelLine = document.querySelector('.effect-level__line');
  var effectLevelPin = document.querySelector('.effect-level__pin');
  var effectLevelDepth = document.querySelector('.effect-level__depth');
  var effectLevelValue = document.querySelector('.effect-level__value');
  var effectsRadio = document.querySelectorAll('.effects__radio');

  var getFilters = function (value) {
    return [
      '',
      'grayscale(' + value * 1 + ')',
      'sepia(' + value * 1 + ')',
      'invert(' + value * 100 + '%)',
      'blur(' + value * 3 + 'px)',
      'brightness(' + (value * 2 + 1) + ')'
    ];
  };

  effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoord = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoord - moveEvt.clientX;
      startCoord = moveEvt.clientX;
      var newCoord = effectLevelPin.offsetLeft - shift;
      var filterValue = newCoord / effectLevelLine.offsetWidth;

      if (newCoord < 0 || newCoord > effectLevelLine.offsetWidth) {
        newCoord = newCoord < 0 ? 0 : effectLevelLine.offsetWidth;
      }

      effectLevelPin.style.left = newCoord + 'px';
      effectLevelValue.value = newCoord * 100 / effectLevelLine.offsetWidth;
      effectLevelDepth.style.width = effectLevelValue.value + '%';

      for (var n = 0; n < effectsRadio.length; n++) {
        if (imgPreview.classList.contains('effects__preview--' + effectsRadio[n].value)) {
          imgPreview.style.filter = getFilters(filterValue)[n];
        }
      }

    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    // document.addEventListener('change', function () {});
    document.addEventListener('mouseup', onMouseUp);
  });

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
  textDescription.value = '';
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

  var setDefaultParams = function () {
    uploadFile.value = '';
    hashtags.value = '';
    textDescription.value = '';
    scaleValue.value = '100%';
    uploadPreview.style.transform = 'scale(' + 1 + ')';
    imgPreview.className = '';
    effectLevel.style.display = 'none';
    defaultEffect.checked = true;
  };

  textDescription.addEventListener('input', onCommentsChange);

  var successTemplate = document.querySelector('#success');
  var successMessage = successTemplate.content.querySelector('.success');
  var errorTemplate = document.querySelector('#error');
  var errorMessage = errorTemplate.content.querySelector('.error');
  var successButton = successMessage.querySelector('.success__button');
  var errorButton = errorMessage.querySelector('.error__button');

  var showImgUploadMessage = function (node, button, closeFunc, onMessagePressEsc) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(node);
    sectionMain.appendChild(fragment);
    uploadOverlay.classList.add('hidden');

    button.addEventListener('click', closeFunc);
    document.addEventListener('keydown', onMessagePressEsc);
  };

  var successHandler = function () {
    showImgUploadMessage(successMessage, successButton, closeSuccessMessage, onSuccessPressEsc);
  };

  var errorHandler = function () {
    showImgUploadMessage(errorMessage, errorButton, closeErrorMessage, onErrorPressEsc);
    throw new Error();
  };

  var onSuccessPressEsc = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeSuccessMessage();
    }
  };

  var onErrorPressEsc = function (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeErrorMessage();
    }
  };

  var closeMessage = function (node, button, closeFunc, onMessagePressEsc) {
    node.remove();
    button.removeEventListener('click', closeFunc);
    document.removeEventListener('keydown', onMessagePressEsc);
    setDefaultParams();
  };

  var closeSuccessMessage = function () {
    closeMessage(successMessage, successButton, closeSuccessMessage, onSuccessPressEsc);
  };

  var closeErrorMessage = function () {
    closeMessage(errorMessage, errorButton, closeErrorMessage, onErrorPressEsc);
  };
  /*
  var showSuccessMessageElement = function () {
    successMessage.classList.add('hidden');
    sectionMain.appendChild(successMessage);
  };

  var showErrorMessageElement = function () {
    errorMessage.classList.add('hidden');
    sectionMain.appendChild(errorMessage);
  };

  var showImgUploadSuccessMessage = function () {
    if (!document.querySelector('.successMessage')) {
      showSuccessMessageElement();
    }

    successMessage.classList.remove('hidden');

    var closeSuccessMessageMessage = function () {
      successMessage.classList.add('hidden');
      document.removeEventListener('keydown', onSuccessMessagePressEsc);
      successMessage.removeEventListener('click', onSuccessMessageClick);
    };

    var onSuccessMessageClick = function (evt) {
      if (evt.target.className === 'successMessage' || evt.target.className === 'success__button') {
        closeSuccessMessageMessage();
      }
    };

    var onSuccessMessagePressEsc = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeSuccessMessageMessage();
      }
    };

    successMessage.addEventListener('click', onSuccessMessageClick);
    document.addEventListener('keydown', onSuccessMessagePressEsc);
  };

  var showImgUploadErrorMessage = function () {
    if (!document.querySelector('.errorMessage')) {
      showErrorMessageElement();
    }

    // var errorMessage = document.querySelector('.errorMessage');
    errorMessage.classList.remove('hidden');

    var closeErrorMessageMessage = function () {
      errorMessage.classList.add('hidden');
      document.removeEventListener('keydown', onErrorMessagePressEsc);
      errorMessage.removeEventListener('click', onErrorMessageClick);
    };

    var onErrorMessageClick = function (evt) {
      if (evt.target.className === 'errorMessage' || evt.target.className === 'error__button') {
        closeErrorMessageMessage();
      }
    };

    var onErrorMessagePressEsc = function (evt) {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        closeErrorMessageMessage();
      }
    };

    errorMessage.addEventListener('click', onErrorMessageClick);
    document.addEventListener('keydown', onErrorMessagePressEsc);
  };

  var onSuccessUpload = function () {
    closeUploadOverlayHandler();
    showImgUploadSuccessMessage();
  };

  var onErrorUpload = function () {
    closeUploadOverlayHandler();
    showImgUploadErrorMessage();

    throw new Error();
  }; */

  var imgUploadForm = document.querySelector('.img-upload__form');
  imgUploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();

    var formData = new FormData(imgUploadForm);

    window.server.uploadDataToServer(URL_POST, formData, successHandler, errorHandler);
  });
  /*
  window.form = {
    closeUploadOverlayHandler: closeUploadOverlayHandler,
    showImgUploadSuccessMessage: showImgUploadSuccessMessage,
    showImgUploadErrorMessage: showImgUploadErrorMessage
  }; */
})();
