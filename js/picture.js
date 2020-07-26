'use strict';

(function () {
  var MAX_COMMENTS_LENGTH = 5;
  var pictureComments = [];

  var pictureElement = document.querySelector('.big-picture');
  var closePictureButton = document.getElementById('picture-cancel');
  var commentTemplate = document
    .getElementById('picture__comment').content
    .querySelector('.social__comment');

  var commentField = pictureElement.querySelector('.social__footer-text');
  var pictureImg = pictureElement.querySelector('.big-picture__img img');
  var likesAmount = pictureElement.querySelector('.likes-count');
  var commentCountVisible = pictureElement.querySelector('.comment-count__visible');
  var commentCountAll = pictureElement.querySelector('.comments-count__all');
  var pictureCaption = pictureElement.querySelector('.social__caption');
  var pictureCommentsElement = pictureElement.querySelector('.social__comments');
  var loadCommentsButton = pictureElement.querySelector('.comments-loader');

  function createCommentElement(comment) {
    var commentElement = commentTemplate.cloneNode(true);

    commentElement.querySelector('img').src = comment.avatar;
    commentElement.querySelector('img').alt = comment.name;
    commentElement.querySelector('.social__text').textContent = comment.message;

    return commentElement;
  }

  function createCommentsFragment(comments) {
    var fragment = document.createDocumentFragment();

    comments.forEach(function (comment) {
      fragment.appendChild(createCommentElement(comment));
    });

    return fragment;
  }

  function commentsLoadHandler() {
    var comments = pictureComments.splice(0, MAX_COMMENTS_LENGTH);
    var commentFragment = createCommentsFragment(comments);
    var visibleCount = Number(commentCountVisible.textContent) + comments.length;

    pictureCommentsElement.appendChild(commentFragment);

    if (!pictureComments.length) {
      loadCommentsButton.classList.add('hidden');
    }

    commentCountVisible.textContent = visibleCount;
  }

  function documentKeydownHandler(evt) {
    if (evt.key === 'Escape' && commentField !== document.activeElement) {
      evt.preventDefault();

      closePictureHandler();
    }
  }

  function closePictureHandler() {
    document.body.classList.remove('modal-open');
    pictureElement.classList.add('hidden');

    loadCommentsButton.removeEventListener('click', commentsLoadHandler);
    closePictureButton.removeEventListener('click', closePictureHandler);
    document.removeEventListener('keydown', documentKeydownHandler);
  }

  function showPicture(data) {
    document.body.classList.add('modal-open');
    pictureElement.classList.remove('hidden');
    loadCommentsButton.classList.remove('hidden');

    pictureComments = data.comments.slice();

    pictureImg.src = data.url;
    likesAmount.textContent = data.likes;
    pictureCaption.textContent = data.description;
    commentCountAll.textContent = data.comments.length;
    commentCountVisible.textContent = 0;
    pictureCommentsElement.innerHTML = '';

    commentsLoadHandler();

    loadCommentsButton.addEventListener('click', commentsLoadHandler);
    closePictureButton.addEventListener('click', closePictureHandler);
    document.addEventListener('keydown', documentKeydownHandler);
  }

  window.picture = {
    show: showPicture,
    close: closePictureHandler
  };
})();
