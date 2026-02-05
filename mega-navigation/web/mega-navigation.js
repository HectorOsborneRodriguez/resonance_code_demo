(function() {
  function closeAll(exceptId) {
    document.querySelectorAll(".mega__btn").forEach(btn => {
      const controls = btn.getAttribute("aria-controls");
      if (controls && controls !== exceptId) {
        btn.setAttribute("aria-expanded", "false");
        const submenu = document.getElementById(controls);
        if (submenu) submenu.hidden = true;
      }
    });
  }

  window.__initComponent = function() {
    document.querySelectorAll(".mega__btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const controls = btn.getAttribute("aria-controls");
        const submenu = controls ? document.getElementById(controls) : null;
        if (!submenu) return;
        const isOpen = btn.getAttribute("aria-expanded") === "true";
        if (isOpen) {
          btn.setAttribute("aria-expanded", "false");
          submenu.hidden = true;
        } else {
          closeAll(controls);
          btn.setAttribute("aria-expanded", "true");
          submenu.hidden = false;
        }
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll(null);
    });
  };
})();
