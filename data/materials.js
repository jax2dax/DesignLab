export const materials = {
  "dark-wood":  { color: "#3b2a1a", metalness: 0,   roughness: 0.85 },
  "light-wood": { color: "#c8a165", metalness: 0,   roughness: 0.8 },
  "stone":      { color: "#8a8a85", metalness: 0,   roughness: 0.95 },
  "brushed-steel": { color: "#b0b3b8", metalness: 0.9, roughness: 0.35 },
  "gold":       { color: "#d4af37", metalness: 1,   roughness: 0.25 },
  "glass":      { color: "#cfeeff", metalness: 0,   roughness: 0.05 },
  "matte-plastic": { color: "#e63946", metalness: 0, roughness: 0.6 },
};

// Resolves a shape's final visual properties.
// Explicit color/metalness/roughness on the shape always win over the preset —
// so you can pick "dark-wood" as a base and still nudge roughness afterward.
export function resolveMaterial(shape) {
  const preset = shape.material ? materials[shape.material] : null;
  return {
    color: shape.color ?? preset?.color ?? "#4488ff",
    metalness: shape.metalness ?? preset?.metalness ?? 0,
    roughness: shape.roughness ?? preset?.roughness ?? 0.5,
  };
}