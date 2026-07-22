# Image 2.0 最終提示詞

生成模式：Codex 內建 Image 2.0／`image_gen`。生成日期：2026-07-22。

## v1.1.0 寫實圖像重製

全站採 `photorealistic-natural` 與 `scientific-educational` 兩種用途。所有圖均禁止文字、標籤、浮水印、塑膠 CGI 質感與不符合殼斗科的複葉；物種圖不讓成熟果實與花出現在同一季節枝條上。

### 物種圖版共用模板

下列模板分別執行 46 次；每次以 `data/species.js` 中該分類群的 `habit`、`leaf`、`fruit`，以及所屬屬的 `tree`、`flower` 欄位替換大括號內容。

```text
Use case: scientific-educational
Asset type: individual species plate for a Taiwan Fagaceae field guide
Primary request: a scientifically plausible photorealistic natural-history specimen plate of {scientific name} ({Chinese name}), accurately portraying this exact Taiwan taxon rather than a generic oak
Scene/backdrop: clean warm-gray museum specimen background; no text or labels
Required subjects: a small full-tree field vignette showing {habit and tree}; an intact alternate-leaved twig; separate upper and underside leaf views showing exactly {leaf}; a flower specimen showing exactly {flower}; a mature attached fruit showing exactly {fruit}; an isolated nut and cupule section
Style/medium: high-resolution photorealistic botanical plate combining field and macro specimen photography; documentary true color; not illustration
Composition/framing: square plate, six clearly separated specimens, coherent relative scale, generous whitespace, nothing cropped
Lighting/mood: diffuse neutral daylight, crisp microdetail
Materials/textures: authentic venation and hairs, woody twig, tiny flowers, diagnostic cupule surface, matte nut shell, minor natural imperfections
Constraints: every stated diagnostic feature is mandatory; anatomically plausible attachment; alternate simple leaves; one species only; flowers and mature fruit as separate seasonal specimens; exact concentric-ring versus imbricate-scale cupule; no generic lobed oak leaf unless explicitly described; shrub taxa must show shrub habit; no fused, duplicated or oversized organs; no text, label, ruler, logo or watermark
Avoid: European or American park-oak substitution, horse chestnut, fantasy plant, watercolor, drawing, CGI, plastic leaves, decorative symmetry
```

四屬比較圖的最終版另經一次精準編修：只把第四欄不合臺灣常見形態的歐美式深裂櫟葉，替換為革質、長橢圓至披針形、上半部疏鋸齒的葉片，並保留環紋殼斗及其餘三欄不變。

## 森林主視覺

```text
Use case: scientific-educational
Asset type: wide hero image for a Taiwan Fagaceae digital field guide
Primary request: a scientifically plausible mature evergreen Fagaceae tree growing in a misty mid-elevation broadleaf forest in Taiwan, with its complete natural tree silhouette visible from roots to crown; in the foreground, one sharply focused leafy branch bears several realistic cupules and nuts
Scene/backdrop: layered subtropical Taiwan mountain forest, soft atmospheric depth, no buildings or people
Subject: one mature native broadleaf tree with rugged gray-brown bark, dense irregular crown, leathery alternate simple leaves; foreground branch with authentic acorn-like nuts partly enclosed by textured cupules
Style/medium: museum-quality natural-history illustration blended with photorealistic botanical detail, restrained watercolor and gouache texture
Composition/framing: 16:9 wide landscape, whole tree on the right half, calm negative space on the left for website title, foreground botanical branch along lower right, nothing cropped
Lighting/mood: humid early-morning forest light, quiet and observant
Color palette: deep fern green, moss, bark brown, mist gray, warm nut brown
Constraints: botanically plausible; leaves not compound; cupules visibly surround part of each nut; no text, no labels, no logos, no watermark
Avoid: fantasy plants, European park landscape, oversized fruit, showy flowers, symmetrical ornamental tree, duplicated branches, decorative border
```

## 四屬形態比較圖版

```text
Use case: scientific-educational
Asset type: landscape morphology plate for a Taiwan Fagaceae digital field guide
Primary request: a museum-quality comparative botanical plate showing the defining organs of Taiwan's four native Fagaceae genera without any written labels
Scene/backdrop: warm off-white herbarium paper, clean and flat, no frame
Subject: four clearly separated horizontal specimen groups. Group 1 Castanopsis: leathery alternate leaf, long slender male catkin, tiny apetalous female flowers, globose cupule densely covered in branching sharp spines and one to three nuts. Group 2 Fagus: deciduous serrated leaf with straight parallel lateral veins, small hanging male flower heads, four-valved soft-spined cupule containing two triangular three-ridged nuts. Group 3 Lithocarpus: leathery simple leaf, slender catkin, a single nut partly to almost fully enclosed by a cupule covered in overlapping triangular scales. Group 4 Quercus subgenus Cyclobalanopsis type: leathery leaf, pendant male catkin, tiny female flowers, ovoid nut in a hemispherical cupule whose scales fuse into six to eight visible concentric rings.
Style/medium: precise natural-history botanical illustration, realistic watercolor and gouache, fine ink contour only where necessary, scientifically educational
Composition/framing: wide landscape, four equal specimen zones with generous whitespace; each organ isolated, fully visible and not overlapping; include one small cutaway of nut and fleshy cotyledons; no cropping
Lighting/mood: neutral diffuse studio light
Color palette: accurate natural greens, warm nut browns, muted tan cupules, off-white paper
Constraints: anatomically plausible; flowers small, unshowy and without petals; leaves simple not compound; cupule and nut relationship clearly visible; exactly four specimen groups; no text, no letters, no numbers, no labels, no logos, no watermark
Avoid: fantasy flowers, colorful petals, generic fruit, pine cones, duplicated organs, decorative insects, specimen pins, torn paper, drop shadows
```
