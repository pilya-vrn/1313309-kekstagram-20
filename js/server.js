'use strict';

(function () {
  var POST_URL = 'https://javascript.pages.academy/kekstagram';
  var URL_GET = 'https://javascript.pages.academy/kekstagram/data';

  var errorCodes = {
    400: 'Сервер обнаружил в запросе клиента синтаксическую ошибку',
    401: 'Требуется авторизация',
    403: 'Запрос отклонен по причине, что сервер не хочет (или не имеет возможности) ответить клиенту',
    404: 'Документ по указанному адресу не существует.',
    406: 'Ресурс, указанный клиентом по данному URI, существует, но не в том формате, который нужен клиенту',
    407: 'Прокси-сервер затребовал авторизацию'
  };
  var types = {
    json: 'json'
  };

  var loadingMessage = document
    .getElementById('messages').content
    .querySelector('.img-upload__message');

  function saveData(data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    window.modals.showModal(loadingMessage);

    xhr.onload = function () {
      window.modals.closeModal();

      if (xhr.status !== 200) {
        onError();
      } else {
        onSuccess(xhr.response);
      }
    };

    xhr.onerror = function () {
      window.modals.closeModal();
      onError();
    };

    xhr.responseType = types.json;
    xhr.open('POST', POST_URL);
    xhr.send(data);
  }

  function getData(onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    window.modals.showModal(loadingMessage);

    xhr.onload = function () {
      window.modals.closeModal();

      if (xhr.status !== 200) {
        onError(getErrorByCode(xhr.status, xhr.statusText));
      } else {
        onSuccess(xhr.response);
      }
    };

    xhr.onerror = function () {
      window.modals.closeModal();
      onError(getErrorByCode(xhr.status, xhr.statusText));
    };

    xhr.responseType = types.json;
    xhr.open('GET', URL_GET);
    xhr.send();
  }

  function getErrorByCode(errorCode, errorText) {
    var message = errorCodes[errorCode] ? errorCodes[errorCode] : errorText;

    return 'Ошибка запрса (' + errorCode + '): ' + message;
  }

  window.server = {
    getGallery: getData,
    savePicture: saveData
  };
})();
