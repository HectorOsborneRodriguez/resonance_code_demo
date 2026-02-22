(() => {
  const root = document.querySelector('[data-dropdown]');
  if (!root) return;

  const trigger = root.querySelector('#drp-trigger');
  const listbox = root.querySelector('#drp-listbox');
  const valueEl = root.querySelector('[data-value]');
  const options = () => Array.from(listbox.querySelectorAll('[role="option"]'));

  let activeIndex = -1;

  function isOpen() {
    return trigger.getAttribute('aria-expanded') === 'true';
  }

  function setOpen(next) {
    trigger.setAttribute('aria-expanded', next ? 'true' : 'false');
    listbox.hidden = !next;
    if (!next) {
      clearActive();
    } else {
      // Ensure we have an active option when opening.
      const selected = options().findIndex(o => o.getAttribute('aria-selected') === 'true');
      setActive(selected >= 0 ? selected : 0);
    }
  }

  function clearActive() {
    options().forEach(o => o.classList.remove('is-active'));
    trigger.setAttribute('aria-activedescendant', '');
    activeIndex = -1;
  }

  function setActive(idx) {
    const opts = options();
    if (!opts.length) return;
    const nextIndex = Math.max(0, Math.min(idx, opts.length - 1));
    opts.forEach(o => o.classList.remove('is-active'));
    const opt = opts[nextIndex];
    opt.classList.add('is-active');
    trigger.setAttribute('aria-activedescendant', opt.id);
    activeIndex = nextIndex;

    // Keep active option in view.
    opt.scrollIntoView({ block: 'nearest' });
  }

  function selectActive() {
    const opts = options();
    const opt = opts[activeIndex];
    if (!opt) return;

    opts.forEach(o => o.setAttribute('aria-selected', 'false'));
    opt.setAttribute('aria-selected', 'true');
    valueEl.textContent = opt.textContent.trim();
    setOpen(false);
  }

  function closeIfFocusLeaves(e) {
    // Close only when focus moves outside the whole dropdown.
    if (!root.contains(e.relatedTarget)) setOpen(false);
  }

  trigger.addEventListener('click', () => setOpen(!isOpen()));
  trigger.addEventListener('blur', closeIfFocusLeaves);

  trigger.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key === 'Enter' || key === ' ') {
      e.preventDefault();
      if (!isOpen()) setOpen(true);
      else selectActive();
      return;
    }

    if (key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen()) setOpen(true);
      else setActive(activeIndex + 1);
      return;
    }

    if (key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen()) setOpen(true);
      else setActive(activeIndex - 1);
      return;
    }

    if (key === 'Escape') {
      e.preventDefault();
      if (isOpen()) setOpen(false);
    }
  });

  listbox.addEventListener('mousedown', (e) => {
    // Prevent focus from leaving trigger before click selection completes.
    e.preventDefault();
  });

  listbox.addEventListener('click', (e) => {
    const opt = e.target.closest('[role="option"]');
    if (!opt) return;
    const opts = options();
    const idx = opts.indexOf(opt);
    setActive(idx);
    selectActive();
    trigger.focus();
  });
})();
