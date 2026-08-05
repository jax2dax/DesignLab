import { SHAPE_TYPES } from "@/lib/shapes/registry";
import { getShapeDef } from "@/lib/shapes/registry";
export { SHAPE_TYPES };

export const VERBS = {
  claw: { kind: "edit", description: "Selects an existing mesh by name and patches only the given fields." },
  slay: { kind: "delete", description: "Selects an existing mesh by name and removes it." },
};

export function isShapeType(word) {
  return SHAPE_TYPES.includes(word.toLowerCase());
}
export function getVerb(word) {
  return VERBS[word.toLowerCase()] || null;
}