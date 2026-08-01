const KNOWN_TYPES = ["cube", "sphere"];

export class ScriptParseError extends Error {
  constructor(errors) {
    super(errors.join("\n"));
    this.errors = errors;
  }
}

export function shapeToScript(groupName, shape) {
  const lines = [`${shape.type} {`];
  lines.push(`  group: ${groupName}`);
  lines.push(`  pos: ${shape.pos.join(", ")}`);
  if (shape.type === "cube") lines.push(`  size: ${shape.size.join(", ")}`);
  if (shape.type === "sphere") lines.push(`  radius: ${shape.radius}`);
  const rotDeg = (shape.rotation || [0, 0, 0]).map((r) => +(r * 180 / Math.PI).toFixed(2));
  lines.push(`  rotation: ${rotDeg.join(", ")}`);
  if (shape.color) lines.push(`  color: ${shape.color}`);
  if (shape.material) lines.push(`  material: ${shape.material}`);
  if (shape.metalness !== undefined) lines.push(`  metalness: ${shape.metalness}`);
  if (shape.roughness !== undefined) lines.push(`  roughness: ${shape.roughness}`);
  lines.push("}");
  return lines.join("\n");
}

// refs: [{ groupName, shape }]
export function shapesToScript(refs) {
  return refs.map((r) => shapeToScript(r.groupName, r.shape)).join("\n\n");
}

function parseVec(str, label, expectedLen, blockIndex, type, errors) {
  const parts = str.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length !== expectedLen || parts.some((n) => Number.isNaN(n))) {
    errors.push(`Block ${blockIndex} (${type}): invalid ${label} "${str}" — expected ${expectedLen} comma-separated numbers`);
    return null;
  }
  return parts;
}

// Returns [{ groupName, shape }] or throws ScriptParseError with all issues found.
export function parseScript(text) {
  const results = [];
  const errors = [];
  const blockRegex = /(\w+)\s*\{([^}]*)\}/g;
  let match;
  let blockIndex = 0;
  let matchedAny = false;

  while ((match = blockRegex.exec(text)) !== null) {
    matchedAny = true;
    blockIndex++;
    const type = match[1].trim().toLowerCase();
    const body = match[2];

    if (!KNOWN_TYPES.includes(type)) {
      errors.push(`Block ${blockIndex}: unknown shape type "${type}". Expected one of: ${KNOWN_TYPES.join(", ")}`);
      continue;
    }

    const fields = {};
    body.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx === -1) {
        errors.push(`Block ${blockIndex}: malformed line "${trimmed}" (expected "key: value")`);
        return;
      }
      fields[trimmed.slice(0, colonIdx).trim().toLowerCase()] = trimmed.slice(colonIdx + 1).trim();
    });

    if (!fields.pos) errors.push(`Block ${blockIndex} (${type}): missing required "pos"`);
    if (type === "cube" && !fields.size) errors.push(`Block ${blockIndex} (cube): missing required "size"`);
    if (type === "sphere" && fields.radius === undefined) errors.push(`Block ${blockIndex} (sphere): missing required "radius"`);

    const pos = fields.pos ? parseVec(fields.pos, "pos", 3, blockIndex, type, errors) : [0, 0, 0];
    const size = type === "cube" && fields.size ? parseVec(fields.size, "size", 3, blockIndex, type, errors) : [1, 1, 1];
    const rotationDeg = fields.rotation ? parseVec(fields.rotation, "rotation", 3, blockIndex, type, errors) : [0, 0, 0];

    let radius = 1;
    if (type === "sphere" && fields.radius !== undefined) {
      radius = parseFloat(fields.radius);
      if (Number.isNaN(radius)) errors.push(`Block ${blockIndex} (sphere): invalid radius "${fields.radius}"`);
    }

    const shape = {
      type,
      pos: pos || [0, 0, 0],
      rotation: (rotationDeg || [0, 0, 0]).map((d) => (d * Math.PI) / 180),
    };
    if (type === "cube") shape.size = size || [1, 1, 1];
    if (type === "sphere") shape.radius = Number.isNaN(radius) ? 1 : radius;
    if (fields.color) shape.color = fields.color;
    if (fields.material) shape.material = fields.material;

    if (fields.metalness !== undefined) {
      const m = parseFloat(fields.metalness);
      if (Number.isNaN(m)) errors.push(`Block ${blockIndex}: invalid metalness "${fields.metalness}"`);
      else shape.metalness = m;
    }
    if (fields.roughness !== undefined) {
      const r = parseFloat(fields.roughness);
      if (Number.isNaN(r)) errors.push(`Block ${blockIndex}: invalid roughness "${fields.roughness}"`);
      else shape.roughness = r;
    }

    results.push({ groupName: fields.group ? fields.group.trim() : "generated", shape });
  }

  if (!matchedAny) {
    errors.push('No valid shape blocks found. Expected format: cube { pos: 0,0,0 size: 1,1,1 }');
  }
  if (errors.length > 0) throw new ScriptParseError(errors);

  return results;
}