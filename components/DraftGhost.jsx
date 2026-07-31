import ShapeMesh from "./ShapeMesh";

export default function DraftGhost({ data, selected, offset }) {
  if (!offset || (offset.x === 0 && offset.y === 0 && offset.z === 0)) return null;

  const ghosts = [];
  Object.entries(data).forEach(([groupName, shapes]) => {
    shapes.forEach((shape, i) => {
      const key = `${groupName}-${i}`;
      if (selected.has(groupName) || selected.has(key)) {
        ghosts.push(
          <ShapeMesh
            key={`ghost-${key}`}
            {...shape}
            pos={[shape.pos[0] + offset.x, shape.pos[1] + offset.y, shape.pos[2] + offset.z]}
            preview
          />
        );
      }
    });
  });
  return <>{ghosts}</>;
}