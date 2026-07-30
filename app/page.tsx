"use client";
import { useState } from "react";
import Scene from "@/components/Scene";
import InputPanel from "@/components/InputPanel";
import GroupList from "@/components/GroupList";
import ToolBar from "@/components/ToolBar";
import testScene from "@/data/testScene.json";
import LightControls from "@/components/LightControls";

function getSelectedRefs(sceneData, selected) {
  const refs = [];
  Object.entries(sceneData).forEach(([groupName, shapes]) => {
    shapes.forEach((shape, i) => {
      if (selected.has(groupName) || selected.has(`${groupName}-${i}`)) {
        refs.push({ groupName, i });
      }
    });
  });
  return refs;
}

export default function Home() {
  const [sceneData, setSceneData] = useState(testScene);
  const [previewShape, setPreviewShape] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [moveStep, setMoveStep] = useState(1);
  const [scaleStep, setScaleStep] = useState(0.5);
//light state
const [lightSettings, setLightSettings] = useState({
  ambientIntensity: 0.4,
  directionalIntensity: 1.2,
  directionalPos: [5, 10, 5],
});
  function addGroup(groupName, shapes) {
    setSceneData((prev) => ({
      ...prev,
      [groupName]: [...(prev[groupName] || []), ...shapes],
    }));
  }
  function deleteGroup(groupName) {
    setSceneData((prev) => {
      const { [groupName]: removed, ...rest } = prev;
      return rest;
    });
  }
  function deleteShape(groupName, index) {
    setSceneData((prev) => ({
      ...prev,
      [groupName]: prev[groupName].filter((_, i) => i !== index),
    }));
  }
  function editShape(groupName, index, newShape) {
    setSceneData((prev) => ({
      ...prev,
      [groupName]: prev[groupName].map((shape, i) => (i === index ? newShape : shape)),
    }));
  }
  function toggleSelect(key) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }
  function deleteSelected() {
    setSceneData((prev) => {
      const next = { ...prev };
      selected.forEach((key) => {
        if (next[key]) {
          delete next[key];
        } else {
          const lastDash = key.lastIndexOf("-");
          const groupName = key.slice(0, lastDash);
          const index = parseInt(key.slice(lastDash + 1), 10);
          if (next[groupName]) next[groupName] = next[groupName].filter((_, i) => i !== index);
        }
      });
      return next;
    });
    setSelected(new Set());
  }

  function moveSelected(dx, dy, dz) {
    setSceneData((prev) => {
      const refs = getSelectedRefs(prev, selected);
      if (refs.length === 0) return prev;
      const next = { ...prev };
      refs.forEach(({ groupName, i }) => {
        next[groupName] = next[groupName].map((shape, idx) =>
          idx === i
            ? { ...shape, pos: [shape.pos[0] + dx, shape.pos[1] + dy, shape.pos[2] + dz] }
            : shape
        );
      });
      return next;
    });
  }

  function scaleSelected(factor) {
    setSceneData((prev) => {
      const refs = getSelectedRefs(prev, selected);
      if (refs.length === 0) return prev;
      const next = { ...prev };
      refs.forEach(({ groupName, i }) => {
        next[groupName] = next[groupName].map((shape, idx) => {
          if (idx !== i) return shape;
          if (shape.type === "sphere") {
            return { ...shape, radius: Math.max(0.1, shape.radius + factor) };
          }
          if (shape.type === "cube") {
            return { ...shape, size: shape.size.map((s) => Math.max(0.1, s + factor)) };
          }
          return shape;
        });
      });
      return next;
    });
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <aside className="w-full md:w-1/4 h-full p-4 border-r overflow-y-auto flex flex-col gap-4"
        style={{ borderColor: "var(--color-border)" }}>
        <h2 className="text-lg font-semibold">Controls</h2>
        <InputPanel onSubmit={addGroup} onDraftChange={setPreviewShape} />

        <div className="flex items-center justify-between mt-4">
          <h2 className="text-lg font-semibold">Groups</h2>
          {selected.size > 0 && (
            <button onClick={deleteSelected} className="text-xs font-medium px-2 py-0.5 rounded"
              style={{ color: "var(--color-danger)" }}>
              Delete selected ({selected.size})
            </button>
          )}
        </div>
        <LightControls lightSettings={lightSettings} setLightSettings={setLightSettings} />
        <GroupList
          data={sceneData}
          onDeleteGroup={deleteGroup}
          onDeleteShape={deleteShape}
          onEditShape={editShape}
          selected={selected}
          onToggleSelect={toggleSelect}
        />
      </aside>

      <main className="w-full md:w-3/4 h-full relative">
        <Scene
  data={sceneData}
  previewShape={previewShape}
  selected={selected}
  lightSettings={lightSettings}
/>
        <ToolBar
          moveStep={moveStep}
          setMoveStep={setMoveStep}
          scaleStep={scaleStep}
          setScaleStep={setScaleStep}
          onMove={moveSelected}
          onScale={scaleSelected}
        />
      </main>
    </div>
  );
}