import ShapeMesh from "./ShapeMesh";

export default function SceneObjects({ data }) {
  return Object.entries(data).map(([groupName, shapes]) => (
    <group name={groupName} key={groupName}>
      {shapes.map((obj, i) => (
        <ShapeMesh key={`${groupName}-${i}`} {...obj} />
      ))}
    </group>
  ));
}