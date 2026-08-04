"use client";
import { useState } from "react";
import NumberStepper from "./NumberStepper";
import { materials } from "@/data/materials";
import { isNameAvailable } from "@/lib/names";

const RAD_TO_DEG = 180 / Math.PI;
const DEG_TO_RAD = Math.PI / 180;

export default function SelectedPanel({ sceneData, selected, onEditShape, onDeleteRef, onDeleteAll }) {
  const refs = [];
  Object.entries(sceneData).forEach(([groupName, shapes]) => {
    shapes.forEach((shape, i) => {
      if (selected.has(groupName) || selected.has(`${groupName}-${i}`)) {
        refs.push({ groupName, index: i, shape });
      }
    });
  });

  if (refs.length === 0) return null;
  const inputStyle = { background: "var(--color-bg)", color: "var(--color-fg)", borderColor: "var(--color-border)" };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Selected ({refs.length})</h2>
        <button onClick={onDeleteAll} className="text-xs font-medium px-2 py-0.5 rounded"
          style={{ color: "var(--color-danger)" }}>
          Delete selected
        </button>
      </div>

      {refs.map(({ groupName, index, shape }) => {
        const key = `${groupName}-${index}`;
        const rotDeg = (shape.rotation || [0, 0, 0]).map((r) => r * RAD_TO_DEG);

        function patch(fields) {
          onEditShape(groupName, index, { ...shape, ...fields });
        }
function NameField({ sceneData, shape, groupName, index, onEditShape }) {
  const [draft, setDraft] = useState(shape.name || "");
  const [warn, setWarn] = useState(null);

  function commit() {
    const trimmed = draft.trim();
    if (!trimmed) {
      setWarn("Name cannot be empty.");
      setDraft(shape.name || "");
      return;
    }
    if (!isNameAvailable(sceneData, trimmed, shape.name)) {
      setWarn(`"${trimmed}" is already used by another mesh.`);
      setDraft(shape.name || "");
      return;
    }
    setWarn(null);
    onEditShape(groupName, index, { ...shape, name: trimmed });
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium">Name</label>
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === "Enter") { e.currentTarget.blur(); } }}
        className="border rounded px-2 py-1 text-sm"
        style={{ background: "var(--color-bg)", color: "var(--color-fg)", borderColor: "var(--color-border)" }}
      />
      {warn && <p className="text-xs" style={{ color: "var(--color-danger)" }}>{warn}</p>}
    </div>
  );
}
        return (
          <div key={key} className="border rounded p-3 flex flex-col gap-2" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{groupName} — {shape.type} #{index}</span>
              <button onClick={() => onDeleteRef(groupName, index)} className="text-xs" style={{ color: "var(--color-danger)" }}>
                Delete
              </button>
            </div>
<NameField sceneData={sceneData} shape={shape} groupName={groupName} index={index} onEditShape={onEditShape} />
            <label className="text-xs font-medium">Position</label>
            <div className="flex gap-2">
              {["x", "y", "z"].map((axis, i) => (
                <NumberStepper key={axis} label={axis} value={shape.pos[i]}
                  onChange={(v) => { const pos = [...shape.pos]; pos[i] = v; patch({ pos }); }} />
              ))}
            </div>

            <label className="text-xs font-medium mt-1">Rotation (degrees)</label>
            <div className="flex gap-2">
              {["x", "y", "z"].map((axis, i) => (
                <NumberStepper key={axis} label={axis} value={rotDeg[i]} step={15}
                  onChange={(v) => {
                    const rotation = [...(shape.rotation || [0, 0, 0])];
                    rotation[i] = v * DEG_TO_RAD;
                    patch({ rotation });
                  }} />
              ))}
            </div>

            {shape.type === "cube" ? (
              <>
                <label className="text-xs font-medium mt-1">Size</label>
                <div className="flex gap-2">
                  {["x", "y", "z"].map((axis, i) => (
                    <NumberStepper key={axis} label={axis} value={shape.size[i]}
                      onChange={(v) => { const size = [...shape.size]; size[i] = Math.max(0.1, v); patch({ size }); }} />
                  ))}
                </div>
              </>
            ) : (
              <>
                <label className="text-xs font-medium mt-1">Radius</label>
                <NumberStepper label="r" value={shape.radius}
                  onChange={(v) => patch({ radius: Math.max(0.1, v) })} />
              </>
            )}

            <label className="text-xs font-medium mt-1">Color</label>
            <input type="color" value={shape.color || "#4488ff"}
              onChange={(e) => patch({ color: e.target.value, material: undefined })}
              className="w-16 h-8 border rounded cursor-pointer" />

            <label className="text-xs font-medium mt-1">Material preset</label>
            <select value={shape.material || ""} onChange={(e) => {
                const preset = materials[e.target.value];
                patch(preset
                  ? { material: e.target.value, color: preset.color, metalness: preset.metalness, roughness: preset.roughness }
                  : { material: undefined });
              }}
              className="border rounded px-2 py-1 text-sm" style={inputStyle}>
              <option value="">Custom</option>
              {Object.keys(materials).map((name) => <option key={name} value={name}>{name}</option>)}
            </select>

            <label className="text-xs font-medium mt-1">
              Metalness <span style={{ color: "var(--color-fg-muted)" }}>({(shape.metalness ?? 0).toFixed(2)})</span>
            </label>
            <input type="range" min="0" max="1" step="0.01" value={shape.metalness ?? 0}
              onChange={(e) => patch({ metalness: parseFloat(e.target.value), material: undefined })} />

            <label className="text-xs font-medium mt-1">
              Roughness <span style={{ color: "var(--color-fg-muted)" }}>({(shape.roughness ?? 0.5).toFixed(2)})</span>
            </label>
            <input type="range" min="0" max="1" step="0.01" value={shape.roughness ?? 0.5}
              onChange={(e) => patch({ roughness: parseFloat(e.target.value), material: undefined })} />
          </div>
        );
      })}
    </div>
  );
}