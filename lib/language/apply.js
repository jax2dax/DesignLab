import { generateUniqueName, findShapeByName, collectExistingNames } from "@/lib/names";

// Applies parsed language ops to sceneData, returning a NEW sceneData object
// (never mutates the input) plus any runtime errors — things the parser
// couldn't know about, like "edit target doesn't exist".
export function applyLanguageOps(ops, sceneData) {
  let next = { ...sceneData };
  const errors = [];

  ops.forEach((op) => {
    if (op.kind === "add") {
      const groupName = op.fields.group || "generated";
      const name = op.name || generateUniqueName(op.type, next);

      if (collectExistingNames(next).has(name)) {
        errors.push(`Add failed: a mesh named "${name}" already exists.`);
        return;
      }

      const shape = { type: op.type, name, ...op.fields };
      delete shape.group; // "group" is a placement key, not a shape property
      next = { ...next, [groupName]: [...(next[groupName] || []), shape] };
      return;
    }

    if (op.kind === "edit") {
      const found = findShapeByName(next, op.name);
      if (!found) {
        errors.push(`Edit failed: no mesh named "${op.name}" found.`);
        return;
      }
      const patch = { ...op.fields };
      delete patch.group; // moving groups isn't supported via claw yet — flagged below
      const { groupName, index } = found;
      next = {
        ...next,
        [groupName]: next[groupName].map((s, i) => (i === index ? { ...s, ...patch } : s)),
      };
      return;
    }

    if (op.kind === "delete") {
      const found = findShapeByName(next, op.name);
      if (!found) {
        errors.push(`Delete failed: no mesh named "${op.name}" found.`);
        return;
      }
      const { groupName, index } = found;
      next = {
        ...next,
        [groupName]: next[groupName].filter((_, i) => i !== index),
      };
      return;
    }
  });

  return { sceneData: next, errors };
}