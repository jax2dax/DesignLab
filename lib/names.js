export function collectExistingNames(sceneData) {
  const names = new Set();
  Object.values(sceneData).forEach((shapes) =>
    shapes.forEach((s) => { if (s.name) names.add(s.name); })
  );
  return names;
}

export function generateUniqueName(type, sceneData) {
  const existing = collectExistingNames(sceneData);
  let i = 1;
  let candidate = `${type}${i}`;
  while (existing.has(candidate)) {
    i++;
    candidate = `${type}${i}`;
  }
  return candidate;
}

export function findShapeByName(sceneData, name) {
  for (const [groupName, shapes] of Object.entries(sceneData)) {
    const index = shapes.findIndex((s) => s.name === name);
    if (index !== -1) return { groupName, index, shape: shapes[index] };
  }
  return null;
}

// Guarantees every shape has a name, AND that no two shapes share one —
// this is the actual fix for "multiple cube #1 in different groups":
// it walks every group in order and renames on collision, not just on missing.
export function ensureNames(sceneData) {
  const next = {};
  const usedNames = new Set();

  Object.entries(sceneData).forEach(([groupName, shapes]) => {
    next[groupName] = shapes.map((shape) => {
      let name = shape.name;
      if (!name || usedNames.has(name)) {
        let i = 1;
        let candidate = `${shape.type}${i}`;
        while (usedNames.has(candidate)) { i++; candidate = `${shape.type}${i}`; }
        name = candidate;
      }
      usedNames.add(name);
      return { ...shape, name };
    });
  });

  return next;
}

// For the name-edit field: is this name free, ignoring the shape's own current name?
export function isNameAvailable(sceneData, name, ignoreName) {
  if (!name.trim()) return false;
  const existing = collectExistingNames(sceneData);
  existing.delete(ignoreName);
  return !existing.has(name.trim());
}