"use client";
import { useState } from "react";
import Scene from "@/components/Scene";
import InputPanel from "@/components/InputPanel";
import GroupList from "@/components/GroupList";
import testScene from "@/data/testScene.json";

export default function Home() {
  const [sceneData, setSceneData] = useState(testScene);
  const [previewShape, setPreviewShape] = useState(null);

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

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <aside className="w-full md:w-1/4 h-full p-4 border-r border-gray-200 overflow-y-auto flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Controls</h2>
        <InputPanel onSubmit={addGroup} onDraftChange={setPreviewShape} />

        <h2 className="text-lg font-semibold mt-4">Groups</h2>
        <GroupList
          data={sceneData}
          onDeleteGroup={deleteGroup}
          onDeleteShape={deleteShape}
          onEditShape={editShape}
        />
      </aside>

      <main className="w-full md:w-3/4 h-full">
        <Scene data={sceneData} previewShape={previewShape} />
      </main>
    </div>
  );
}