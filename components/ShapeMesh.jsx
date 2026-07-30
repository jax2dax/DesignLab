import { Edges } from "@react-three/drei";

export default function ShapeMesh({ type, size, radius, pos, color, preview = false, selected = false }) {
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
        depthWrite={!preview}
        emissive={selected ? "#22c55e" : "#000000"}
        emissiveIntensity={selected ? 0.35 : 0}
      />
      {selected && <Edges color="#22c55e" linewidth={2} />}
    </mesh>
  );
}