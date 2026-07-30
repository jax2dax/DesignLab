export const BIOME_FORMAT_VERSION = "biome-v1";
export const FILE_EXTENSION = ".ejb";

export const PLATFORM_LIMITS = {
  min: [1, 0.1, 1],
  max: [100, 50, 100],
};

export function validatePlatform(platform) {
  const errors = [];
  const labels = ["width (x)", "height (y)", "depth (z)"];
  platform.forEach((val, i) => {
    if (val < PLATFORM_LIMITS.min[i]) errors.push(`Platform ${labels[i]} = ${val} is below minimum ${PLATFORM_LIMITS.min[i]}`);
    if (val > PLATFORM_LIMITS.max[i]) errors.push(`Platform ${labels[i]} = ${val} exceeds maximum ${PLATFORM_LIMITS.max[i]}`);
  });
  return errors;
}

export function buildBiome({ sceneData, lightSettings, platform, camera, sceneScale, animation = [], customFiles = [] }) {
  return {
    format: BIOME_FORMAT_VERSION,
    meta: { exportedAt: new Date().toISOString() },
    platform,
    sceneScale,
    lights: [
      { type: "ambient", intensity: lightSettings.ambientIntensity },
      { type: "directional", intensity: lightSettings.directionalIntensity, position: lightSettings.directionalPos },
    ],
    camera,
    scene: sceneData,
    animation,
    customFiles,
  };
}

export function serializeBiome(biome) {
  const header = `EJB ${biome.format}\n`;
  return header + JSON.stringify(biome, null, 2);
}

export function parseBiome(text) {
  const newlineIndex = text.indexOf("\n");
  if (newlineIndex === -1) throw new Error("File is empty or malformed.");

  const headerLine = text.slice(0, newlineIndex).trim();
  if (!headerLine.startsWith("EJB ")) throw new Error("Not a valid .ejb file — missing EJB header.");

  const declaredVersion = headerLine.replace("EJB ", "").trim();
  const jsonBody = text.slice(newlineIndex + 1);

  let parsed;
  try {
    parsed = JSON.parse(jsonBody);
  } catch (e) {
    throw new Error("Body is not valid JSON: " + e.message);
  }

  if (parsed.format !== declaredVersion) {
    throw new Error(`Header version (${declaredVersion}) doesn't match body format (${parsed.format}).`);
  }
  if (parsed.format !== BIOME_FORMAT_VERSION) {
    throw new Error(`Unsupported biome format: ${parsed.format}. This app reads ${BIOME_FORMAT_VERSION}.`);
  }

  const platformErrors = validatePlatform(parsed.platform || [1, 1, 1]);
  if (platformErrors.length > 0) {
    throw new Error("Platform out of bounds:\n" + platformErrors.join("\n"));
  }

  return parsed;
}

// --- Import-specific helpers (merging into an already-open world) ---

// Shifts every shape's pos in a scene object by [dx, dy, dz].
// Rotation, size, and material are untouched — only position moves.
function translateSceneData(sceneData, offset) {
  const [dx, dy, dz] = offset;
  const translated = {};
  Object.entries(sceneData).forEach(([groupName, shapes]) => {
    translated[groupName] = shapes.map((shape) => ({
      ...shape,
      pos: [shape.pos[0] + dx, shape.pos[1] + dy, shape.pos[2] + dz],
    }));
  });
  return translated;
}

// Avoids silently overwriting an existing group with the same name —
// "wall" importing into a world that already has "wall" becomes "wall_2", "wall_3", etc.
function resolveGroupNameCollisions(incomingSceneData, existingSceneData) {
  const resolved = {};
  Object.entries(incomingSceneData).forEach(([groupName, shapes]) => {
    let finalName = groupName;
    let suffix = 2;
    while (existingSceneData[finalName] || resolved[finalName]) {
      finalName = `${groupName}_${suffix}`;
      suffix++;
    }
    resolved[finalName] = shapes;
  });
  return resolved;
}

// Rough footprint check: does the imported biome's declared platform,
// placed at targetPosition, still fit inside the current world's platform?
// This is a bounding-box approximation, not an exact mesh-by-mesh check.
export function checkImportFit(currentPlatform, importedPlatform, targetPosition) {
  const halfImported = importedPlatform.map((v) => v / 2);
  const halfCurrent = currentPlatform.map((v) => v / 2);
  const warnings = [];
  ["x", "y", "z"].forEach((axis, i) => {
    const min = targetPosition[i] - halfImported[i];
    const max = targetPosition[i] + halfImported[i];
    if (min < -halfCurrent[i] || max > halfCurrent[i]) {
      warnings.push(`Imported biome may extend outside the current platform on the ${axis} axis.`);
    }
  });
  return warnings;
}

// The main entry point for a merge-import: translates positions and
// resolves naming collisions, returns the sceneData ready to merge in.
export function prepareImportedScene(importedBiome, targetPosition, existingSceneData) {
  const translated = translateSceneData(importedBiome.scene || {}, targetPosition);
  return resolveGroupNameCollisions(translated, existingSceneData);
}