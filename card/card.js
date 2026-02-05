// Pointer-only "clickable card" behavior:
// - Click on the card navigates to the card destination
// - If user clicks the CTA link, default link behavior occurs
// - Keyboard users still have the CTA link as the single tab stop for navigation

(function () {
  const card = document.querySelector('[data-card]');
  if (!card) return;

  const href = card.getAttribute('data-href');
  if (!href) return;

  card.addEventListener('click', (e) => {
    // If click originated on a real interactive element (like the link), do nothing.
    const interactive = e.target.closest('a, button, input, select, textarea');
    if (interactive) return;

    window.location.href = href;
  });
})();