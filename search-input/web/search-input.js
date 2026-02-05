(function() {
  const form = document.querySelector("form.search");
  const input = document.getElementById("search-input-q");
  const clearBtn = document.querySelector(".search__clear");
  const live = document.getElementById("search-input-live");

  window.__initComponent = function() {
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (live) live.textContent = `Search submitted for "${input?.value || ""}".`;
    });
    clearBtn?.addEventListener("click", () => {
      if (!input) return;
      input.value = "";
      input.focus();
      if (live) live.textContent = "Search cleared.";
    });
  };
})();
