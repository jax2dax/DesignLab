import { SHAPES } from "@/lib/shapes/registry";

function parseVector(raw, len) {
  const parts = raw.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length !== len || parts.some((n) => Number.isNaN(n))) return null;
  return parts;
}
function parseNumber(raw) {
  const n = parseFloat(raw);
  return Number.isNaN(n) ? null : n;
}

const BASE_FIELD_DEFS = {
  group:     { parse: (raw) => raw.trim() },
  name:      { parse: (raw) => raw.trim() },
  pos:       { parse: (raw) => parseVector(raw, 3), errorHint: "expected 3 comma-separated numbers, e.g. 0, 1, 0" },
  rotation:  { parse: (raw) => { const v = parseVector(raw, 3); return v ? v.map((d) => (d * Math.PI) / 180) : null; }, errorHint: "expected 3 comma-separated degree values" },
  color:     { parse: (raw) => raw.trim() },
  material:  { parse: (raw) => raw.trim() },
  metalness: { parse: (raw) => parseNumber(raw), errorHint: "expected a number between 0 and 1" },
  roughness: { parse: (raw) => parseNumber(raw), errorHint: "expected a number between 0 and 1" },
};

// Auto-derives field parsers for every shape-specific field (size, radius,
// height, sides, tube, radiusTop...) directly from the shape registry.
// This is what means a new shape's fields never need a manual entry here.
const SHAPE_FIELD_DEFS = {};
Object.values(SHAPES).forEach((def) => {
  def.fields.forEach((f) => {
    if (SHAPE_FIELD_DEFS[f.key]) return; // already covered by another shape sharing the field name
    SHAPE_FIELD_DEFS[f.key] = f.type === "vec3"
      ? { parse: (raw) => parseVector(raw, 3), errorHint: "expected 3 comma-separated numbers" }
      : { parse: (raw) => parseNumber(raw), errorHint: "expected a number" };
  });
});

export const FIELD_DEFS = { ...BASE_FIELD_DEFS, ...SHAPE_FIELD_DEFS };

export function parseFieldBlock(body, statementLabel) {
  const fields = {};
  const errors = [];
  body.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) { errors.push(`${statementLabel}: malformed line "${trimmed}" (expected "key: value")`); return; }
    const key = trimmed.slice(0, colonIdx).trim().toLowerCase();
    const rawValue = trimmed.slice(colonIdx + 1).trim();
    const def = FIELD_DEFS[key];
    if (!def) { errors.push(`${statementLabel}: unknown field "${key}"`); return; }
    const parsed = def.parse(rawValue);
    if (parsed === null) { errors.push(`${statementLabel}: invalid ${key} "${rawValue}"${def.errorHint ? ` — ${def.errorHint}` : ""}`); return; }
    fields[key] = parsed;
  });
  return { fields, errors };
}