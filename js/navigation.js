export function initializeNavigation() {
  const tabs = [...document.querySelectorAll("[role='tab']")];
  const panels = [...document.querySelectorAll("[role='tabpanel']")];
  const previousButtons = [...document.querySelectorAll("[data-previous]")];
  const nextButtons = [...document.querySelectorAll("[data-next]")];
  let activeIndex = 0;
  const subscribers = new Set();

  function showPanel(index, moveFocus = false) {
    activeIndex = Math.max(0, Math.min(index, tabs.length - 1));
    tabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === activeIndex;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;
    });
    panels.forEach((panel, panelIndex) => {
      const isActive = panelIndex === activeIndex;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
    previousButtons.forEach((button) => { button.disabled = activeIndex === 0; });
    nextButtons.forEach((button) => { button.disabled = activeIndex === tabs.length - 1; });
    if (moveFocus) tabs[activeIndex].focus();
    subscribers.forEach((subscriber) => subscriber(activeIndex, tabs.length));
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => showPanel(index));
    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") showPanel((index + 1) % tabs.length, true);
      if (event.key === "ArrowLeft") showPanel((index - 1 + tabs.length) % tabs.length, true);
    });
  });
  previousButtons.forEach((button) => button.addEventListener("click", () => showPanel(activeIndex - 1)));
  nextButtons.forEach((button) => button.addEventListener("click", () => showPanel(activeIndex + 1)));
  showPanel(0);

  return {
    subscribe(callback) {
      subscribers.add(callback);
      callback(activeIndex, tabs.length);
    },
  };
}

