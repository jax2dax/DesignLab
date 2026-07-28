export default function ShapeMesh({ type, size, radius, pos, color, preview = false }) {
  const finalColor = color || "#4488ff";

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
        depthWrite={!preview} // prevents the translucent ghost from occluding things behind it oddly
      />
    </mesh>
  );
}