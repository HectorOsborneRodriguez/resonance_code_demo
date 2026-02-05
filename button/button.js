(function () {
  const root = document.querySelector('[data-btn-demo]');
  if (!root) return;

  const status = root.querySelector('[data-status]');
  const toggleBtn = root.querySelector('#btn-toggle');
  const panel = root.querySelector('#btn-panel');

  function setStatus(message) {
    if (!status) return;
    status.textContent = message;
  }

  function toggleRegion() {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!expanded));

    if (expanded) {
      panel.setAttribute('hidden', '');
      setStatus('Details collapsed.');
    } else {
      panel.removeAttribute('hidden');
      setStatus('Details expanded.');
    }

    // Intentionally do NOT move focus (aligns with predictable focus behavior)
  }

  root.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const action = btn.getAttribute('data-action');

    if (action === 'toast') {
      setStatus('Action executed.');
    }

    if (action === 'toggle') {
      toggleRegion();
    }
  });
})();