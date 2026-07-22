import { species, genusProfiles, introducedSpecies } from "../data/species.js";

const grid = document.querySelector("#species-grid");
const search = document.querySelector("#search");
const sort = document.querySelector("#sort");
const count = document.querySelector("#result-count");
const empty = document.querySelector("#no-results");
const dialog = document.querySelector("#species-dialog");
const dialogContent = document.querySelector("#dialog-content");
const closeButton = document.querySelector(".dialog-close");
const filters = [...document.querySelectorAll("[data-genus]")];
const introducedList = document.querySelector("#introduced-list");

const riskOrder = { CR: 0, EN: 1, VU: 2, NT: 3, DD: 4, LC: 5, NE: 6 };
const riskLabel = {
  CR: "極危 CR", EN: "瀕危 EN", VU: "易危 VU", NT: "近危 NT",
  DD: "資料缺乏 DD", LC: "暫無危機 LC", NE: "尚未評估"
};
const ringCupOaks = new Set([
  "Quercus championii", "Quercus gilva", "Quercus glauca", "Quercus globosa",
  "Quercus hypophaea", "Quercus longinux", "Quercus morii", "Quercus myrsinifolia",
  "Quercus pachyloma", "Quercus salicina", "Quercus sessilifolia", "Quercus stenophylloides"
]);

let selectedGenus = "all";
let lastTrigger = null;

function hash(text) {
  return [...text].reduce((value, character) => ((value << 5) - value + character.charCodeAt(0)) | 0, 0);
}

function escapeHtml(value = "") {
  return value.replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function speciesImagePath(item) {
  const filename = item.sci.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `./assets/images/species/${filename}.webp`;
}

function speciesImage(item, loading = "lazy") {
  const alt = `Image 2.0 寫實植物學重建圖：${item.zh}（${item.sci}）的樹形、枝葉、葉片正反面、花序、殼斗與堅果。`;
  return `<img src="${speciesImagePath(item)}" width="960" height="960" loading="${loading}" decoding="async" alt="${escapeHtml(alt)}">`;
}

function cupuleType(item) {
  if (item.genus === "Fagus") return "valved";
  if (item.genus === "Castanopsis") return item.sci === "Castanopsis uraiana" ? "scaled" : "spiny";
  if (item.genus === "Lithocarpus") return "scaled";
  return ringCupOaks.has(item.sci) ? "ringed" : "scaled";
}

function isSerrated(item) {
  return /鋸齒|刺齒|粗齒|芒尖|齒端/.test(item.leaf);
}

function leafPath(item, x = 70, y = 54, scale = 1) {
  const narrow = /狹|披針|柳葉/.test(item.leaf);
  const broad = /大|卵|倒卵/.test(item.leaf) && !narrow;
  const halfWidth = (narrow ? 20 : broad ? 35 : 28) * scale;
  const length = (narrow ? 92 : 78) * scale;
  const startX = x - length / 2;
  const endX = x + length / 2;
  const teeth = isSerrated(item);
  if (!teeth) {
    return `M ${startX} ${y} Q ${x - 15 * scale} ${y - halfWidth} ${endX} ${y - 2} Q ${x - 8 * scale} ${y + halfWidth} ${startX} ${y} Z`;
  }
  const points = [[startX, y]];
  const steps = 11;
  for (let index = 1; index <= steps; index += 1) {
    const t = index / steps;
    const centerX = startX + length * t;
    const width = Math.sin(Math.PI * t) * halfWidth;
    const tooth = index % 2 ? 5 * scale : 0;
    points.push([centerX, y - width - tooth]);
  }
  for (let index = steps - 1; index >= 1; index -= 1) {
    const t = index / steps;
    const centerX = startX + length * t;
    const width = Math.sin(Math.PI * t) * halfWidth;
    const tooth = index % 2 ? 5 * scale : 0;
    points.push([centerX, y + width + tooth]);
  }
  return `M ${points.map(([px, py]) => `${px} ${py}`).join(" L ")} Z`;
}

function cupuleSvg(item, x = 172, y = 113, scale = 1) {
  const type = cupuleType(item);
  const nutHeight = (/圓|球/.test(item.fruit) ? 44 : /狹|錐|子彈/.test(item.fruit) ? 62 : 52) * scale;
  const nutWidth = (/圓|球/.test(item.fruit) ? 38 : 30) * scale;
  const nut = `<path d="M ${x} ${y - nutHeight} C ${x - nutWidth} ${y - nutHeight * .72}, ${x - nutWidth * .7} ${y - 8 * scale}, ${x} ${y} C ${x + nutWidth * .7} ${y - 8 * scale}, ${x + nutWidth} ${y - nutHeight * .72}, ${x} ${y - nutHeight} Z" fill="#9a5e31" stroke="#5e3a23" stroke-width="2"/>`;
  if (type === "ringed") {
    return `${nut}<path d="M ${x - 37 * scale} ${y - 25 * scale} Q ${x} ${y - 2 * scale} ${x + 37 * scale} ${y - 25 * scale} L ${x + 31 * scale} ${y + 8 * scale} Q ${x} ${y + 25 * scale} ${x - 31 * scale} ${y + 8 * scale} Z" fill="#a88a54" stroke="#5e5137" stroke-width="2"/>${[0,1,2,3].map(i => `<path d="M ${x - (31 - i * 3) * scale} ${y - (15 - i * 7) * scale} Q ${x} ${y + (3 + i * 4) * scale} ${x + (31 - i * 3) * scale} ${y - (15 - i * 7) * scale}" fill="none" stroke="#67583b" stroke-width="2"/>`).join("")}`;
  }
  if (type === "spiny") {
    const spikes = Array.from({ length: 20 }, (_, index) => {
      const angle = (Math.PI * 2 * index) / 20;
      const x1 = x + Math.cos(angle) * 30 * scale;
      const y1 = y - 10 * scale + Math.sin(angle) * 27 * scale;
      const x2 = x + Math.cos(angle) * 48 * scale;
      const y2 = y - 10 * scale + Math.sin(angle) * 44 * scale;
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#6e5836" stroke-width="2"/>`;
    }).join("");
    return `${nut}<circle cx="${x}" cy="${y - 10 * scale}" r="31" fill="#9b7c49" stroke="#5e5137" stroke-width="2"/>${spikes}`;
  }
  if (type === "valved") {
    return `${nut}<path d="M ${x - 38 * scale} ${y - 17 * scale} Q ${x - 20 * scale} ${y - 54 * scale} ${x} ${y - 20 * scale} Q ${x + 20 * scale} ${y - 54 * scale} ${x + 38 * scale} ${y - 17 * scale} Q ${x} ${y + 27 * scale} ${x - 38 * scale} ${y - 17 * scale} Z" fill="#92754a" stroke="#5e5137" stroke-width="2"/><path d="M ${x} ${y - 22 * scale} L ${x} ${y + 15 * scale}" stroke="#5e5137" stroke-width="2"/>`;
  }
  return `${nut}<path d="M ${x - 38 * scale} ${y - 17 * scale} Q ${x} ${y + 25 * scale} ${x + 38 * scale} ${y - 17 * scale} L ${x + 30 * scale} ${y + 11 * scale} Q ${x} ${y + 31 * scale} ${x - 30 * scale} ${y + 11 * scale} Z" fill="#9d8151" stroke="#5e5137" stroke-width="2"/>${Array.from({ length: 8 }, (_, index) => `<path d="M ${x - 32 * scale + index * 9 * scale} ${y + 7 * scale} l ${5 * scale} ${-14 * scale} l ${5 * scale} ${14 * scale}" fill="none" stroke="#69583a" stroke-width="1.5"/>`).join("")}`;
}

function botanicalSvg(item, detailed = false) {
  const seed = Math.abs(hash(item.sci));
  const leafColor = item.habit.includes("落葉") ? "#6f8b47" : ["#315b45", "#3e6a4c", "#486e52"][seed % 3];
  const title = detailed ? `<text x="18" y="24" fill="#51645c" font-size="10" letter-spacing="2">MORPHOLOGY GUIDE</text>` : "";
  const genusTag = detailed ? "" : `<circle cx="18" cy="18" r="5" fill="#d6aa5f"/><text x="28" y="21" fill="#314c43" font-size="10">${escapeHtml(item.genus)}</text>`;
  return `<svg viewBox="0 0 240 160" role="img" aria-label="${escapeHtml(item.zh)}形態導覽示意">
    <rect width="240" height="160" fill="#e9e4d5"/>${title}
    <path d="M 18 137 C 75 114, 119 96, 202 55" fill="none" stroke="#71503a" stroke-width="6" stroke-linecap="round"/>
    <g transform="rotate(-17 70 54)"><path d="${leafPath(item, 70, 54, .92)}" fill="${leafColor}" stroke="#244737" stroke-width="1.5"/><path d="M 30 54 L 112 52" stroke="#d5c894" stroke-width="1.5"/></g>
    <g transform="translate(34 58) rotate(18 70 54) scale(.74)"><path d="${leafPath(item)}" fill="${leafColor}" stroke="#244737" stroke-width="1.5"/><path d="M 30 54 L 112 52" stroke="#d5c894" stroke-width="1.5"/></g>
    ${cupuleSvg(item, 181, 118, .72)}
    ${genusTag}
  </svg>`;
}

function treeSvg(item) {
  const deciduous = item.habit.includes("落葉");
  const shrub = item.habit.includes("灌木");
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M60 108 C58 88 62 69 58 50" stroke="#684a34" stroke-width="9" fill="none"/><path d="M59 72 L38 55 M61 67 L82 46" stroke="#684a34" stroke-width="5"/><path d="M${shrub ? 30 : 18} 62 C12 38 29 14 55 22 C70 7 103 23 99 49 C112 72 86 86 63 77 C40 91 17 80 ${shrub ? 30 : 18} 62Z" fill="${deciduous ? "#779353" : "#315b45"}" stroke="#244737" stroke-width="2"/><path d="M31 98 Q60 89 91 98" fill="none" stroke="#8b7655" stroke-width="2"/></svg>`;
}

function leafSvg(item) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><g transform="rotate(-28 60 60)"><path d="${leafPath(item, 60, 59, .95)}" fill="#3f6c50" stroke="#244737" stroke-width="2"/><path d="M18 59 L105 57" stroke="#d9cc94" stroke-width="2"/></g></svg>`;
}

function fruitSvg(item) {
  return `<svg viewBox="0 0 120 120" aria-hidden="true">${cupuleSvg(item, 61, 85, .82)}</svg>`;
}

function flowerSvg(item) {
  const head = item.genus === "Fagus";
  return `<svg viewBox="0 0 120 120" aria-hidden="true"><path d="M30 12 Q50 55 45 108" fill="none" stroke="#65724d" stroke-width="3"/>${Array.from({ length: head ? 5 : 14 }, (_, index) => { const x = head ? 25 + index * 13 : 30 + Math.sin(index * 1.7) * 10; const y = head ? 50 + Math.sin(index) * 10 : 23 + index * 5; return `<circle cx="${x}" cy="${y}" r="${head ? 6 : 3}" fill="#c9a95b" stroke="#6a633e" stroke-width="1"/>`; }).join("")}<path d="M73 99 Q76 56 92 32" fill="none" stroke="#65724d" stroke-width="3"/><g fill="#8aa05c" stroke="#53643f">${[0,1,2].map(i => `<path d="M ${76 + i * 10} ${82 - i * 18} q 9 -11 16 1 q -7 9 -16 -1Z"/>`).join("")}</g></svg>`;
}

function visibleSpecies() {
  const query = search.value.trim().toLocaleLowerCase("zh-Hant-TW");
  const filtered = species.filter((item) => {
    const matchesGenus = selectedGenus === "all" || item.genus === selectedGenus;
    const haystack = `${item.zh} ${item.sci} ${item.en} ${item.genusZh} ${item.alias || ""}`.toLocaleLowerCase("zh-Hant-TW");
    return matchesGenus && (!query || haystack.includes(query));
  });
  return filtered.sort((a, b) => {
    if (sort.value === "zh") return a.zh.localeCompare(b.zh, "zh-Hant");
    if (sort.value === "risk") return riskOrder[a.red] - riskOrder[b.red] || a.sci.localeCompare(b.sci);
    return a.genus.localeCompare(b.genus) || a.sci.localeCompare(b.sci);
  });
}

function render() {
  const items = visibleSpecies();
  count.textContent = String(items.length);
  empty.hidden = items.length !== 0;
  grid.innerHTML = items.map((item) => `<button class="species-card" type="button" data-species="${escapeHtml(item.sci)}" aria-label="查看${escapeHtml(item.zh)}詳情">
    <span class="card-visual">${speciesImage(item)}</span>
    <span class="card-body">
      <span class="card-meta"><span>${escapeHtml(item.genusZh)}${item.endemic ? "・臺灣特有" : ""}</span><span class="risk" data-risk="${item.red}">${riskLabel[item.red]}</span></span>
      <h3>${escapeHtml(item.zh)}</h3>
      <span class="scientific">${escapeHtml(item.sci)}</span>
      <span class="english">${escapeHtml(item.en)}</span>
      <span class="card-action">查看完整形態 →</span>
    </span>
  </button>`).join("");
}

function showDetails(item, trigger) {
  lastTrigger = trigger;
  const profile = genusProfiles[item.genus];
  const englishNote = item.verified ? "英名來源：GBIF 英文俗名資料" : "描述性英文對照，非廣泛公認的標準俗名";
  dialogContent.innerHTML = `<div class="dialog-hero">
    <figure class="dialog-visual">${speciesImage(item, "eager")}<figcaption>Image 2.0 寫實植物學重建圖・請以文字特徵與實體標本交叉鑑定</figcaption></figure>
    <div class="dialog-title">
      <p class="kicker">${escapeHtml(item.genusZh)}・FAGACEAE</p>
      <h2 id="dialog-title">${escapeHtml(item.zh)}</h2>
      <p class="scientific">${escapeHtml(item.sci)}</p>
      <p class="english">${escapeHtml(item.en)}<br><small>${escapeHtml(englishNote)}</small></p>
      <div class="dialog-badges"><span>${escapeHtml(item.habit)}</span><span>${riskLabel[item.red]}</span>${item.endemic ? "<span>臺灣特有</span>" : ""}</div>
    </div>
  </div>
  <div class="organ-grid">
    <article class="organ"><div><h3>完整樹形</h3><p>${escapeHtml(item.habit)}。${escapeHtml(profile.tree)}</p></div></article>
    <article class="organ"><div><h3>葉片形態</h3><p>${escapeHtml(item.leaf)}</p></div></article>
    <article class="organ"><div><h3>殼斗與種子</h3><p>${escapeHtml(item.fruit)}成熟種子通常無胚乳，具有兩枚肉質子葉。</p></div></article>
    <article class="organ"><div><h3>花與花序</h3><p>${escapeHtml(profile.flower)}</p></div></article>
  </div>
  <div class="detail-foot">
    <div><p><strong>科別：</strong>殼斗科 Fagaceae</p><p><strong>屬名：</strong>${escapeHtml(item.genusZh)} <i>${escapeHtml(item.genus)}</i></p>${item.alias ? `<p><strong>異名／舊處理：</strong>${escapeHtml(item.alias)}</p>` : ""}</div>
    <div><p>圖版由 Image 2.0 依本站查核特徵重建，並非野外照片，也不按比例；文字摘要依植物誌與林試所資料整理。</p><p><a href="https://www.tbn.org.tw/api/v25/taxon?uuid=${item.uuid}" target="_blank" rel="noreferrer">開啟 TBN 原始分類資料 ↗</a></p></div>
  </div>`;
  dialog.showModal();
  closeButton.focus();
}

filters.forEach((button) => button.addEventListener("click", () => {
  selectedGenus = button.dataset.genus;
  filters.forEach((filter) => filter.classList.toggle("is-active", filter === button));
  render();
}));
search.addEventListener("input", render);
sort.addEventListener("change", render);
grid.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-species]");
  if (!trigger) return;
  const item = species.find((entry) => entry.sci === trigger.dataset.species);
  if (item) showDetails(item, trigger);
});
closeButton.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
  if (outside) dialog.close();
});
dialog.addEventListener("close", () => lastTrigger?.focus());

render();

introducedList.innerHTML = introducedSpecies.map((item) => `<a class="introduced-item" href="https://www.tbn.org.tw/api/v25/taxon?uuid=${item.uuid}" target="_blank" rel="noreferrer">
  <span><small>${escapeHtml(item.genusZh)}・${escapeHtml(item.status)}</small><strong>${escapeHtml(item.zh)}</strong></span>
  <span><i>${escapeHtml(item.sci)}</i><small>${escapeHtml(item.en)}</small></span>
  <b aria-hidden="true">↗</b>
</a>`).join("");
