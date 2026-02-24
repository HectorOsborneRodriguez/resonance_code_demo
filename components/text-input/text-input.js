// Reference behavior logic aligned to Text Input ACs and TCs
// Handles validation, error display, and focus management.
(function () {
  function showError(input, errorEl) {
    input.setAttribute('aria-invalid', 'true');
    var describedby = input.getAttribute('aria-describedby') || '';
    if (describedby.indexOf(errorEl.id) === -1) {
      input.setAttribute('aria-describedby', describedby + ' ' + errorEl.id);
    }
    errorEl.removeAttribute('hidden');
  }

  function clearError(input, errorEl) {
    input.removeAttribute('aria-invalid');
    var describedby = input.getAttribute('aria-describedby') || '';
    input.setAttribute('aria-describedby', describedby.replace(errorEl.id, '').trim());
    errorEl.setAttribute('hidden', '');
  }

  function validate(form) {
    var firstInvalid = null;
    var fields = form.querySelectorAll('.text-input');

    fields.forEach(function (field) {
      var input = field.querySelector('.text-input__input');
      var errorEl = field.querySelector('.text-input__error');

      if (!input.checkValidity()) {
        showError(input, errorEl);
        if (!firstInvalid) firstInvalid = input;
      } else {
        clearError(input, errorEl);
      }
    });

    return firstInvalid;
  }

  function init() {
    var form = document.querySelector('[data-component="text-input"]');
    if (!form) return;

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var firstInvalid = validate(form);
      if (firstInvalid) {
        firstInvalid.focus();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
