import { isShapeType, getVerb } from "./registry";
import { parseFieldBlock } from "./fields";
import { getShapeDef } from "@/lib/shapes/registry";

export class LanguageParseError extends Error {
  constructor(errors) {
    super(errors.join("\n"));
    this.errors = errors;
  }
}

const STATEMENT_REGEX = /(\w+)\s*(?:"([^"]+)")?\s*\{([^}]*)\}/g;

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
    const quotedName = match[2];
    const body = match[3];
    const label = `Statement ${statementIndex} (${keyword})`;

    if (isShapeType(keyword)) {
      const { fields, errors: fieldErrors } = parseFieldBlock(body, label);
      errors.push(...fieldErrors);

      if (!fields.pos) errors.push(`${label}: missing required "pos"`);
      const shapeDef = getShapeDef(keyword);
      shapeDef?.fields.forEach((f) => {
        if (f.required && fields[f.key] === undefined) {
          errors.push(`${label}: missing required "${f.key}"`);
        }
      });

      ops.push({
        kind: "add",
        type: keyword.toLowerCase(),
        name: quotedName || fields.name || null,
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

    errors.push(`${label}: unknown keyword "${keyword}"`);
  }

  if (!matchedAny) {
    errors.push('No valid statements found. Expected e.g.: cube { pos: 0,0,0 size: 1,1,1 }  or  claw "cube2" { color: #ff0000 }');
  }

  if (errors.length > 0) throw new LanguageParseError(errors);
  return ops;
}