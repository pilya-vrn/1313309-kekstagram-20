'use strict';

(function () {
  var pictureTemplate = document
    .getElementById('picture').content
    .querySelector('.picture');
  var gallery = document.querySelector('.pictures__gallery');

  function createPictureElement(picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.dataset.id = picture.id;
    pictureElement.querySelector('.picture__img').src = picture.url;
    pictureElement.querySelector('.picture__likes').textContent = picture.likes;
    pictureElement.querySelector('.picture__comments').innerHTML = picture.comments.length;

    return pictureElement;
  }

  function createGalleryFragment(pictures) {
    var fragment = document.createDocumentFragment();

    pictures.forEach(function (picture) {
      fragment.appendChild(createPictureElement(picture));
    });

    return fragment;
  }

  function successHandler(response) {
    window.gallery.pictures = response.map(function (photo) {
      photo.id = Math.random();

      return photo;
    });

    window.filtres.toggleActive();
    renderGallery(window.gallery.pictures);
  }

  function renderGallery(pictures) {
    var fragment = createGalleryFragment(pictures);

    gallery.innerHTML = '';
    gallery.appendChild(fragment);
  }

  function galleryClickHandler(evt) {
    var pictureElement = evt.target.closest('.picture');

    if (pictureElement) {
      evt.preventDefault();

      var picture = window.gallery.pictures.find(function (photo) {
        return photo.id.toString() === pictureElement.dataset.id;
      });

      if (picture) {
        window.picture.show(picture);
      }
    }
  }

  function documentKeydownHandler(evt) {
    if (evt.key === 'Enter') {
      galleryClickHandler(evt);
    }
  }

  gallery.addEventListener('click', galleryClickHandler);
  document.addEventListener('keydown', documentKeydownHandler);

  window.server.getGallery(successHandler);

  window.gallery = {
    renderGallery: renderGallery,
    pictures: []
  };
})();
