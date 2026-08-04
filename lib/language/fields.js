function parseVector(raw, len) {
  const parts = raw.split(",").map((s) => parseFloat(s.trim()));
  if (parts.length !== len || parts.some((n) => Number.isNaN(n))) return null;
  return parts;
}

function parseNumber(raw) {
  const n = parseFloat(raw);
  return Number.isNaN(n) ? null : n;
}

// Each field: how to parse its raw text, and a validate step returning an error string or null.
// Add a new recognized field by adding one entry here — the parser and applier
// both read this table generically, no other code needs to change.
export const FIELD_DEFS = {
  group:     { parse: (raw) => raw.trim() },
  name:      { parse: (raw) => raw.trim() },
  pos:       { parse: (raw) => parseVector(raw, 3), errorHint: "expected 3 comma-separated numbers, e.g. 0, 1, 0" },
  size:      { parse: (raw) => parseVector(raw, 3), errorHint: "expected 3 comma-separated numbers, e.g. 1, 1, 1" },
  radius:    { parse: (raw) => parseNumber(raw), errorHint: "expected a single number" },
  rotation:  { parse: (raw) => { const v = parseVector(raw, 3); return v ? v.map((d) => (d * Math.PI) / 180) : null; }, errorHint: "expected 3 comma-separated degree values, e.g. 0, 90, 0" },
  color:     { parse: (raw) => raw.trim() },
  material:  { parse: (raw) => raw.trim() },
  metalness: { parse: (raw) => parseNumber(raw), errorHint: "expected a number between 0 and 1" },
  roughness: { parse: (raw) => parseNumber(raw), errorHint: "expected a number between 0 and 1" },
};

// Parses the inside of a { ... } block into a plain fields object.
// Returns { fields, errors } — never throws, so callers can collect every
// problem in a statement instead of stopping at the first one.
export function parseFieldBlock(body, statementLabel) {
  const fields = {};
  const errors = [];

  body.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) {
      errors.push(`${statementLabel}: malformed line "${trimmed}" (expected "key: value")`);
      return;
    }

    const key = trimmed.slice(0, colonIdx).trim().toLowerCase();
    const rawValue = trimmed.slice(colonIdx + 1).trim();
    const def = FIELD_DEFS[key];

    if (!def) {
      errors.push(`${statementLabel}: unknown field "${key}"`);
      return;
    }

    const parsed = def.parse(rawValue);
    if (parsed === null) {
      errors.push(`${statementLabel}: invalid ${key} "${rawValue}"${def.errorHint ? ` — ${def.errorHint}` : ""}`);
      return;
    }

    fields[key] = parsed;
  });

  return { fields, errors };
}