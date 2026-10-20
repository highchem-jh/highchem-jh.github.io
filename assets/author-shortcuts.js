/* A browser preference for navigation, never an authorization mechanism. */
(() => {
  const key = "highchem-author-shortcuts-v1";
  const panels = document.querySelectorAll("[data-author-shortcuts]");
  const checkbox = document.querySelector("#author-shortcuts-toggle");
  const status = document.querySelector("#author-shortcuts-status");
  function enabled() {
    try { return localStorage.getItem(key) === "enabled"; } catch { return false; }
  }
  function render() {
    const show = enabled();
    panels.forEach(panel => { panel.hidden = !show; });
    if (checkbox) checkbox.checked = show;
  }
  function change(show) {
    try {
      if (show) localStorage.setItem(key,"enabled");
      else localStorage.removeItem(key);
      if (status) status.textContent = show
        ? "Author shortcuts will appear on the homepage in this browser."
        : "Author shortcuts are hidden on the homepage.";
    } catch {
      if (status) status.textContent = "This browser cannot save the preference. Bookmark this editor instead.";
    }
    render();
  }
  checkbox?.addEventListener("change", () => change(checkbox.checked));
  document.querySelectorAll("[data-hide-author-shortcuts]").forEach(button => {
    button.addEventListener("click", () => {
      change(false);
      document.querySelector("#main-content")?.focus();
    });
  });
  window.addEventListener("storage", event => { if(event.key === key) render(); });
  render();
})();
