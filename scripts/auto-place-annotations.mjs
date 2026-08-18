import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";
import { Box3, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const publicUrl = new URL("../public/", import.meta.url);
const cellsUrl = new URL("../src/data/cells.ts", import.meta.url);
const tempCellsUrl = new URL("./cells-data.tmp.mjs", import.meta.url);
const loader = new GLTFLoader();
const originalFetch = globalThis.fetch;

globalThis.ProgressEvent ??= class ProgressEvent extends Event {
  constructor(type, init = {}) {
    super(type);
    this.lengthComputable = init.lengthComputable ?? false;
    this.loaded = init.loaded ?? 0;
    this.total = init.total ?? 0;
  }
};
globalThis.self ??= globalThis;
globalThis.URL.createObjectURL ??= () => "blob:annotation-inspection";
globalThis.URL.revokeObjectURL ??= () => undefined;
globalThis.createImageBitmap ??= async () => ({
  width: 1,
  height: 1,
  close() {},
});

globalThis.fetch = async (resource, options) => {
  const href = typeof resource === "string" ? resource : resource.url;
  if (href.startsWith("file:")) {
    const buffer = await readFile(fileURLToPath(href));
    return new Response(buffer, { status: 200 });
  }
  return originalFetch(resource, options);
};

function round(value) {
  const rounded = Number(value.toFixed(3));
  return Object.is(rounded, -0) ? 0 : rounded;
}

function formatPosition([x, y, z]) {
  return `position: [${round(x)}, ${round(y)}, ${round(z)}]`;
}

async function importCells() {
  const source = await readFile(cellsUrl, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
      verbatimModuleSyntax: true,
    },
  }).outputText;
  await writeFile(tempCellsUrl, transpiled, "utf8");
  return import(`${pathToFileURL(fileURLToPath(tempCellsUrl)).href}?t=${Date.now()}`);
}

async function loadBounds(assetUrl) {
  const modelUrl = new URL(assetUrl.replace(/^\//, ""), publicUrl);
  const gltf = await loader.loadAsync(modelUrl.href);
  const box = new Box3().setFromObject(gltf.scene);
  if (box.isEmpty()) {
    throw new Error(`Unable to measure ${assetUrl}`);
  }
  const center = new Vector3();
  const size = new Vector3();
  box.getCenter(center);
  box.getSize(size);
  return { min: box.min, max: box.max, center, size };
}

function anchorFor(annotation, index, total, bounds) {
  const { min, max, center, size } = bounds;
  const id = `${annotation.id} ${annotation.label}`.toLowerCase();
  const xSlots = [-0.34, 0.34, -0.16, 0.16, -0.48, 0.48, 0, -0.26];
  const ySlots = [0.28, 0.14, 0, -0.14, -0.28, 0.42, -0.42, 0.08];
  const zSlots = [0.28, 0.34, 0.4, 0.46, 0.52, 0.31, 0.37, 0.43];
  let x = center.x + size.x * xSlots[index % xSlots.length];
  let y = center.y + size.y * ySlots[index % ySlots.length];
  let z = center.z + size.z * zSlots[index % zSlots.length];

  if (id.includes("left") || id.includes("first") || id.includes("glycerol") || id.includes("amino")) {
    x = min.x + size.x * 0.24;
  }
  if (id.includes("right") || id.includes("second") || id.includes("carboxyl") || id.includes("tail")) {
    x = max.x - size.x * 0.24;
  }
  if (id.includes("upper") || id.includes("outer") || id.includes("hydrophilic") || id.includes("head")) {
    y = max.y - size.y * 0.18;
  }
  if (id.includes("lower") || id.includes("inner") || id.includes("hydrophobic")) {
    y = min.y + size.y * 0.22;
  }
  if (id.includes("center") || id.includes("bond") || id.includes("ring") || id.includes("core") || id.includes("helix")) {
    x = center.x + size.x * (index - (total - 1) / 2) * 0.08;
    y = center.y + size.y * (0.06 - index * 0.015);
  }
  if (id.includes("oxygen") || id.includes("phosphate") || id.includes("base")) {
    y = center.y + size.y * 0.22;
  }
  if (id.includes("hydrogen") || id.includes("hydroxyl") || id.includes("ribose") || id.includes("uracil")) {
    y = center.y - size.y * 0.18;
  }

  return [x, y, z];
}

function isInside(position, bounds) {
  const [x, y, z] = position;
  const { min, max, size } = bounds;
  const margin = Math.max(size.x, size.y, size.z) * 0.12;
  return (
    x >= min.x - margin &&
    x <= max.x + margin &&
    y >= min.y - margin &&
    y <= max.y + margin &&
    z >= min.z - margin &&
    z <= max.z + margin
  );
}

function shouldReplace(annotation, bounds) {
  const [x, y, z] = annotation.position;
  const span = Math.max(bounds.size.x, bounds.size.y, bounds.size.z);
  const distanceFromCenter = Math.hypot(x - bounds.center.x, y - bounds.center.y, z - bounds.center.z);
  return (
    !isInside(annotation.position, bounds) ||
    distanceFromCenter < span * 0.015 ||
    annotation.position.every((value) => Math.abs(value) < 1e-9)
  );
}

function findAnnotationBlocks(source, modelId) {
  const idIndex = source.indexOf(`id: "${modelId}"`);
  if (idIndex === -1) {
    throw new Error(`Could not find model ${modelId}`);
  }
  const annotationsIndex = source.indexOf("annotations:", idIndex);
  if (annotationsIndex === -1) {
    return [];
  }
  const arrayStart = source.indexOf("[", annotationsIndex);
  let depth = 0;
  let arrayEnd = -1;
  for (let index = arrayStart; index < source.length; index += 1) {
    if (source[index] === "[") depth += 1;
    if (source[index] === "]") depth -= 1;
    if (depth === 0) {
      arrayEnd = index;
      break;
    }
  }
  const blocks = [];
  const annotationSource = source.slice(arrayStart + 1, arrayEnd);
  let cursor = 0;
  while (cursor < annotationSource.length) {
    const objectStart = annotationSource.indexOf("{", cursor);
    if (objectStart === -1) break;
    let objectDepth = 0;
    for (let index = objectStart; index < annotationSource.length; index += 1) {
      if (annotationSource[index] === "{") objectDepth += 1;
      if (annotationSource[index] === "}") objectDepth -= 1;
      if (objectDepth === 0) {
        blocks.push({
          start: arrayStart + 1 + objectStart,
          end: arrayStart + 1 + index + 1,
          text: annotationSource.slice(objectStart, index + 1),
        });
        cursor = index + 1;
        break;
      }
    }
  }
  return blocks;
}

function replaceAnnotationPosition(source, block, nextPosition) {
  const positionMatch = /position:\s*\[[^\]]+\]/.exec(block.text);
  if (!positionMatch) {
    throw new Error(`Annotation block has no position: ${block.text}`);
  }
  const start = block.start + positionMatch.index;
  const end = start + positionMatch[0].length;
  return source.slice(0, start) + formatPosition(nextPosition) + source.slice(end);
}

const { cells } = await importCells();
let source = await readFile(cellsUrl, "utf8");
let replacementCount = 0;
const report = [];

for (const cell of cells) {
  const annotations = cell.annotations ?? cell.modelAsset?.annotations;
  const assetUrl = cell.modelAsset?.url;
  if (!assetUrl || !annotations?.length) {
    continue;
  }

  const bounds = await loadBounds(assetUrl);
  const blocks = findAnnotationBlocks(source, cell.id);
  if (blocks.length !== annotations.length) {
    throw new Error(`${cell.id}: expected ${annotations.length} annotation blocks, found ${blocks.length}`);
  }

  const nextPositions = annotations.map((annotation, index) =>
    shouldReplace(annotation, bounds) ? anchorFor(annotation, index, annotations.length, bounds) : annotation.position,
  );

  for (let index = blocks.length - 1; index >= 0; index -= 1) {
    const current = annotations[index].position;
    const next = nextPositions[index];
    if (current.some((value, axis) => round(value) !== round(next[axis]))) {
      source = replaceAnnotationPosition(source, blocks[index], next);
      replacementCount += 1;
    }
  }

  report.push({
    id: cell.id,
    annotations: annotations.length,
    replaced: nextPositions.filter((position, index) =>
      annotations[index].position.some((value, axis) => round(value) !== round(position[axis])),
    ).length,
    bounds: {
      min: [bounds.min.x, bounds.min.y, bounds.min.z].map(round),
      max: [bounds.max.x, bounds.max.y, bounds.max.z].map(round),
    },
  });
}

await writeFile(cellsUrl, source, "utf8");
console.log(JSON.stringify({ replacementCount, models: report }, null, 2));
