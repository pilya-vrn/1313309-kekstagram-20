'use strict';

(function () {
  var xhr = new XMLHttpRequest();

  var getDataFromServer = function (url, onSuccess, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status !== 200) {
        onError(xhr.status, xhr.statusText);
      } else {
        onSuccess(xhr.response);
      }
    });

    xhr.responseType = 'json';
    xhr.open('GET', url);
    xhr.send();
  };

  var uploadDataToServer = function (url, data, onSuccess, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status !== 200) {
        onError(xhr.status, xhr.statusText);
      }

      onSuccess(xhr.response);
    });

    xhr.open('POST', url);
    xhr.send(data);
  };
  /*
  var serverErrorMap = {
    '400': 'Сервер обнаружил в запросе клиента синтаксическую ошибку',
    '401': 'Требуется авторизация',
    '403': 'Запрос отклонен по причине, что сервер не хочет (или не имеет возможности) ответить клиенту',
    '404': 'Документ по указанному адресу не существует.',
    '406': 'Ресурс, указанный клиентом по данному URI, существует, но не в том формате, который нужен клиенту',
    '407': 'Прокси-сервер затребовал авторизацию'
  }; */
  /*
  var getErrorByCode = function (errorCode, errorText) {
    var message = serverErrorMap[errorCode] ? serverErrorMap[errorCode] : errorText;

    return 'Ошибка запрса (' + errorCode + '): ' + message;
  }; */

  window.server = {
    getDataFromServer: getDataFromServer,
    uploadDataToServer: uploadDataToServer,
    // getErrorByCode: getErrorByCode
  };

})();
