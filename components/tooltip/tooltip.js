// Reference behavior logic aligned to Tooltip ACs and TCs
// Covers Pattern 1 (Hover/Focus) and Pattern 2 (Click/Enter/Space)
// Keeps state, ARIA, and visibility in sync, with agent-friendly hooks.
(function () {
  'use strict';

  // ---------------------------------------------------------
  //  Helpers
  // ---------------------------------------------------------

  function showPanel(panel) {
    panel.setAttribute('data-visible', 'true');
  }

  function hidePanel(panel) {
    panel.setAttribute('data-visible', 'false');
  }

  // ---------------------------------------------------------
  //  Pattern 1: Hover / Focus
  //  Trigger = <div tabindex="0">
  //  Panel shows on focus / mouseenter
  //  Panel hides on blur / mouseleave
  // ---------------------------------------------------------

  function initPattern1() {
    var triggers = document.querySelectorAll('[data-ttp-pattern="1"] [data-ttp-role="trigger"]');

    triggers.forEach(function (trigger) {
      var panelId = trigger.getAttribute('aria-describedby');
      // aria-describedby may contain multiple IDs; the panel ID is the last token
      var ids = panelId ? panelId.trim().split(/\s+/) : [];
      var panel = null;
      // Find the element that is actually the tooltip panel
      for (var i = ids.length - 1; i >= 0; i--) {
        var candidate = document.getElementById(ids[i]);
        if (candidate && candidate.getAttribute('role') === 'tooltip') {
          panel = candidate;
          break;
        }
      }
      if (!panel) return;

      // Show on focus
      trigger.addEventListener('focus', function () {
        showPanel(panel);
      });

      // Hide on blur
      trigger.addEventListener('blur', function () {
        hidePanel(panel);
      });

      // Show on mouseenter (trigger)
      trigger.addEventListener('mouseenter', function () {
        showPanel(panel);
      });

      // Hide on mouseleave (trigger), but not if panel is being hovered
      trigger.addEventListener('mouseleave', function () {
        // Small delay to allow mouse to reach the panel
        setTimeout(function () {
          if (!panel.matches(':hover')) {
            hidePanel(panel);
          }
        }, 100);
      });

      // Allow hovering over the panel itself without hiding it
      panel.addEventListener('mouseenter', function () {
        showPanel(panel);
      });

      panel.addEventListener('mouseleave', function () {
        // Only hide if the trigger is also not focused or hovered
        if (document.activeElement !== trigger && !trigger.matches(':hover')) {
          hidePanel(panel);
        }
      });
    });
  }

  // ---------------------------------------------------------
  //  Pattern 2: Click / Enter / Space
  //  Trigger = <button>
  //  Toggle on click / Enter / Space
  //  Close on Escape
  // ---------------------------------------------------------

  function initPattern2() {
    var triggers = document.querySelectorAll('[data-ttp-pattern="2"] [data-ttp-role="trigger"]');

    triggers.forEach(function (trigger) {
      var panelId = trigger.getAttribute('aria-controls');
      var panel = panelId ? document.getElementById(panelId) : null;
      if (!panel) return;

      function isOpen() {
        return trigger.getAttribute('aria-expanded') === 'true';
      }

      function openTooltip() {
        trigger.setAttribute('aria-expanded', 'true');
        showPanel(panel);
      }

      function closeTooltip() {
        trigger.setAttribute('aria-expanded', 'false');
        hidePanel(panel);
      }

      function toggle() {
        if (isOpen()) {
          closeTooltip();
        } else {
          openTooltip();
        }
      }

      // Click handler
      trigger.addEventListener('click', function (event) {
        event.preventDefault();
        toggle();
        // Defensive: keep focus on trigger
        trigger.focus();
      });

      // Keydown handler — Escape only.
      // Enter/Space are handled by the native <button> click event
      // to avoid double-toggle (keydown fires toggle, then the
      // browser's synthetic click fires toggle again).
      trigger.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
          if (isOpen()) {
            event.preventDefault();
            closeTooltip();
          }
        }
      });
    });
  }

  // ---------------------------------------------------------
  //  Init
  // ---------------------------------------------------------

  function init() {
    initPattern1();
    initPattern2();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
