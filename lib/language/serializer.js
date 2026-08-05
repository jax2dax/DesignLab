import { getShapeDef } from "@/lib/shapes/registry";

function fieldsBlock(shape, includeGroup) {
  const lines = [];
  if (includeGroup) lines.push(`  group: ${shape.group || "generated"}`);
  lines.push(`  pos: ${shape.pos.join(", ")}`);

  const shapeDef = getShapeDef(shape.type);
  shapeDef?.fields.forEach((f) => {
    const val = shape[f.key];
    if (val === undefined) return;
    lines.push(`  ${f.key}: ${Array.isArray(val) ? val.join(", ") : val}`);
  });

  const rotDeg = (shape.rotation || [0, 0, 0]).map((r) => +(r * 180 / Math.PI).toFixed(2));
  lines.push(`  rotation: ${rotDeg.join(", ")}`);
  if (shape.color) lines.push(`  color: ${shape.color}`);
  if (shape.material) lines.push(`  material: ${shape.material}`);
  if (shape.metalness !== undefined) lines.push(`  metalness: ${shape.metalness}`);
  if (shape.roughness !== undefined) lines.push(`  roughness: ${shape.roughness}`);
  return lines;
}

export function shapeToAddBlock(groupName, shape) {
  const lines = [`${shape.type} "${shape.name}" {`, `  group: ${groupName}`, ...fieldsBlock(shape, false).slice(1), "}"];
  return lines.join("\n");
}

export function shapeToClawBlock(shape) {
  const lines = [`claw "${shape.name}" {`, ...fieldsBlock(shape, false), "}"];
  return lines.join("\n");
}

export function refsToAddScript(refs) {
  return refs.map((r) => shapeToAddBlock(r.groupName, r.shape)).join("\n\n");
}
export function refsToClawScript(refs) {
  return refs.map((r) => shapeToClawBlock(r.shape)).join("\n\n");
}