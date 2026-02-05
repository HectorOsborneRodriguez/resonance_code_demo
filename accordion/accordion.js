// Reference behavior logic aligned to Accordion ACs and TCs
// Keeps state, ARIA, and visibility in sync

(function () {
  function toggle(trigger) {
    const panelId = trigger.getAttribute('aria-controls');
    const panel = document.getElementById(panelId);
    const expanded = trigger.getAttribute('aria-expanded') === 'true';

    // AC-ACC-STA-TRG-09 / 10
    trigger.setAttribute('aria-expanded', String(!expanded));

    // AC-ACC-STA-PNL-06 / 07
    if (expanded) {
      panel.setAttribute('hidden', '');
    } else {
      panel.removeAttribute('hidden');
    }

    // AC-ACC-KB-PNL-08
    // Focus intentionally remains on the trigger
  }

  function onKeyDown(event) {
    const trigger = event.currentTarget;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggle(trigger);
    }
  }

  function init() {
    const triggers = document.querySelectorAll('.accordion__trigger');

    triggers.forEach(trigger => {
      trigger.addEventListener('click', () => toggle(trigger));
      trigger.addEventListener('keydown', onKeyDown);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();