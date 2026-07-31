import { Edges } from "@react-three/drei";
import { resolveMaterial } from "@/data/materials";

export default function ShapeMesh({ type, size, radius, pos, rotation = [0, 0, 0], preview = false, selected = false, onClick, ...shape }) {
  const { color, metalness, roughness } = resolveMaterial({ type, size, radius, pos, ...shape });

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
    <mesh position={pos} rotation={rotation} onClick={onClick}>
      {geometry}
      <meshStandardMaterial
        color={color}
        metalness={metalness}
        roughness={roughness}
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