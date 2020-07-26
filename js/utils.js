'use strict';

(function () {
  function debounce(ms) {
    var timer;

    return function (fn) {
      if (timer) {
        clearTimeout(timer);

        timer = setTimeout(function () {
          clearTimeout(timer);
          fn();
        }, ms);
      } else {
        timer = setTimeout(fn, ms);
      }
    };
  }

  function shuffle(array) {
    return array.sort(function () {
      return Math.random() - 0.5;
    });
  }

  window.utils = {
    shuffle: shuffle,
    debounce: debounce
  };
})();
