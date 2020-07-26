'use strict';

(function () {
  var mainSection = document.querySelector('main');
  var activeModal;

  function showModal(modal) {
    activeModal = modal;

    mainSection.appendChild(modal);

    modal.addEventListener('click', onModalClick);
    modal.addEventListener('keydown', onModalEscapeClose);
  }

  function closeModal() {
    if (activeModal) {
      activeModal.remove();
      activeModal = undefined;
    }
  }

  function onModalClick(evt) {
    if (
      !evt.target.closest('[data-modal-content]') ||
      evt.target.dataset.modalButton === 'close'
    ) {
      closeModal();
    }
  }

  function onModalEscapeClose(evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeModal();
    }
  }

  window.modals = {
    showModal: showModal,
    closeModal: closeModal
  };
})();
