const input = document.getElementById('autocomplete');
const listbox = document.getElementById('autocompleteList');
const allOptions = Array.from(listbox.querySelectorAll('[role="option"]:not([aria-disabled])'));
const noResultsOption = document.getElementById('no-results');
const status = document.getElementById('autocompleteStatus');

let filteredOptions = [];
let activeIndex = -1;

function openListbox() {
  listbox.hidden = false;
  input.setAttribute('aria-expanded', 'true');
}

function closeListbox() {
  listbox.hidden = true;
  input.setAttribute('aria-expanded', 'false');
  input.removeAttribute('aria-activedescendant');
  activeIndex = -1;
  updateSelection();
}

function updateSelection() {
  filteredOptions.forEach((option, index) => {
    option.setAttribute('aria-selected', index === activeIndex ? 'true' : 'false');
  });

  if (activeIndex >= 0) {
    input.setAttribute('aria-activedescendant', filteredOptions[activeIndex].id);
  }
}

function selectOption(index) {
  input.value = filteredOptions[index].textContent;
  closeListbox();
}

function filterOptions() {
  const query = input.value.toLowerCase().trim();
  filteredOptions = [];

  allOptions.forEach(option => {
    const match = option.textContent.toLowerCase().includes(query);
    option.hidden = !match;
    if (match) filteredOptions.push(option);
  });

  // Handle no results
  if (filteredOptions.length === 0) {
    noResultsOption.hidden = false;
    status.textContent = 'No results found.';
  } else {
    noResultsOption.hidden = true;
    status.textContent = `${filteredOptions.length} results available.`;
  }

  activeIndex = -1;
  input.removeAttribute('aria-activedescendant');
  openListbox();
}

input.addEventListener('input', filterOptions);

input.addEventListener('keydown', e => {
  if (listbox.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) openListbox();
  if (!filteredOptions.length) return;

  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      activeIndex = (activeIndex + 1) % filteredOptions.length;
      updateSelection();
      break;
    case 'ArrowUp':
      e.preventDefault();
      activeIndex = (activeIndex - 1 + filteredOptions.length) % filteredOptions.length;
      updateSelection();
      break;
    case 'Enter':
      if (activeIndex >= 0) {
        e.preventDefault();
        selectOption(activeIndex);
      }
      break;
    case 'Escape':
      closeListbox();
      break;
  }
});

allOptions.forEach(option => {
  option.addEventListener('mousedown', e => {
    e.preventDefault();
    const index = filteredOptions.indexOf(option);
    if (index >= 0) selectOption(index);
  });
});

input.addEventListener('blur', () => setTimeout(closeListbox, 100));