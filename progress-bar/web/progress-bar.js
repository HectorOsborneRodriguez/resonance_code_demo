(function() {
  const el = document.getElementById("progress-bar-progress");
  const status = document.getElementById("progress-bar-status");
  let value = 0;
  const MAX = 100;
  window.__initComponent = function() {
    const timer = setInterval(() => {
      value = Math.min(MAX, value + 5);
      el.value = value;
      el.setAttribute("aria-valuenow", String(value));
      if (status) status.textContent = value + "%";
      if (value >= MAX) {
        el.setAttribute("aria-busy", "false");
        clearInterval(timer);
      }
    }, 700);
  };
})();
