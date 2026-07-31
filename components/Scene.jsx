"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import SceneObjects from "./SceneObjects";
import ShapeMesh from "./ShapeMesh";
import DraftGhost from "./DraftGhost";
import Lights from "./Lights";

export default function Scene({ data, previewShape, selected, lightSettings, camera, sceneScale = [1, 1, 1], onSelectMesh, draftOffset }) {
  return (
    <Canvas
      camera={{ position: camera?.position ?? [8, 8, 8], fov: camera?.fov ?? 50 }}
      style={{ width: "100%", height: "100%" }}
      onPointerMissed={() => onSelectMesh(null)} // click on empty space / background = deselect
    >
      <Lights {...lightSettings} />
      <Environment preset="city" />
      <group scale={sceneScale}>
        <SceneObjects data={data} selected={selected} onSelectMesh={onSelectMesh} />
        <DraftGhost data={data} selected={selected} offset={draftOffset} />
        {previewShape && <ShapeMesh {...previewShape} preview />}
      </group>
      <OrbitControls />
      <axesHelper args={[5]} />
      <gridHelper args={[20, 20]} />
    </Canvas>
  );
}