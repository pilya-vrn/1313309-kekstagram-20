'use strict';

(function () {
  var MAX_COMMENT_LENGTH = 140;
  var MAX_TAGS_LENGTH = 5;
  var BLUR_MAX_VALUE = 3;
  var BRIGHTNESS_MIN_VALUE = 1;
  var BRIGHTNESS_MAX_VALUE = 3;
  var SCALE_MIN_VALUE = 25;
  var SCALE_MAX_VALUE = 100;
  var SCALE_STEP_VALUE = 25;
  var DEFAULT_EFFECT_VALUE = 0;
  var TAG_REG_EXP = /^#[0-9a-z]{1,19}$/i;

  var fileField = document.getElementById('upload-file');
  var uploadForm = document.querySelector('.img-upload__form');

  var previewSection = uploadForm.querySelector('.img-upload__preview');
  var previewImage = uploadForm.querySelector('.img-upload__preview img');
  var formOverlay = uploadForm.querySelector('.img-upload__overlay');
  var hashTagField = uploadForm.querySelector('.text__hashtags');
  var commentField = uploadForm.querySelector('.text__description');

  function onFormEscapeClose(evt) {
    if (evt.key === 'Escape' && evt.target !== hashTagField && evt.target !== commentField) {
      evt.preventDefault();
      uploadForm.reset();
    }
  }

  function onFileLoad(evt) {
    document.body.classList.add('modal-open');
    formOverlay.classList.remove('hidden');

    previewImage.src = URL.createObjectURL(evt.target.files[0]);

    document.addEventListener('keydown', onFormEscapeClose);
  }

  function onFormReset() {
    document.body.classList.remove('modal-open');
    formOverlay.classList.add('hidden');
    effectLevel.classList.add('hidden');

    previewImage.removeAttribute('class');
    previewImage.removeAttribute('style');
    previewSection.removeAttribute('style');

    document.removeEventListener('keydown', onFormEscapeClose);
  }

  // Масштаб
  var scale = formOverlay.querySelector('.img-upload__scale');
  var scaleReduceBtn = scale.querySelector('.scale__control--smaller');
  var scaleIncreaseBtn = scale.querySelector('.scale__control--bigger');
  var scaleValue = scale.querySelector('.scale__control--value');

  function scaleChangeHandler(evt) {
    var target = evt.target;

    if (target === scaleIncreaseBtn || target === scaleReduceBtn) {
      var currentScale = parseInt(scaleValue.value, 10);
      var value;

      switch (target) {
        case scaleReduceBtn:
          value = Math.max(SCALE_MIN_VALUE, currentScale - SCALE_STEP_VALUE);
          break;
        case scaleIncreaseBtn:
          value = Math.min(SCALE_MAX_VALUE, currentScale + SCALE_STEP_VALUE);
          break;
        default:
          value = 100;
          break;
      }

      scaleValue.value = value + '%';
      previewSection.style.transform = 'scale(' + value / 100 + ')';
    }
  }

  // Эффекты для изображения
  var defaultEffect = document.getElementById('effect-none');

  var effects = uploadForm.querySelector('.effects');
  var effectLevel = uploadForm.querySelector('.effect-level');
  // Ползунок эффекта
  var effectLevelLine = uploadForm.querySelector('.effect-level__line');
  var effectLevelPin = uploadForm.querySelector('.effect-level__pin');
  var effectLevelDepth = uploadForm.querySelector('.effect-level__depth');
  var effectLevelValue = uploadForm.querySelector('.effect-level__value');

  var activeEffect = defaultEffect;

  function effectsChangeHandler(evt) {
    activeEffect = evt.target;

    if (activeEffect === defaultEffect) {
      effectLevel.classList.add('hidden');
      previewImage.removeAttribute('class');
      previewImage.removeAttribute('style');
    } else {
      previewImage.removeAttribute('style');

      effectLevel.classList.remove('hidden');
      previewImage.className = 'effects__preview--' + activeEffect.value;

      setEffectLevelData(DEFAULT_EFFECT_VALUE);
    }
  }

  function setEffectLevelData(level) {
    var saturation = Math.round(level / effectLevelLine.offsetWidth * 100);

    effectLevelValue.value = saturation;
    effectLevelPin.style.left = level + 'px';
    effectLevelDepth.style.width = level + 'px';

    previewImage.style.filter = convertPercentToCssFilter(saturation, activeEffect.value);
  }

  function onPinMouseDown(evt) {
    evt.preventDefault();

    var startCords = evt.clientX;

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var shift = startCords - moveEvt.clientX;
      var newCords = effectLevelPin.offsetLeft - shift;

      startCords = moveEvt.clientX;

      if (newCords >= 0 && newCords <= effectLevelLine.offsetWidth) {
        setEffectLevelData(newCords);
      }
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function convertPercentToCssFilter(percent, filter) {
    switch (filter) {
      case 'chrome':
        return 'grayscale(' + percent / 100 + ')';
      case 'sepia':
        return 'sepia(' + percent / 100 + ')';
      case 'marvin':
        return 'invert(' + percent / 100 + ')';
      case 'phobos':
        return 'blur(' + percent * BLUR_MAX_VALUE / 100 + 'px)';
      case 'heat':
        return 'brightness(' +
          percent * (BRIGHTNESS_MAX_VALUE - BRIGHTNESS_MIN_VALUE) / 100 + BRIGHTNESS_MIN_VALUE
          + ')';
      default:
        return 'none';
    }
  }

  // Валидация хештегов и комментария
  function isTagsUnique(tags) {
    var lowerCaseTags = tags.map(function (value) {
      return value.toLowerCase();
    });
    var uniqueValues = {};

    for (var i = 0; i < lowerCaseTags.length; i++) {
      if (uniqueValues[lowerCaseTags[i]]) {
        return true;
      }

      uniqueValues[lowerCaseTags[i]] = 1;
    }

    return false;
  }

  function isTagValid(tags) {
    for (var i = 0; i < tags.length; i++) {
      if (!TAG_REG_EXP.test(tags[i])) {
        return false;
      }
    }

    return true;
  }

  function validateHashTags(tags) {
    if (!isTagValid(tags)) {
      hashTagField.setCustomValidity('Исправьте ошибки в хэштеге');
      hashTagField.reportValidity();
    } else if (tags.length > MAX_TAGS_LENGTH) {
      hashTagField.setCustomValidity('Не больше 5 хэштегов');
      hashTagField.reportValidity();
    } else if (isTagsUnique(tags)) {
      hashTagField.setCustomValidity('Удалите одинаковые хэштеги');
      hashTagField.reportValidity();
    } else {
      hashTagField.setCustomValidity('');
    }
  }

  function onHashTagsChange(evt) {
    var value = evt.target.value.trim();

    if (value) {
      validateHashTags(value.split(' '));
    }
  }

  function onCommentChange(evt) {
    if (evt.target.value.toLowerCase().length > MAX_COMMENT_LENGTH) {
      commentField.setCustomValidity('Количество введенных символов не должно превышать 140');
      commentField.reportValidity();
    } else {
      hashTagField.setCustomValidity('');
    }
  }

  // Шаблоны модальных окон
  var errorMessage = document
    .getElementById('error').content
    .querySelector('.error');
  var successMessage = document
    .getElementById('success').content
    .querySelector('.success');

  function onSuccess() {
    uploadForm.reset();
    window.modals.showModal(successMessage);
  }

  function onError() {
    window.modals.showModal(errorMessage);
  }

  function onFormSubmit(evt) {
    evt.preventDefault();

    window.server.savePicture(new FormData(uploadForm), onSuccess, onError);
  }

  scale.addEventListener('click', scaleChangeHandler);
  effects.addEventListener('change', effectsChangeHandler);
  effectLevelPin.addEventListener('mousedown', onPinMouseDown);

  hashTagField.addEventListener('input', onHashTagsChange);
  commentField.addEventListener('input', onCommentChange);
  fileField.addEventListener('change', onFileLoad);

  uploadForm.addEventListener('submit', onFormSubmit);
  uploadForm.addEventListener('reset', onFormReset);
})();
