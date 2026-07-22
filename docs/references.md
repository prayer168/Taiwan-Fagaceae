# 資料來源與授權

查核日期：2026-07-22

## 現行名錄與保育欄位

1. 農業部生物多樣性研究所，**TBN Taxon API 2.5.3**：https://www.tbn.org.tw/data/api/openapi/v25/taxon
   用途：科與屬的分類樹、原生性、臺灣特有性、國內紅皮書狀態、TBN UUID。網站內容除另有聲明外採政府資料開放授權條款第 1 版。
2. 鍾國芳、邵廣昭（2026），**臺灣物種名錄 TaiCOL**：https://taicol.tw/
   用途：臺灣物種名錄骨幹、現行命名背景與異名追查。TaiCOL 網站文字資料除另有註明外採 CC BY 4.0。

## 形態、檢索與分類沿革

3. 國立臺灣大學，**台灣植物資訊整合查詢系統：Fagaceae**：https://tai2.ntu.edu.tw/family/Fagaceae
   用途：殼斗科形態總述、植物誌文獻與舊版 60 個分類群統計口徑。
4. 呂勝由、楊智凱、吳維修等（2012），**《台灣橡實森林博覽會》**，行政院農業委員會林業試驗所林業叢刊第 242 號：https://ws.tfri.gov.tw/001/Upload/OldFile/files/242_extension.pdf
   用途：四屬檢索、約 46 個分類群的歷史口徑，以及葉、花、殼斗、堅果與分布的形態摘要。原書圖像未直接重製。
5. Liao, J.-C.（1996），**Flora of Taiwan, 2nd edition, vol. 2: Fagaceae**。由 Plants of Taiwan 電子書系統提供。
   用途：植物誌形態與分類背景。
6. 臺灣殼斗科植物分類研究（2018），臺灣博碩士論文知識加值系統：https://ndltd.ncl.edu.tw/cgi-bin/gs32/gsweb.cgi?o=dnclcdr&s=id%3D%22107NTNU5112047%22.&searchmode=basic
   用途：10 種 Castanopsis、1 種 Fagus、14 種 Lithocarpus、19 種 Quercus，共 44 種的研究口徑。

## 英文俗名

7. GBIF Species API：https://techdocs.gbif.org/en/openapi/v1/species
   用途：查核已有英文俗名的分類群。GBIF 未提供廣泛公認英文俗名者，本站使用描述性英文對照並在介面明確標示「非標準俗名」。

## 圖像

- `assets/images/fagaceae-forest-hero-v2.webp`：Image 2.0 教學重建圖。
- `assets/images/fagaceae-four-genera-plate-v2.webp`：Image 2.0 教學重建圖。
- `assets/images/species/*.webp`：46 張 Image 2.0 物種圖版。v1.2.0 先依林試所《台灣橡實森林博覽會》可直接對應的 44 個歷史分類群核對，再以 TBN 現行名錄及 iNaturalist「Fruits or Seeds」同種觀察照片補足現行口徑；菱果石櫟另採 TBN 同種觀察紀錄。
- iNaturalist API v1 與照片授權：<https://api.inaturalist.org/v2/docs/>；每張參考照片的觀察連結、攝影者、授權及原始圖片網址見 `docs/fruit-reference-manifest.json`。部分照片為 CC BY-NC，僅作形態查核與生成參考，網站未直接刊載原始照片。
- TBN 菱果石櫟果實觀察（陳慧珠，CC BY）：<https://plant.tbn.org.tw/occurrence/b01a21ae-e075-47b3-ba4d-056cbac87edf>。
- 所有 Image 2.0 圖均是依參考資料重建的合成圖，不是野外鑑定照片；最終提示詞與限制見 `docs/image-prompts.md`。
