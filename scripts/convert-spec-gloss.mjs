import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join } from "node:path";

const GLB_JSON_CHUNK = 0x4e4f534a;

function alignToFour(value) {
  return Math.ceil(value / 4) * 4;
}

function convertMaterial(material) {
  const specGloss = material.extensions?.KHR_materials_pbrSpecularGlossiness;
  if (!specGloss) {
    return false;
  }

  material.pbrMetallicRoughness = {
    baseColorFactor: specGloss.diffuseFactor ?? [1, 1, 1, 1],
    metallicFactor: 0,
    roughnessFactor: Math.max(0.32, 1 - (specGloss.glossinessFactor ?? 1)),
  };

  if (specGloss.diffuseTexture) {
    material.pbrMetallicRoughness.baseColorTexture = specGloss.diffuseTexture;
  }

  delete material.extensions.KHR_materials_pbrSpecularGlossiness;
  if (Object.keys(material.extensions).length === 0) {
    delete material.extensions;
  }

  return true;
}

function convertFile(inputPath) {
  const source = readFileSync(inputPath);
  if (source.toString("ascii", 0, 4) !== "glTF" || source.readUInt32LE(4) !== 2) {
    throw new Error(`${inputPath} is not a GLB 2.0 file.`);
  }

  const jsonLength = source.readUInt32LE(12);
  if (source.readUInt32LE(16) !== GLB_JSON_CHUNK) {
    throw new Error(`${inputPath} has no JSON chunk.`);
  }

  const document = JSON.parse(source.subarray(20, 20 + jsonLength).toString("utf8"));
  const convertedMaterials = (document.materials ?? []).filter(convertMaterial).length;
  if (convertedMaterials === 0) {
    throw new Error(`${inputPath} does not use KHR_materials_pbrSpecularGlossiness.`);
  }

  document.extensionsUsed = (document.extensionsUsed ?? []).filter(
    (extension) => extension !== "KHR_materials_pbrSpecularGlossiness",
  );
  document.extensionsRequired = (document.extensionsRequired ?? []).filter(
    (extension) => extension !== "KHR_materials_pbrSpecularGlossiness",
  );
  if (document.extensionsUsed.length === 0) {
    delete document.extensionsUsed;
  }
  if (document.extensionsRequired.length === 0) {
    delete document.extensionsRequired;
  }

  const json = Buffer.from(JSON.stringify(document), "utf8");
  const paddedJsonLength = alignToFour(json.length);
  const jsonChunk = Buffer.alloc(8 + paddedJsonLength, 0x20);
  jsonChunk.writeUInt32LE(paddedJsonLength, 0);
  jsonChunk.writeUInt32LE(GLB_JSON_CHUNK, 4);
  json.copy(jsonChunk, 8);

  const remainingChunks = source.subarray(20 + jsonLength);
  const header = Buffer.from(source.subarray(0, 12));
  header.writeUInt32LE(header.length + jsonChunk.length + remainingChunks.length, 8);

  const extension = extname(inputPath);
  const outputPath = join(
    dirname(inputPath),
    `${basename(inputPath, extension)}.pbr${extension}`,
  );
  writeFileSync(outputPath, Buffer.concat([header, jsonChunk, remainingChunks]));
  console.log(`${outputPath}: converted ${convertedMaterials} materials`);
}

const inputPaths = process.argv.slice(2);
if (inputPaths.length === 0) {
  throw new Error("Pass one or more GLB paths to convert.");
}

inputPaths.forEach(convertFile);
