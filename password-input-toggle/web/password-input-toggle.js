(function() {
  const input = document.getElementById("password-input-toggle-password");
  const btn = document.getElementById("password-input-toggle-toggle");
  const live = document.getElementById("password-input-toggle-live");

  function setState(visible) {
    input.type = visible ? "text" : "password";
    btn.setAttribute("aria-pressed", visible ? "true" : "false");
    btn.setAttribute("aria-label", visible ? "Hide password" : "Show password");
    btn.textContent = visible ? "Hide" : "Show";
    if (live) live.textContent = visible ? "Password is visible." : "Password is hidden.";
  }

  window.__initComponent = function() {
    btn?.addEventListener("click", () => {
      const pressed = btn.getAttribute("aria-pressed") === "true";
      setState(!pressed);
    });
  };
})();
