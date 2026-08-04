function fieldsBlock(shape, includeGroup) {
  const lines = [];
  if (includeGroup) lines.push(`  group: ${shape.group || "generated"}`);
  lines.push(`  pos: ${shape.pos.join(", ")}`);
  if (shape.type === "cube") lines.push(`  size: ${shape.size.join(", ")}`);
  if (shape.type === "sphere") lines.push(`  radius: ${shape.radius}`);
  const rotDeg = (shape.rotation || [0, 0, 0]).map((r) => +(r * 180 / Math.PI).toFixed(2));
  lines.push(`  rotation: ${rotDeg.join(", ")}`);
  if (shape.color) lines.push(`  color: ${shape.color}`);
  if (shape.material) lines.push(`  material: ${shape.material}`);
  if (shape.metalness !== undefined) lines.push(`  metalness: ${shape.metalness}`);
  if (shape.roughness !== undefined) lines.push(`  roughness: ${shape.roughness}`);
  return lines;
}

// Add-form: TYPE "name" { group, pos, size/radius, rotation, color, material... }
export function shapeToAddBlock(groupName, shape) {
  const lines = [`${shape.type} "${shape.name}" {`, `  group: ${groupName}`, ...fieldsBlock(shape, false).slice(1), "}"];
  return lines.join("\n");
}

// Edit-form: claw "name" { same fields, no group } — this is what the script
// panel should show when opened on an EXISTING selected mesh, so hitting Run
// patches it in place instead of duplicating it.
export function shapeToClawBlock(shape) {
  const lines = [`claw "${shape.name}" {`, ...fieldsBlock(shape, false), "}"];
  return lines.join("\n");
}

// refs: [{ groupName, shape }]
export function refsToAddScript(refs) {
  return refs.map((r) => shapeToAddBlock(r.groupName, r.shape)).join("\n\n");
}
export function refsToClawScript(refs) {
  return refs.map((r) => shapeToClawBlock(r.shape)).join("\n\n");
}