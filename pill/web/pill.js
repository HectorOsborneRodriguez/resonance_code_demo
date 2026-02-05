(function() {
  const live = document.getElementById("pill-live");
  window.__initComponent = function() {
    document.querySelectorAll(".pill").forEach(btn => {
      btn.addEventListener("click", () => {
        const label = btn.textContent.trim();
        btn.remove();
        if (live) live.textContent = `"${label}" filter removed.`;
      });
    });
  };
})();
