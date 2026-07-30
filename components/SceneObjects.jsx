import ShapeMesh from "./ShapeMesh";

export default function SceneObjects({ data, selected }) {
  return Object.entries(data).map(([groupName, shapes]) => (
    <group name={groupName} key={groupName}>
      {shapes.map((obj, i) => {
        const isSelected = selected.has(groupName) || selected.has(`${groupName}-${i}`);
        return <ShapeMesh key={`${groupName}-${i}`} {...obj} selected={isSelected} />;
      })}
    </group>
  ));
}