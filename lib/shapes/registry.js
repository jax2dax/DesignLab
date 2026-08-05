export const SHAPES = {
  cube: {
    label: "Cube",
    fields: [{ key: "size", type: "vec3", required: true, default: [1, 1, 1], min: 0.1 }],
    geometryComponent: "boxGeometry",
    geometryArgs: (shape) => shape.size,
  },
  sphere: {
    label: "Sphere",
    fields: [{ key: "radius", type: "number", required: true, default: 1, min: 0.1 }],
    geometryComponent: "sphereGeometry",
    geometryArgs: (shape) => [shape.radius, 32, 32],
  },
  cylinder: {
    label: "Cylinder",
    fields: [
      { key: "radiusTop", type: "number", required: false, default: 1, min: 0 },
      { key: "radiusBottom", type: "number", required: false, default: 1, min: 0 },
      { key: "height", type: "number", required: true, default: 1, min: 0.1 },
    ],
    geometryComponent: "cylinderGeometry",
    geometryArgs: (shape) => [shape.radiusTop ?? 1, shape.radiusBottom ?? 1, shape.height, 32],
  },
  torus: {
    label: "Torus",
    fields: [
      { key: "radius", type: "number", required: true, default: 1, min: 0.1 },
      { key: "tube", type: "number", required: true, default: 0.3, min: 0.05 },
    ],
    geometryComponent: "torusGeometry",
    geometryArgs: (shape) => [shape.radius, shape.tube, 16, 100],
  },
  pyramid: {
    label: "Pyramid",
    fields: [
      { key: "radius", type: "number", required: true, default: 1, min: 0.1 },
      { key: "height", type: "number", required: true, default: 1, min: 0.1 },
      { key: "sides", type: "number", required: false, default: 4, min: 3 },
    ],
    geometryComponent: "coneGeometry",
    geometryArgs: (shape) => [shape.radius, shape.height, Math.max(3, Math.round(shape.sides ?? 4))],
  },
  polygon: {
    label: "Polygon plane (sides: 3=triangle, 4=square, 8=octagon, 32+=circle)",
    fields: [
      { key: "radius", type: "number", required: true, default: 1, min: 0.1 },
      { key: "sides", type: "number", required: true, default: 6, min: 3 },
    ],
    geometryComponent: "circleGeometry",
    geometryArgs: (shape) => [shape.radius, Math.max(3, Math.round(shape.sides))],
    doubleSided: true, // flat plane — needs both faces rendered or it vanishes when viewed from behind
  },
};

export const SHAPE_TYPES = Object.keys(SHAPES);

export function getShapeDef(type) {
  return SHAPES[type?.toLowerCase()] || null;
}

export function defaultFieldsFor(type) {
  const def = getShapeDef(type);
  if (!def) return {};
  const out = {};
  def.fields.forEach((f) => { out[f.key] = f.default; });
  return out;
}