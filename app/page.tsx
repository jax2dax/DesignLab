"use client";
import { useState, useEffect } from "react";
import Scene from "@/components/Scene";
import AddMeshPanel from "@/components/AddMeshPanel";
import SelectedPanel from "@/components/SelectedPanel";
import MeshListPanel from "@/components/MeshListPanel";
import ToolBar from "@/components/ToolBar";
import LightControls from "@/components/LightControls";
import ExportImportPanel from "@/components/ExportImportPanel";
import testScene from "@/data/testScene.json";
import TopToolBar from "@/components/TopToolBar";
import ScriptPanel from "@/components/ScriptPanel";
import AiTextPanel from "@/components/AiTextPanel";
import LanguageTestPanel from "@/components/LanguageTestPanel";
import { ensureNames, generateUniqueName } from "@/lib/names";

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
  //const [sceneData, setSceneData] = useState(testScene);
  const [sceneData, setSceneData] = useState(() => ensureNames(testScene));
  const [previewShape, setPreviewShape] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [addMeshOpen, setAddMeshOpen] = useState(false);
  const [moveStep, setMoveStep] = useState(1);
  const [scaleStep, setScaleStep] = useState(0.5);
  const [draftOffset, setDraftOffset] = useState({ x: 0, y: 0, z: 0 });
  const [scriptOpen, setScriptOpen] = useState(false);

  const [lightSettings, setLightSettings] = useState({
    ambientIntensity: 0.4,
    directionalIntensity: 1.2,
    directionalPos: [5, 10, 5],
  });

  const [platform, setPlatform] = useState([20, 5, 20]);
  const [camera, setCamera] = useState({ position: [8, 8, 8], fov: 50 });
  const [sceneScale, setSceneScale] = useState([1, 1, 1]);
const [aiOpen, setAiOpen] = useState(false);
const [preAiSnapshot, setPreAiSnapshot] = useState(null); // undo slot
const [langTestOpen, setLangTestOpen] = useState(true); // default open while you're testing
//ai pannel // snapshot taken right before applying, not before typing
function handleAiApply(nextScene) {
  setPreAiSnapshot(sceneData);
  setSceneData(nextScene);
}

function undoAiChange() {
  if (preAiSnapshot) {
    setSceneData(preAiSnapshot);
    setPreAiSnapshot(null);
  }
}
////
  // --- selection ---
  function selectMesh(key, shiftKey) {
    setDraftOffset({ x: 0, y: 0, z: 0 });
    if (key === null) {
      setSelected(new Set());
      return;
    }
    setAddMeshOpen(false); // selecting something switches the panel away from Add Mesh
    setSelected((prev) => {
      if (shiftKey) {
        const next = new Set(prev);
        next.has(key) ? next.delete(key) : next.add(key);
        return next;
      }
      return new Set([key]);
    });
  }
// Script Run always creates new shapes (mirrors AddMeshPanel's behavior) —
// it never mutates the shapes it happened to display when opened from a selection.
function handleRunScript(parsedRefs) {
  setSceneData((prev) => {
    const next = { ...prev };
    parsedRefs.forEach(({ groupName, shape }) => {
      next[groupName] = [...(next[groupName] || []), shape];
    });
    return next;
  });
}
  function editOneOnly(key) {
    setAddMeshOpen(false);
    setSelected(new Set([key]));
  }

  // --- staged move ---
  function nudgeDraft(dx, dy, dz) {
    if (selected.size === 0) return;
    setDraftOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy, z: prev.z + dz }));
  }
  function commitDraft() {
    if (draftOffset.x === 0 && draftOffset.y === 0 && draftOffset.z === 0) return;
    moveSelected(draftOffset.x, draftOffset.y, draftOffset.z);
    setDraftOffset({ x: 0, y: 0, z: 0 });
  }
  function cancelDraft() {
    setDraftOffset({ x: 0, y: 0, z: 0 });
  }

  useEffect(() => {
    function handleKeyDown(e) {
      if (selected.size === 0) return;
      if (["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) return;
      if (e.key === "ArrowUp") { e.preventDefault(); nudgeDraft(0, moveStep, 0); }
      else if (e.key === "ArrowDown") { e.preventDefault(); nudgeDraft(0, -moveStep, 0); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); nudgeDraft(-moveStep, 0, 0); }
      else if (e.key === "ArrowRight") { e.preventDefault(); nudgeDraft(moveStep, 0, 0); }
      else if (e.key === "Enter") { e.preventDefault(); commitDraft(); }
      else if (e.key === "Escape") { e.preventDefault(); cancelDraft(); }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selected, moveStep, draftOffset]);

  // --- CRUD ---
  function addGroup(groupName, shapes) {
  setSceneData((prev) => {
    const named = [];
    let working = prev; // grows as we assign names, so later shapes in the same batch don't collide with earlier ones
    shapes.forEach((shape) => {
      const name = shape.name || generateUniqueName(shape.type, working);
      const withName = { ...shape, name };
      named.push(withName);
      working = { ...working, [groupName]: [...(working[groupName] || []), withName] };
    });
    return {
      ...prev,
      [groupName]: [...(prev[groupName] || []), ...named],
    };
  });
}
  function deleteRef(groupName, index) {
    setSceneData((prev) => ({ ...prev, [groupName]: prev[groupName].filter((_, i) => i !== index) }));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(`${groupName}-${index}`);
      return next;
    });
  }
  function editShape(groupName, index, newShape) {
    setSceneData((prev) => ({
      ...prev,
      [groupName]: prev[groupName].map((shape, i) => (i === index ? newShape : shape)),
    }));
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
          idx === i ? { ...shape, pos: [shape.pos[0] + dx, shape.pos[1] + dy, shape.pos[2] + dz] } : shape
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
          if (shape.type === "sphere") return { ...shape, radius: Math.max(0.1, shape.radius + factor) };
          if (shape.type === "cube") return { ...shape, size: shape.size.map((s) => Math.max(0.1, s + factor)) };
          return shape;
        });
      });
      return next;
    });
  }

  // --- file open/import ---
  function handleOpenBiome(biome) {
    //setSceneData(biome.scene || {});
    setSceneData(ensureNames(biome.scene || {}));
    setPlatform(biome.platform || [20, 5, 20]);
    setCamera(biome.camera || { position: [8, 8, 8], fov: 50 });
    setSceneScale(biome.sceneScale || [1, 1, 1]);
    const ambient = biome.lights?.find((l) => l.type === "ambient");
    const directional = biome.lights?.find((l) => l.type === "directional");
    setLightSettings({
      ambientIntensity: ambient?.intensity ?? 0.4,
      directionalIntensity: directional?.intensity ?? 1.2,
      directionalPos: directional?.position ?? [5, 10, 5],
    });
    setSelected(new Set());
  }
  function handleImportMerge(mergedGroups) {
  setSceneData((prev) => ensureNames({ ...prev, ...mergedGroups }));
}

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen">
      <aside
        className="w-full md:w-1/4 h-full p-4 border-r overflow-y-auto flex flex-col gap-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="text-lg font-semibold">Controls</h2>

        {selected.size > 0 ? (
          <SelectedPanel
            sceneData={sceneData}
            selected={selected}
            onEditShape={editShape}
            onDeleteRef={deleteRef}
            onDeleteAll={deleteSelected}
          />
        ) : (
          <AddMeshPanel
            onSubmit={addGroup}
            onDraftChange={setPreviewShape}
            open={addMeshOpen}
            onOpenChange={setAddMeshOpen}
          />
        )}

        <hr style={{ borderColor: "var(--color-border)" }} />
        <LightControls lightSettings={lightSettings} setLightSettings={setLightSettings} />

        <hr style={{ borderColor: "var(--color-border)" }} />
        <ExportImportPanel
          sceneData={sceneData}
          lightSettings={lightSettings}
          platform={platform}
          camera={camera}
          sceneScale={sceneScale}
          onOpenBiome={handleOpenBiome}
          onImportMerge={handleImportMerge}
        />
      </aside>

      <main className="w-full md:w-3/4 h-full relative">
        <Scene
          data={sceneData}
          previewShape={previewShape}
          selected={selected}
          lightSettings={lightSettings}
          camera={camera}
          sceneScale={sceneScale}
          onSelectMesh={selectMesh}
          draftOffset={draftOffset}
        />

        <MeshListPanel
          sceneData={sceneData}
          selected={selected}
          onToggleSelect={selectMesh}
          onDeleteRef={deleteRef}
          onEditOne={editOneOnly}
        />

        <ToolBar
          moveStep={moveStep}
          setMoveStep={setMoveStep}
          scaleStep={scaleStep}
          setScaleStep={setScaleStep}
          onNudge={nudgeDraft}
          onScale={scaleSelected}
          draftOffset={draftOffset}
          onCommitDraft={commitDraft}
          onCancelDraft={cancelDraft}
        />
        <TopToolBar
  scriptOpen={scriptOpen}
  onToggleScript={() => setScriptOpen((o) => !o)}
  aiOpen={aiOpen}
  onToggleAi={() => setAiOpen((o) => !o)}
/>
<ScriptPanel
  sceneData={sceneData}
  selected={selected}
  onRunScript={handleRunScript}
  open={scriptOpen}
/>
<LanguageTestPanel
  sceneData={sceneData}
  onApply={setSceneData}
  open={langTestOpen}
/>
<AiTextPanel
  sceneData={sceneData}
  onApply={handleAiApply}
  open={aiOpen}
  snapshotAvailable={!!preAiSnapshot}
  onUndo={undoAiChange}
/>
      </main>
    </div>
  );
}