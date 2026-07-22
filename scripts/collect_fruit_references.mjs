import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { species } from "../data/species.js";

const root = path.resolve(import.meta.dirname, "..");
const downloadRoot = path.join(root, ".research-fruit-refs");
const manifestPath = path.join(root, "docs", "fruit-reference-manifest.json");
const acceptedLicenses = new Set(["cc0", "cc-by", "cc-by-sa", "cc-by-nc", "cc-by-nc-sa"]);

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function getJson(url) {
  const response = await fetch(url, { headers: { "User-Agent": "Taiwan-Fagaceae-atlas/1.2 research" } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response.json();
}

async function exactTaxon(scientificName) {
  const url = new URL("https://api.inaturalist.org/v1/taxa");
  url.searchParams.set("q", scientificName);
  url.searchParams.set("per_page", "30");
  const data = await getJson(url);
  return data.results.find((taxon) => taxon.name.toLowerCase() === scientificName.toLowerCase()) ?? null;
}

async function fruitingObservations(taxonId, placeId) {
  const url = new URL("https://api.inaturalist.org/v1/observations");
  url.searchParams.set("taxon_id", String(taxonId));
  url.searchParams.set("term_id", "12");
  url.searchParams.set("term_value_id", "14");
  url.searchParams.set("quality_grade", "research");
  url.searchParams.set("photos", "true");
  url.searchParams.set("per_page", "200");
  url.searchParams.set("order_by", "votes");
  if (placeId) url.searchParams.set("place_id", String(placeId));
  return getJson(url);
}

function licensedCandidates(observations) {
  const candidates = [];
  for (const observation of observations) {
    for (const photo of observation.photos ?? []) {
      if (!acceptedLicenses.has(photo.license_code)) continue;
      candidates.push({
        observationId: observation.id,
        observationUrl: `https://www.inaturalist.org/observations/${observation.id}`,
        observedOn: observation.observed_on,
        placeGuess: observation.place_guess,
        photoId: photo.id,
        imageUrl: photo.url.replace(/\/square\./, "/large."),
        license: photo.license_code,
        attribution: photo.attribution,
      });
    }
  }
  return candidates;
}

async function downloadCandidate(candidate, directory, index) {
  const extension = path.extname(new URL(candidate.imageUrl).pathname) || ".jpg";
  const filename = `${String(index + 1).padStart(2, "0")}-obs-${candidate.observationId}-photo-${candidate.photoId}${extension}`;
  const destination = path.join(directory, filename);
  const response = await fetch(candidate.imageUrl, { headers: { "User-Agent": "Taiwan-Fagaceae-atlas/1.2 research" } });
  if (!response.ok) throw new Error(`${response.status} ${candidate.imageUrl}`);
  await writeFile(destination, Buffer.from(await response.arrayBuffer()));
  return destination;
}

await mkdir(downloadRoot, { recursive: true });
const manifest = [];

for (const [index, item] of species.entries()) {
  const taxon = await exactTaxon(item.sci);
  if (!taxon) {
    manifest.push({ scientificName: item.sci, chineseName: item.zh, status: "no-exact-inaturalist-taxon", references: [] });
    continue;
  }

  let scope = "Taiwan";
  let observations = await fruitingObservations(taxon.id, 7887);
  let candidates = licensedCandidates(observations.results);
  if (candidates.length === 0) {
    scope = "global";
    observations = await fruitingObservations(taxon.id, null);
    candidates = licensedCandidates(observations.results);
  }

  const selected = candidates.slice(0, 4);
  const directory = path.join(downloadRoot, slugify(item.sci));
  await mkdir(directory, { recursive: true });
  const downloaded = [];
  for (const [candidateIndex, candidate] of selected.entries()) {
    const localPath = await downloadCandidate(candidate, directory, candidateIndex);
    downloaded.push({ ...candidate, localPath: path.relative(root, localPath).replaceAll("\\", "/") });
  }

  manifest.push({
    scientificName: item.sci,
    chineseName: item.zh,
    inaturalistTaxonId: taxon.id,
    inaturalistTaxonUrl: `https://www.inaturalist.org/taxa/${taxon.id}`,
    scope,
    annotatedObservationCount: observations.total_results,
    status: downloaded.length ? "references-downloaded" : "no-licensed-fruiting-reference",
    references: downloaded,
  });
  process.stdout.write(`[${index + 1}/${species.length}] ${item.sci}: ${downloaded.length} ${scope}\n`);
  await wait(120);
}

await writeFile(manifestPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: "iNaturalist API v1", annotation: "Flowers and Fruits = Fruits or Seeds (term 12, value 14)", taxa: manifest }, null, 2)}\n`);

const covered = manifest.filter((item) => item.references.length > 0).length;
console.log(JSON.stringify({ total: manifest.length, covered, missing: manifest.filter((item) => item.references.length === 0).map((item) => item.scientificName) }));
