export default function ShapeMesh({ type, size, radius, pos }) {
  let geometry;
  switch (type) {
    case "cube":
      geometry = <boxGeometry args={[size, size, size]} />;
      break;
    case "sphere":
      geometry = <sphereGeometry args={[radius, 32, 32]} />;
      break;
    default:
      return null; // unknown type — skip it silently for now
  }

  return (
    <mesh position={pos}>
      {geometry}
      <meshStandardMaterial color="steelblue" />
    </mesh>
  );
}