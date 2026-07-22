const STORAGE_KEY = "taiwan-fagaceae-progress";

export function initializeProgress(navigation) {
  const label = document.querySelector("#progress-label");
  navigation.subscribe((activeIndex, total) => {
    if (label) label.textContent = `學習進度：${activeIndex + 1} / ${total}`;
    try {
      localStorage.setItem(STORAGE_KEY, String(activeIndex));
    } catch {
      // 教材仍可在停用本機儲存的瀏覽器中使用。
    }
  });
}

