'use strict';

(function () {
  var ACTIVE_FILTER_CLASS = 'img-filters__button--active';
  var MAX_RANDOM_LENGTH = 10;

  var filters = document.querySelector('.img-filters');

  var debounce = window.utils.debounce(500);

  function toggleActive() {
    filters.classList.toggle('img-filters--inactive');
  }

  function filtersChangeHandler(evt) {
    var filter = evt.target.closest('.img-filters__button');
    var activeFilter = filters.getElementsByClassName(ACTIVE_FILTER_CLASS)[0];

    if (filter && (filter !== activeFilter)) {
      debounce(function () {
        changeFilter(activeFilter, filter);
      });
    }
  }

  function changeFilter(activeFilter, filter) {
    activeFilter.classList.remove(ACTIVE_FILTER_CLASS);
    filter.classList.add(ACTIVE_FILTER_CLASS);

    var type = filter.dataset.value;
    var pictures = filterByType(window.gallery.pictures, type);

    window.gallery.renderGallery(pictures);
  }

  function filterByType(arr, type) {
    switch (type) {
      case 'random':
        return window.utils.shuffle(arr.slice(0, MAX_RANDOM_LENGTH));
      case 'discussed':
        return arr.slice().sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });
      default:
        return arr;
    }
  }

  filters.addEventListener('click', filtersChangeHandler);

  window.filtres = {
    toggleActive: toggleActive
  };
})();
