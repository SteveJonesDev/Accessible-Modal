(function() {
    // Modal configuration object
    const accessibleModal = {
        settings: {
            openButtons: document.querySelectorAll('.modal-open'),
            closeButtons: document.querySelectorAll('.modal-close, .modal-cancel'),
            modalOverlay: document.querySelector('.modal-overlay'),
            activeClass: 'is-active',
            modalId: 'accessible-modal',
            focusableElements: 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
            initialFocusElement: '#modal-title',
            form: document.querySelector('.modal form'),
        },

        /**
         * Initialize the modal functionality
         */
        init: () => {
            if (!accessibleModal.settings.modalOverlay) return;
            accessibleModal.bindEvents();
        },

        /**
         * Bind all event listeners
         */
        bindEvents: () => {
            const { openButtons, closeButtons, modalOverlay, form } = accessibleModal.settings;

            if (openButtons.length > 0) {
                openButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        accessibleModal.openModal();
                    });
                });
            }

            if (closeButtons.length > 0) {
                closeButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        accessibleModal.closeModal();
                    });
                });
            }

            if (modalOverlay) {
                modalOverlay.addEventListener('click', (e) => {
                    if (e.target === modalOverlay) {
                        accessibleModal.closeModal();
                    }
                });
            }

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && accessibleModal.isModalOpen()) {
                    accessibleModal.closeModal();
                }

                if (e.key === 'Tab' && accessibleModal.isModalOpen()) {
                    accessibleModal.trapFocus(e);
                }
            });

            if (form) {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();

                    /* eslint-disable no-alert */
                    alert("This is just a demonstration. If it were a real application, it would provide a message telling whether the entered name and email address is valid.");
                    /* eslint-enable no-alert */
                });
            }
        },

        /**
         * Open the modal
         */
        openModal: () => {
            accessibleModal.settings.previouslyFocused = document.activeElement;

            accessibleModal.settings.modalOverlay.classList.add(accessibleModal.settings.activeClass);
            document.body.classList.add('modal-open');
            document.body.style.overflow = 'hidden';

            accessibleModal.setInitialFocus();
        },

        /**
         * Close the modal
         */
        closeModal: () => {
            accessibleModal.settings.modalOverlay.classList.remove(accessibleModal.settings.activeClass);
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';

            document.querySelectorAll('.temp-focusable').forEach(el => {
                el.removeAttribute('tabindex');
                el.classList.remove('temp-focusable');
            });

            if (accessibleModal.settings.previouslyFocused) {
                accessibleModal.settings.previouslyFocused.focus();
            }
        },

        /**
         * Check if modal is currently open
         * @returns {boolean} True if modal is open
         */
        isModalOpen: () => {
            return accessibleModal.settings.modalOverlay.classList.contains(accessibleModal.settings.activeClass);
        },

        /**
         * Get all focusable elements inside the modal
         * @returns {NodeList} List of focusable elements
         */
        getFocusableElements: () => {
            const modal = document.getElementById(accessibleModal.settings.modalId);
            return modal ? modal.querySelectorAll(accessibleModal.settings.focusableElements) : [];
        },

        /**
         * Set initial focus when modal opens
         */
        setInitialFocus: () => {
            const focusElement = document.querySelector(accessibleModal.settings.initialFocusElement);

            if (focusElement) {
                if (!focusElement.getAttribute('tabindex')) {
                    focusElement.setAttribute('tabindex', '-1');
                    focusElement.classList.add('temp-focusable');
                }

                setTimeout(() => {
                    focusElement.focus();
                }, 50);
                return;
            }

            const focusableElements = accessibleModal.getFocusableElements();
            if (focusableElements.length > 0) {
                setTimeout(() => {
                    focusableElements[0].focus();
                }, 50);
            }
        },

        /**
         * Trap focus inside the modal
         */
        trapFocus: (e) => {
            const focusableElements = accessibleModal.getFocusableElements();
            if (focusableElements.length === 0) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        },
    };

    document.addEventListener('DOMContentLoaded', accessibleModal.init);
})();
