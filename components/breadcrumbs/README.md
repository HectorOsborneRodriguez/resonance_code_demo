# Accordion Component

The **Accordion** component allows users to expand and collapse sections of content.  
It is designed to be **accessible**, following WAI-ARIA best practices, and fully keyboard navigable.

---

## Features

- Expand/collapse sections individually
- Keyboard support:
  - <kbd>Tab</kbd> to focus triggers
  - <kbd>Enter</kbd> or <kbd>Space</kbd> to toggle sections
  - <kbd>Arrow Up</kbd> / <kbd>Arrow Down</kbd> to navigate between headers
- Screen reader friendly using proper ARIA attributes:
  - `aria-expanded` to indicate state
  - `aria-controls` to reference the panel
  - `role="region"` for panels

---

## Files

- `index.html` — Demo page for the accordion component
- `style.css` — Styles for accordion headers and panels
- `accordion.js` — JavaScript to handle expand/collapse and keyboard interactions
