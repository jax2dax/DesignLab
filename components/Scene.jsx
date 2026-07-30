"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SceneObjects from "./SceneObjects";
import ShapeMesh from "./ShapeMesh";

export default function Scene({ data, previewShape, selected }) {
  return (
    <Canvas camera={{ position: [8, 8, 8], fov: 50 }} style={{ width: "100%", height: "100%" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <SceneObjects data={data} selected={selected} />
      {previewShape && <ShapeMesh {...previewShape} preview />}
      <OrbitControls />
      <axesHelper args={[5]} />
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}