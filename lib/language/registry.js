// Shape types that can appear as an implicit "add" keyword: TYPE { fields }
// Add a new geometry by adding it here AND giving ShapeMesh.jsx a matching case.
export const SHAPE_TYPES = ["cube", "sphere"];

// Verb keywords: KEYWORD "name" { fields }
// "kind" drives how apply.js handles the statement. Add new verbs here without
// touching the tokenizer or parser — they're generic over any registered kind.
export const VERBS = {
  claw: {
    kind: "edit",
    description: 'Selects an existing mesh by name and patches only the given fields. Untouched fields keep their current value.',
  },
  slay: {
    kind: "delete",
    description: "Selects an existing mesh by name and removes it. Body should be empty: slay \"name\" {}",
  },
  // Reserved for future use — not implemented yet, listed so the grammar shape is stable:
  // spawn: { kind: "add-forced-name", description: "Like a shape block, but requires an explicit name." }
  // nudge: { kind: "relative-move", description: "Move a named mesh by a relative offset instead of setting an absolute pos." }
};

export function isShapeType(word) {
  return SHAPE_TYPES.includes(word.toLowerCase());
}

export function getVerb(word) {
  return VERBS[word.toLowerCase()] || null;
}