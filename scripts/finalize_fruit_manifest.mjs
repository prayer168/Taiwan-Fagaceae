import fs from "node:fs";

const manifestPath = new URL("../docs/fruit-reference-manifest.json", import.meta.url);
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

manifest.version = "1.2.0";
manifest.scope = "46 Taiwan native lowest-rank Fagaceae taxa used by this atlas";
manifest.source = "iNaturalist API v1 supplementary same-taxon fruit/seed photo references";
manifest.authoritativeMorphologyReference = {
  title: "台灣橡實森林博覽會",
  publisher: "行政院農業委員會林業試驗所",
  year: 2012,
  url: "https://ws.tfri.gov.tw/001/Upload/OldFile/files/242_extension.pdf",
  use: "Direct same-taxon plate reference for 44 historical taxa; current TBN taxon pages and exact-taxon observations cover the difference in the atlas's 46-taxon current scope."
};
manifest.supplementarySources = [
  {
    title: "iNaturalist API and observations",
    apiDocs: "https://api.inaturalist.org/v2/docs/",
    annotationHelp: "https://help.inaturalist.org/en/support/solutions/articles/151000170738-how-to-use-inaturalist-search-urls",
    note: "Exact-taxon, research-grade observations annotated Fruits or Seeds; photos retained only as research inputs and are not republished by the site."
  },
  {
    title: "TBN 菱果石櫟果實觀察",
    observationUrl: "https://plant.tbn.org.tw/occurrence/b01a21ae-e075-47b3-ba4d-056cbac87edf",
    taxonUrl: "https://plant.tbn.org.tw/taxa/ef3d59e6-8704-4bf2-bfa5-3efcd4edd492",
    photographer: "陳慧珠",
    license: "CC BY"
  }
];
manifest.workflow = {
  generatedWith: "OpenAI Image 2.0",
  method: "reference-based edit of the prior species plate; fruit, seed and cupule regions only",
  acceptanceCriteria: [
    "cupule coverage ratio",
    "cupule surface rings, scales, tubercles or spines",
    "nut count per cupule",
    "nut outline, apex and basal scar",
    "fruit attachment and infructescence arrangement"
  ],
  disclosure: "Outputs are reference-based AI reconstructions, not photographs and not sole identification evidence."
};

for (const taxon of manifest.taxa) {
  taxon.morphologyVerification = "TFRI 2012 historical plate where directly corresponding; current TBN taxonomy and exact-taxon observation photos where revised or split";
}

const synbalanos = manifest.taxa.find((taxon) => taxon.scientificName === "Lithocarpus synbalanos");
if (!synbalanos) throw new Error("Lithocarpus synbalanos is missing from the manifest");

const tbnImageUrls = [
  "https://plant.tbn.org.tw/sites/dpplant/files/occurrence/photo/2020/11/file-2052082-z39jvdw3.jpeg",
  "https://plant.tbn.org.tw/sites/dpplant/files/occurrence/photo/2020/11/file-2052082-au6x2orm.jpeg",
  "https://plant.tbn.org.tw/sites/dpplant/files/occurrence/photo/2020/11/file-2052082-fn6ywqp5.jpeg",
  "https://plant.tbn.org.tw/sites/dpplant/files/occurrence/photo/2020/11/file-2052082-wuwibv61.jpeg"
];
synbalanos.inaturalistStatus = synbalanos.status;
synbalanos.status = "references-downloaded-tbn";
synbalanos.tbnTaxonUrl = "https://plant.tbn.org.tw/taxa/ef3d59e6-8704-4bf2-bfa5-3efcd4edd492";
synbalanos.references = tbnImageUrls.map((imageUrl, index) => ({
  source: "TBN",
  occurrenceId: "b01a21ae-e075-47b3-ba4d-056cbac87edf",
  observationUrl: "https://plant.tbn.org.tw/occurrence/b01a21ae-e075-47b3-ba4d-056cbac87edf",
  imageUrl,
  license: "CC BY",
  attribution: "陳慧珠",
  localPath: `.research-fruit-refs/lithocarpus-synbalanos/tbn-2052082-${String(index + 1).padStart(2, "0")}.jpeg`
}));

manifest.coverage = {
  taxa: manifest.taxa.length,
  officialMonographDirectTaxonPlates: 44,
  currentTaxonomyScopeVerified: manifest.taxa.length,
  taxaWithSupplementaryLicensedObservationPhotos: manifest.taxa.filter((taxon) => taxon.references.length > 0).length,
  supplementaryPhotoCount: manifest.taxa.reduce((sum, taxon) => sum + taxon.references.length, 0)
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
