"use client";
import { useState } from "react";
import Scene from "@/components/Scene";
import InputPanel from "@/components/InputPanel";
import GroupList from "@/components/GroupList";
import ToolBar from "@/components/ToolBar";
import testScene from "@/data/testScene.json";

export default function Home() {
  const [sceneData, setSceneData] = useState(testScene);
  const [previewShape, setPreviewShape] = useState(null);
  const [selected, setSelected] = useState(new Set()); // keys: "wall" (whole group) or "wall-0" (single shape)

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
          // whole group selected directly
          delete next[key];
        } else {
          // shape-level key: "groupName-index"
          const lastDash = key.lastIndexOf("-");
          const groupName = key.slice(0, lastDash);
          const index = parseInt(key.slice(lastDash + 1), 10);
          if (next[groupName]) {
            next[groupName] = next[groupName].filter((_, i) => i !== index);
          }
        }
      });
      return next;
    });
    setSelected(new Set());
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <aside className="w-full md:w-1/4 h-full p-4 border-r border-gray-200 overflow-y-auto flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Controls</h2>
        <InputPanel onSubmit={addGroup} onDraftChange={setPreviewShape} />

        <div className="flex items-center justify-between mt-4">
          <h2 className="text-lg font-semibold">Groups</h2>
          {selected.size > 0 && (
            <button
              onClick={deleteSelected}
              className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-0.5 rounded hover:bg-red-50"
            >
              Delete selected ({selected.size})
            </button>
          )}
        </div>
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
        <Scene data={sceneData} previewShape={previewShape} />
        <ToolBar />
      </main>
    </div>
  );
}