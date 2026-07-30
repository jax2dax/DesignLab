"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import SceneObjects from "./SceneObjects";
import ShapeMesh from "./ShapeMesh";
import Lights from "./Lights";

export default function Scene({ data, previewShape, selected, lightSettings, camera, sceneScale = [1, 1, 1] }) {
  return (
    <Canvas camera={{ position: camera?.position ?? [8, 8, 8], fov: camera?.fov ?? 50 }} style={{ width: "100%", height: "100%" }}>
      <Lights {...lightSettings} />
      <Environment preset="city" />
      <group scale={sceneScale}>
        <SceneObjects data={data} selected={selected} />
        {previewShape && <ShapeMesh {...previewShape} preview />}
      </group>
      <OrbitControls />
      <axesHelper args={[5]} />
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}