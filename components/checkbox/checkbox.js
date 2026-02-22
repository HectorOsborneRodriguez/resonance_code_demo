// Checkbox examples: native + custom ARIA checkbox
// Note: Prefer native <input type="checkbox"> when possible.

(function () {
  // Custom ARIA checkbox behavior
  const custom = document.querySelector('[data-role="aria-checkbox"]');
  if (!custom) return;

  function setChecked(next) {
    custom.setAttribute('aria-checked', next);
    // Announce changes can be observed via SR reading of state, no live region needed for standard checkbox.
  }

  function toggle() {
    const cur = custom.getAttribute('aria-checked');
    // Cycle: false -> true -> mixed -> false (demo)
    const next = cur === 'false' ? 'true' : cur === 'true' ? 'mixed' : 'false';
    setChecked(next);
  }

  custom.addEventListener('click', () => toggle());

  custom.addEventListener('keydown', (e) => {
    // Space toggles (required). Enter is commonly supported too.
    if (e.key === ' ' || e.key === 'Spacebar') {
      e.preventDefault();
      toggle();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  });

  // Initialize
  if (!custom.hasAttribute('tabindex')) custom.setAttribute('tabindex', '0');
  if (!custom.hasAttribute('aria-checked')) custom.setAttribute('aria-checked', 'false');
})();
