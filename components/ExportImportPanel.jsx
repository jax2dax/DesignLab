"use client";
import { useRef, useState } from "react";
import {
  buildBiome, serializeBiome, parseBiome, validatePlatform,
  prepareImportedScene, checkImportFit, FILE_EXTENSION,
} from "@/lib/biomeFormat";

export default function ExportImportPanel({
  sceneData, lightSettings, platform, camera, sceneScale,
  onOpenBiome, onImportMerge,
}) {
  const openInputRef = useRef(null);
  const importInputRef = useRef(null);

  const [error, setError] = useState(null);
  const [warning, setWarning] = useState(null);

  // holds a parsed biome awaiting a target position from the user
  const [pendingImport, setPendingImport] = useState(null);
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0, z: 0 });

  function handleExport() {
    setError(null);
    const platformErrors = validatePlatform(platform);
    if (platformErrors.length > 0) {
      setError("Cannot export — platform is out of bounds:\n" + platformErrors.join("\n"));
      return;
    }
    const biome = buildBiome({ sceneData, lightSettings, platform, camera, sceneScale });
    const text = serializeBiome(biome);
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `biome-${Date.now()}${FILE_EXTENSION}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // --- Open: full replace ---
  function handleOpenFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setWarning(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const biome = parseBiome(reader.result);
        onOpenBiome(biome);
      } catch (err) {
        setError(err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  // --- Import: pick file first, then ask where ---
  function handleImportFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setWarning(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const biome = parseBiome(reader.result);
        setPendingImport(biome); // wait for user to confirm target position
      } catch (err) {
        setError(err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function confirmImport() {
    if (!pendingImport) return;
    const position = [targetPos.x, targetPos.y, targetPos.z];

    const fitWarnings = checkImportFit(platform, pendingImport.platform || [1, 1, 1], position);
    setWarning(fitWarnings.length > 0 ? fitWarnings.join(" ") : null);

    const mergedGroups = prepareImportedScene(pendingImport, position, sceneData);
    onImportMerge(mergedGroups);

    setPendingImport(null);
    setTargetPos({ x: 0, y: 0, z: 0 });
  }

  function cancelImport() {
    setPendingImport(null);
    setError(null);
    setWarning(null);
  }

  const inputStyle = { background: "var(--color-bg)", color: "var(--color-fg)", borderColor: "var(--color-border)" };

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">File</h2>

      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="rounded px-3 py-1.5 text-sm flex-1"
          style={{ background: "var(--color-accent)", color: "var(--color-accent-fg)" }}
        >
          Export {FILE_EXTENSION}
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => openInputRef.current?.click()}
          className="rounded px-3 py-1.5 text-sm flex-1 border"
          style={{ borderColor: "var(--color-border)", color: "var(--color-fg)" }}
        >
          Open (replace world)
        </button>
        <input type="file" accept={FILE_EXTENSION + ",text/plain"} ref={openInputRef} onChange={handleOpenFileChange} style={{ display: "none" }} />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => importInputRef.current?.click()}
          className="rounded px-3 py-1.5 text-sm flex-1 border"
          style={{ borderColor: "var(--color-border)", color: "var(--color-fg)" }}
        >
          Import (add to world)
        </button>
        <input type="file" accept={FILE_EXTENSION + ",text/plain"} ref={importInputRef} onChange={handleImportFileChange} style={{ display: "none" }} />
      </div>

      {pendingImport && (
        <div className="border rounded p-2 flex flex-col gap-2 mt-1" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-sm font-medium">Where should this biome spawn?</p>
          <p className="text-xs" style={{ color: "var(--color-fg-muted)" }}>
            This position becomes the imported biome's new origin — every mesh inside it shifts by this amount.
          </p>
          <div className="flex gap-2">
            {["x", "y", "z"].map((axis) => (
              <label key={axis} className="flex flex-col items-center text-xs">
                {axis}
                <input
                  type="number"
                  value={targetPos[axis]}
                  onChange={(e) => setTargetPos({ ...targetPos, [axis]: parseFloat(e.target.value) || 0 })}
                  className="w-16 border rounded px-1 py-0.5"
                  style={inputStyle}
                />
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={confirmImport}
              className="rounded px-3 py-1 text-sm flex-1"
              style={{ background: "var(--color-accent)", color: "var(--color-accent-fg)" }}
            >
              Confirm import
            </button>
            <button onClick={cancelImport} className="text-sm px-3 py-1" style={{ color: "var(--color-fg-muted)" }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {error && <p className="text-sm whitespace-pre-line" style={{ color: "var(--color-danger)" }}>{error}</p>}
      {warning && <p className="text-sm whitespace-pre-line" style={{ color: "var(--color-fg-muted)" }}>{warning}</p>}
    </div>
  );
}