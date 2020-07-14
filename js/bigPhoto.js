'use strict';

(function () {
  var picturesList = document.querySelector('.pictures');
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancel = document.querySelector('.big-picture__cancel');
  var socialFooterText = document.querySelector('.social__footer-text');

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
      var picture = window.photos.find(function (value) {
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
