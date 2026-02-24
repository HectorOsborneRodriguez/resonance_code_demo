// Reference behavior logic aligned to Tabs ACs and TCs
// Keeps state, ARIA, tabindex, and visibility in sync, with agent-friendly hooks.
(function () {
  function activateTab(tab, tabs, panels) {
    // Deactivate all tabs
    tabs.forEach(function (t) {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
      t.classList.remove('tabs__tab--selected');
    });

    // Hide all panels
    panels.forEach(function (p) {
      p.setAttribute('hidden', '');
    });

    // Activate the selected tab
    tab.setAttribute('aria-selected', 'true');
    tab.setAttribute('tabindex', '0');
    tab.classList.add('tabs__tab--selected');

    // Show the corresponding panel
    var panelId = tab.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    panel.removeAttribute('hidden');

    // Keep focus on the tab (do not move to panel)
    tab.focus();
  }

  function onKeyDown(event, tabs, panels) {
    var currentTab = event.currentTarget;
    var index = Array.prototype.indexOf.call(tabs, currentTab);
    var newIndex;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        newIndex = (index + 1) % tabs.length;
        tabs[newIndex].focus();
        break;

      case 'ArrowLeft':
        event.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
        tabs[newIndex].focus();
        break;

      case 'Home':
        event.preventDefault();
        tabs[0].focus();
        break;

      case 'End':
        event.preventDefault();
        tabs[tabs.length - 1].focus();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        activateTab(currentTab, tabs, panels);
        break;

      default:
        break;
    }
  }

  function init() {
    // Scope to a specific tabs instance if needed
    var root = document.querySelector('[data-component="tabs"]') || document;
    var tablist = root.querySelector('[role="tablist"]');
    var tabs = tablist.querySelectorAll('[role="tab"]');
    var panels = root.querySelectorAll('[role="tabpanel"]');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateTab(tab, tabs, panels);
      });

      tab.addEventListener('keydown', function (event) {
        onKeyDown(event, tabs, panels);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
