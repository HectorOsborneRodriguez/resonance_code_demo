(() => {
  const input = document.getElementById('city-input');
  const listbox = document.getElementById('city-listbox');
  const live = document.getElementById('city-live');

  const data = [
    { id: 'ott', label: 'Ottawa' },
    { id: 'mon', label: 'Montreal' },
    { id: 'tor', label: 'Toronto' },
    { id: 'van', label: 'Vancouver' },
    { id: 'cal', label: 'Calgary' },
    { id: 'hal', label: 'Halifax' },
  ];

  let filtered = [...data];
  let activeIndex = -1;
  let isOpen = false;

  function setExpanded(expanded) {
    isOpen = expanded;
    input.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    if (expanded) {
      listbox.hidden = false;
    } else {
      listbox.hidden = true;
      activeIndex = -1;
      input.removeAttribute('aria-activedescendant');
      updateActiveStyles();
    }
  }

  function announce(message) {
    // polite live region
    live.textContent = message;
  }

  function renderList() {
    listbox.innerHTML = '';

    if (filtered.length === 0) {
      // "no results" is NOT an option and should not be selectable.
      announce('No results found');
      setExpanded(true);
      return;
    }

    filtered.forEach((opt, i) => {
      const li = document.createElement('li');
      li.id = `city-opt-${opt.id}`;
      li.className = 'option';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', 'false');
      li.textContent = opt.label;

      // Use mousedown to avoid input blur before click
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
      });

      li.addEventListener('click', () => {
        selectIndex(i);
      });

      listbox.appendChild(li);
    });

    announce(`${filtered.length} results available.`);
    setExpanded(true);
    updateActiveStyles();
  }

  function updateActiveStyles() {
    const options = listbox.querySelectorAll('[role="option"]');
    options.forEach((el, idx) => {
      const isActive = idx === activeIndex;
      el.classList.toggle('active', isActive);
      el.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function setActiveIndex(next) {
    const options = listbox.querySelectorAll('[role="option"]');
    if (!options.length) return;

    activeIndex = Math.max(0, Math.min(next, options.length - 1));
    const activeEl = options[activeIndex];
    input.setAttribute('aria-activedescendant', activeEl.id);
    updateActiveStyles();

    // Ensure active option is visible
    activeEl.scrollIntoView({ block: 'nearest' });
  }

  function selectIndex(idx) {
    const opt = filtered[idx];
    if (!opt) return;

    input.value = opt.label;
    announce(`${opt.label} selected.`);
    setExpanded(false);
  }

  function filter() {
    const q = input.value.trim().toLowerCase();
    filtered = data.filter((opt) => opt.label.toLowerCase().includes(q));
    activeIndex = -1;
    renderList();
  }

  input.addEventListener('input', () => {
    filter();
  });

  input.addEventListener('keydown', (e) => {
    const key = e.key;

    if (key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        filter();
      }
      setActiveIndex(activeIndex < 0 ? 0 : activeIndex + 1);
      return;
    }

    if (key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        filter();
      }
      setActiveIndex(activeIndex < 0 ? 0 : activeIndex - 1);
      return;
    }

    if (key === 'Enter') {
      if (!isOpen) return;
      e.preventDefault();
      if (filtered.length === 0) {
        setExpanded(false);
        return;
      }
      if (activeIndex >= 0) {
        selectIndex(activeIndex);
      } else {
        // If no active option, keep list open but do not select.
        announce('No option selected.');
      }
      return;
    }

    if (key === 'Escape') {
      if (!isOpen) return;
      e.preventDefault();
      setExpanded(false);
      announce('Suggestions closed.');
      return;
    }

    // Tab should move focus out naturally; do not trap.
  });

  // Close list on blur if focus leaves the component
  input.addEventListener('blur', () => {
    // Delay so click can register if user selects with pointer
    window.setTimeout(() => {
      if (document.activeElement !== input) {
        setExpanded(false);
      }
    }, 100);
  });

  // Optional: open list on focus if there is input value
  input.addEventListener('focus', () => {
    if (input.value.trim() !== '') {
      filter();
    }
  });
})();
