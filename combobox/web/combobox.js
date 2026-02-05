// Minimal combobox (editable + listbox) demo
// Pattern: focus remains on input; options tracked via aria-activedescendant.

(function () {
  const input = document.querySelector('[data-cbx="input"]');
  const listbox = document.querySelector('[data-cbx="listbox"]');
  const hint = document.querySelector('[data-cbx="hint"]');

  if (!input || !listbox) return;

  const allOptions = [
    { id: 'opt-ottawa', label: 'Ottawa' },
    { id: 'opt-montreal', label: 'Montreal' },
    { id: 'opt-toronto', label: 'Toronto' },
    { id: 'opt-vancouver', label: 'Vancouver' },
    { id: 'opt-calgary', label: 'Calgary' },
  ];

  let filtered = [...allOptions];
  let activeIndex = -1;

  function isOpen() {
    return input.getAttribute('aria-expanded') === 'true';
  }

  function open() {
    input.setAttribute('aria-expanded', 'true');
    listbox.classList.add('open');
    listbox.hidden = false;
    if (hint) hint.textContent = 'Use Arrow keys to navigate options. Enter selects. Escape closes.';
  }

  function close() {
    input.setAttribute('aria-expanded', 'false');
    listbox.classList.remove('open');
    listbox.hidden = true;
    setActive(-1);
  }

  function render() {
    listbox.innerHTML = '';
    filtered.forEach((o, i) => {
      const li = document.createElement('div');
      li.className = 'option';
      li.id = o.id;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(o.label === input.dataset.selectedLabel));
      li.textContent = o.label;

      li.addEventListener('mousedown', (e) => {
        // prevent input blur
        e.preventDefault();
      });

      li.addEventListener('click', () => {
        selectIndex(i);
      });

      listbox.appendChild(li);
    });
  }

  function setActive(index) {
    activeIndex = index;
    const optionEls = Array.from(listbox.querySelectorAll('.option'));
    optionEls.forEach((el) => el.classList.remove('is-active'));

    if (index >= 0 && optionEls[index]) {
      optionEls[index].classList.add('is-active');
      input.setAttribute('aria-activedescendant', optionEls[index].id);
    } else {
      input.removeAttribute('aria-activedescendant');
    }
  }

  function selectIndex(index) {
    const o = filtered[index];
    if (!o) return;

    input.value = o.label;
    input.dataset.selectedLabel = o.label;

    // Update aria-selected in DOM
    Array.from(listbox.querySelectorAll('.option')).forEach((el) => {
      el.setAttribute('aria-selected', String(el.textContent === o.label));
    });

    close();
  }

  function filterByValue() {
    const q = input.value.trim().toLowerCase();
    filtered = allOptions.filter(o => o.label.toLowerCase().includes(q));
    render();

    // if open, keep active in range
    if (isOpen()) {
      setActive(filtered.length ? 0 : -1);
    }
  }

  // Initialize
  render();
  close();

  input.addEventListener('input', () => {
    if (!isOpen()) open();
    filterByValue();
  });

  input.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen()) open();
      if (!filtered.length) return;
      const next = activeIndex < filtered.length - 1 ? activeIndex + 1 : filtered.length - 1;
      setActive(next);
      return;
    }

    if (key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen()) open();
      if (!filtered.length) return;
      const prev = activeIndex > 0 ? activeIndex - 1 : 0;
      setActive(prev);
      return;
    }

    if (key === 'Enter') {
      if (isOpen()) {
        e.preventDefault();
        if (activeIndex >= 0) selectIndex(activeIndex);
      }
      return;
    }

    if (key === ' ') {
      // Space opens when collapsed; when open, selects active option (demo behavior)
      if (!isOpen()) {
        e.preventDefault();
        open();
        if (filtered.length) setActive(0);
      } else if (activeIndex >= 0) {
        e.preventDefault();
        selectIndex(activeIndex);
      }
      return;
    }

    if (key === 'Escape') {
      if (isOpen()) {
        e.preventDefault();
        close();
      }
      return;
    }

    if (key === 'Tab') {
      // Do not trap focus; collapse and allow default tabbing
      close();
      return;
    }
  });

  input.addEventListener('click', () => {
    if (isOpen()) {
      close();
    } else {
      open();
      filterByValue();
      if (filtered.length) setActive(0);
    }
  });
})();
