// Card List reference behavior:
// - Roving tabindex on cards for ArrowUp/ArrowDown focus navigation
// - Live status announces list length and "item x of y" when focus moves

(function () {
  const root = document.querySelector('[data-card-list]');
  if (!root) return;

  const cards = Array.from(root.querySelectorAll('[data-card]'));
  const status = root.querySelector('[data-status]');

  function announce(message) {
    if (!status) return;
    status.textContent = '';
    setTimeout(() => { status.textContent = message; }, 10);
  }

  function setRoving(index) {
    cards.forEach((c, i) => {
      c.setAttribute('tabindex', i === index ? '0' : '-1');
    });
  }

  function focusCard(index) {
    const clamped = Math.max(0, Math.min(index, cards.length - 1));
    setRoving(clamped);
    cards[clamped].focus();

    announce(`Card ${clamped + 1} of ${cards.length}`);
  }

  function init() {
    if (cards.length === 0) return;

    // Initial roving focus (first card)
    setRoving(0);

    // Announce count on first focus into list region (optional but helpful)
    announce(`${cards.length} cards available`);

    cards.forEach((card, idx) => {
      card.addEventListener('focus', () => {
        announce(`Card ${idx + 1} of ${cards.length}`);
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          focusCard(idx + 1);
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          focusCard(idx - 1);
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();