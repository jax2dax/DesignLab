export default function ShapeMesh({ type, size, radius, pos, color, preview = false }) {
  const finalColor = color || "#4488ff"; // default when none provided

  let geometry;
  switch (type) {
    case "cube":
      geometry = <boxGeometry args={size} />;
      break;
    case "sphere":
      geometry = <sphereGeometry args={[radius, 32, 32]} />;
      break;
    default:
      return null;
  }

  return (
    <mesh position={pos}>
      {geometry}
      <meshStandardMaterial
        color={finalColor}
        transparent={preview}
        opacity={preview ? 0.35 : 1}
        wireframe={preview}
      />
    </mesh>
  );
}