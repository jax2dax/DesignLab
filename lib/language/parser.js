import { isShapeType, getVerb } from "./registry";
import { parseFieldBlock } from "./fields";

export class LanguageParseError extends Error {
  constructor(errors) {
    super(errors.join("\n"));
    this.errors = errors;
  }
}

// Matches: KEYWORD ["quoted name"] { body }
// KEYWORD is either a shape type (add) or a registered verb (claw, slay, ...).
// The name is optional for add-blocks, required for verb-blocks (checked below).
const STATEMENT_REGEX = /(\w+)\s*(?:"([^"]+)")?\s*\{([^}]*)\}/g;

// Parses raw language text into a list of operations. This function is pure —
// it never touches sceneData — so it can be reused anywhere (script panel,
// AI response handling, future file import) without a scene in scope yet.
//
// Returns: { ops, errors }
//   ops:  [{ kind: "add", type, name, fields }, { kind: "edit", name, fields }, { kind: "delete", name }]
//   errors: string[] — collected across every statement, not just the first failure
export function parseLanguage(text) {
  const ops = [];
  const errors = [];
  let match;
  let statementIndex = 0;
  let matchedAny = false;

  while ((match = STATEMENT_REGEX.exec(text)) !== null) {
    matchedAny = true;
    statementIndex++;
    const keyword = match[1];
    const quotedName = match[2]; // undefined if not present
    const body = match[3];
    const label = `Statement ${statementIndex} (${keyword})`;

    if (isShapeType(keyword)) {
      const { fields, errors: fieldErrors } = parseFieldBlock(body, label);
      errors.push(...fieldErrors);

      if (!fields.pos) errors.push(`${label}: missing required "pos"`);
      if (keyword.toLowerCase() === "cube" && !fields.size) errors.push(`${label}: missing required "size"`);
      if (keyword.toLowerCase() === "sphere" && fields.radius === undefined) errors.push(`${label}: missing required "radius"`);

      ops.push({
        kind: "add",
        type: keyword.toLowerCase(),
        name: quotedName || fields.name || null, // null = auto-generate at apply time
        fields,
      });
      continue;
    }

    const verb = getVerb(keyword);
    if (verb) {
      if (!quotedName) {
        errors.push(`${label}: "${keyword}" requires a quoted target name, e.g. ${keyword} "cube2" { ... }`);
        continue;
      }

      if (verb.kind === "delete") {
        ops.push({ kind: "delete", name: quotedName });
        continue;
      }

      if (verb.kind === "edit") {
        const { fields, errors: fieldErrors } = parseFieldBlock(body, label);
        errors.push(...fieldErrors);
        ops.push({ kind: "edit", name: quotedName, fields });
        continue;
      }

      errors.push(`${label}: verb "${keyword}" is registered but not yet implemented`);
      continue;
    }

    errors.push(`${label}: unknown keyword "${keyword}". Expected a shape type (${["cube", "sphere"].join(", ")}) or a verb (${Object.keys(getVerb.VERBS || {}).join(", ") || "claw, slay"})`);
  }

  if (!matchedAny) {
    errors.push('No valid statements found. Expected e.g.: cube { pos: 0,0,0 size: 1,1,1 }  or  claw "cube2" { color: #ff0000 }');
  }

  if (errors.length > 0) throw new LanguageParseError(errors);
  return ops;
}