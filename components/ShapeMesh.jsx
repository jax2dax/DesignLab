import { createElement } from "react";
import * as THREE from "three";
import { Edges } from "@react-three/drei";
import { resolveMaterial } from "@/data/materials";
import { getShapeDef } from "@/lib/shapes/registry";

export default function ShapeMesh({ type, pos, rotation = [0, 0, 0], preview = false, selected = false, onClick, ...shape }) {
  const shapeDef = getShapeDef(type);
  if (!shapeDef) return null;

  const { color, metalness, roughness } = resolveMaterial({ type, pos, ...shape });
  const geometry = createElement(shapeDef.geometryComponent, { args: shapeDef.geometryArgs(shape) });

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
        side={shapeDef.doubleSided ? THREE.DoubleSide : THREE.FrontSide}
        emissive={selected ? "#22c55e" : "#000000"}
        emissiveIntensity={selected ? 0.35 : 0}
      />
      {selected && <Edges color="#22c55e" linewidth={2} />}
    </mesh>
  );
}