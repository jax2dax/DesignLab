"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import SceneObjects from "./SceneObjects";
import ShapeMesh from "./ShapeMesh";
import Lights from "./Lights";

export default function Scene({ data, previewShape, selected, lightSettings }) {
  return (
    <Canvas camera={{ position: [8, 8, 8], fov: 50 }} style={{ width: "100%", height: "100%" }}>
      <Lights {...lightSettings} />
      <Environment preset="city" /> {/* gives metalness something real to reflect */}
      <SceneObjects data={data} selected={selected} />
      {previewShape && <ShapeMesh {...previewShape} preview />}
      <OrbitControls />
      <axesHelper args={[5]} />
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}