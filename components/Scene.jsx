"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import SceneObjects from "./SceneObjects";

export default function Scene({ data }) {
  return (
    <Canvas camera={{ position: [8, 8, 8], fov: 50 }} style={{ height: "100vh" }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <SceneObjects data={data} />
      <OrbitControls />
      <axesHelper args={[5]} />
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}