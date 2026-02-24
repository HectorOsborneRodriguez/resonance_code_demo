// Toggle Switch reference behavior aligned to Toggle Switch ACs and TCs
// Keeps aria-checked state in sync with user interaction.
// WAI-ARIA APG Switch pattern: Space toggles state, Enter also supported.
(function () {
  function toggle(switchEl) {
    // Do not toggle disabled switches (AC-TGS-STA-SWT-04)
    if (switchEl.getAttribute('aria-disabled') === 'true') {
      return;
    }

    var isChecked = switchEl.getAttribute('aria-checked') === 'true';
    switchEl.setAttribute('aria-checked', String(!isChecked));

    // Defensive: ensure focus remains on the switch (AC-TGS-KB-SWT-04)
    if (document.activeElement !== switchEl) {
      switchEl.focus();
    }
  }

  function onKeyDown(event) {
    var switchEl = event.currentTarget;

    // Space toggles (required per WAI-ARIA APG Switch pattern)
    if (event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault();
      toggle(switchEl);
    }

    // Enter toggles (recommended, AC-TGS-KB-SWT-03)
    if (event.key === 'Enter') {
      event.preventDefault();
      toggle(switchEl);
    }
  }

  function init() {
    var root = document.querySelector('[data-component="toggle-switch"]') || document;
    var switches = root.querySelectorAll('button[role="switch"][data-tgs-role="switch"]');

    switches.forEach(function (switchEl) {
      switchEl.addEventListener('click', function () {
        toggle(switchEl);
      });
      switchEl.addEventListener('keydown', onKeyDown);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
