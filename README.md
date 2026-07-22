# 果殼之島｜臺灣殼斗科圖鑑

以臺灣原生殼斗科植物為主題的互動圖鑑網站。本站採 2026-07-22 TBN 分類樹的「原生最低可用分類群」口徑，共收錄 46 筆：栲屬 10、水青岡屬 1、石櫟屬 15、櫟屬 20。

## 網站特色

- 46 個分類群的中文名、學名、英文對照、科別與屬名。
- 依中文名、學名、英文名與異名搜尋。
- 依四屬篩選，並可依分類、中文名或受脅程度排序。
- 每筆包含樹形、葉片、花序、殼斗、種子與辨識特徵。
- 明確區分公認英文俗名與描述性英文對照。
- 標示臺灣特有性及 TBN 國內紅皮書狀態。
- 說明 44、46、60 等不同統計口徑的來源。
- 支援鍵盤操作、手機和平板版面及降低動態偏好。

## 圖像聲明

主視覺、四屬比較圖及 46 個原生分類群的獨立植物學圖版均由 Image 2.0 產生。v1.2.0 先以林業試驗所《台灣橡實森林博覽會》可直接對應的 44 個歷史分類群核對殼斗與堅果，再用 TBN 現行分類頁，以及 iNaturalist／TBN 的同種授權照片補足現行 46 筆口徑與實物外觀，並重建全部圖版。網站明確標示為「寫實植物學重建圖」；它們不是原始照片、不按比例，也不可作為單一鑑定證據。

生成提示詞記錄於 [`docs/image-prompts.md`](docs/image-prompts.md)，逐筆照片來源、攝影者與授權記錄於 [`docs/fruit-reference-manifest.json`](docs/fruit-reference-manifest.json)。

## 資料口徑

- 現行分類、原生性、特有性與國內紅皮書：TBN Taxon API 2.5.3。
- 名錄骨幹與命名背景：TaiCOL。
- 形態與分類沿革：臺大 Plants of Taiwan、《Flora of Taiwan》及林業試驗所《台灣橡實森林博覽會》。
- 資料查核日：2026-07-22。

詳細來源與授權見 [`docs/references.md`](docs/references.md)。

## 本機啟動

```bash
npm install
npm run dev
```

正式建置：

```bash
npm run build
```

## 專案結構

- `index.html`：網站語意結構
- `data/species.js`：46 筆物種與形態資料
- `js/app.js`：搜尋、篩選、排序、圖像與詳情對話框
- `css/`：版面、動畫及響應式樣式
- `assets/images/`：Image 2.0 生成的專案圖像
- `docs/`：研究來源、圖像提示詞與測試報告

## 發布狀態

- 目前版本：v1.2.0
- 線上圖鑑：https://prayer168.github.io/Taiwan-Fagaceae/
- GitHub repository：https://github.com/prayer168/Taiwan-Fagaceae

## 授權

本站程式、整理內容與專案圖像目前保留所有權利；引用資料仍適用原資料提供者的授權及使用條款。TaiCOL 文字資料依 CC BY 4.0 條款引用，TBN 與其他來源依各自條款使用。
