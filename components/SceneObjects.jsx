import ShapeMesh from "./ShapeMesh";

export default function SceneObjects({ data, selected, onSelectMesh }) {
  return Object.entries(data).map(([groupName, shapes]) => (
    <group name={groupName} key={groupName}>
      {shapes.map((obj, i) => {
        const key = `${groupName}-${i}`;
        const isSelected = selected.has(groupName) || selected.has(key);
        return (
          <ShapeMesh
            key={key}
            {...obj}
            selected={isSelected}
            onClick={(e) => {
              e.stopPropagation(); // stops the click from also hitting onPointerMissed below
              onSelectMesh(key, e.nativeEvent?.shiftKey || e.shiftKey);
            }}
          />
        );
      })}
    </group>
  ));
}