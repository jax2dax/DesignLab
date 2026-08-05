"use client";
import { useState, useEffect } from "react";
import NumberStepper from "./NumberStepper";
import { presets } from "@/data/presets";
import { materials } from "@/data/materials";
import { SHAPES, defaultFieldsFor } from "@/lib/shapes/registry";

export default function AddMeshPanel({ onSubmit, onDraftChange, open, onOpenChange }) {
  const shapeTypeKeys = Object.keys(SHAPES);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [groupName, setGroupName] = useState("");
  const [shapeType, setShapeType] = useState(shapeTypeKeys[0]);
  const [pos, setPos] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState({ x: 0, y: 0, z: 0 });
  const [shapeFields, setShapeFields] = useState(() => defaultFieldsFor(shapeTypeKeys[0]));
  const [color, setColor] = useState("#4488ff");
  const [materialPreset, setMaterialPreset] = useState("");
  const [metalness, setMetalness] = useState(0);
  const [roughness, setRoughness] = useState(0.5);
  const [error, setError] = useState(null);

  const shapeDef = SHAPES[shapeType];

  function handleShapeTypeChange(newType) {
    setShapeType(newType);
    setShapeFields(defaultFieldsFor(newType)); // reset to that shape's own defaults
  }

  function resetForm() {
    setGroupName("");
    setPos({ x: 0, y: 0, z: 0 });
    setRotation({ x: 0, y: 0, z: 0 });
    setShapeFields(defaultFieldsFor(shapeType));
    setColor("#4488ff");
    setMaterialPreset("");
    setMetalness(0);
    setRoughness(0.5);
    setError(null);
  }

  function applyPreset(name) {
    setMaterialPreset(name);
    if (materials[name]) {
      setColor(materials[name].color);
      setMetalness(materials[name].metalness);
      setRoughness(materials[name].roughness);
    }
  }

  function buildShape() {
    return {
      type: shapeType,
      pos: [pos.x, pos.y, pos.z],
      ...shapeFields,
      rotation: [(rotation.x * Math.PI) / 180, (rotation.y * Math.PI) / 180, (rotation.z * Math.PI) / 180],
      color,
      metalness,
      roughness,
    };
  }

  useEffect(() => {
    if (!open) { onDraftChange(null); return; }
    onDraftChange(buildShape());
    return () => onDraftChange(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, shapeType, pos.x, pos.y, pos.z, rotation.x, rotation.y, rotation.z, JSON.stringify(shapeFields), color, metalness, roughness]);

  function handlePresetAdd() {
    if (!selectedPreset) return;
    onSubmit(selectedPreset, presets[selectedPreset]);
    setSelectedPreset("");
  }

  function handleManualSubmit() {
    setError(null);
    if (!groupName.trim()) { setError("Group name is required."); return; }
    onSubmit(groupName.trim(), [buildShape()]);
    resetForm();
  }

  const inputStyle = { background: "var(--color-bg)", color: "var(--color-fg)", borderColor: "var(--color-border)" };

  if (!open) {
    return (
      <button onClick={() => onOpenChange(true)}
        className="w-full rounded px-3 py-2 text-sm font-medium border"
        style={{ borderColor: "var(--color-border)", color: "var(--color-fg)", background: "var(--color-surface)" }}>
        + Add mesh
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Add mesh</h2>
        <button onClick={() => onOpenChange(false)} className="text-xs" style={{ color: "var(--color-fg-muted)" }}>Close</button>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Add a preset</label>
        <div className="flex gap-2">
          <select value={selectedPreset} onChange={(e) => setSelectedPreset(e.target.value)}
            className="border rounded px-2 py-1 text-sm flex-1" style={inputStyle}>
            <option value="">Choose...</option>
            {Object.keys(presets).map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <button onClick={handlePresetAdd} disabled={!selectedPreset}
            className="rounded px-3 py-1 text-sm disabled:opacity-40"
            style={{ background: "var(--color-accent)", color: "var(--color-accent-fg)" }}>
            Add
          </button>
        </div>
      </div>

      <hr style={{ borderColor: "var(--color-border)" }} />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Group name</label>
        <input type="text" value={groupName} onChange={(e) => setGroupName(e.target.value)}
          placeholder="e.g. wall" className="border rounded px-2 py-1 text-sm" style={inputStyle} />

        <label className="text-sm font-medium mt-1">Shape</label>
        <select value={shapeType} onChange={(e) => handleShapeTypeChange(e.target.value)}
          className="border rounded px-2 py-1 text-sm" style={inputStyle}>
          {shapeTypeKeys.map((key) => <option key={key} value={key}>{SHAPES[key].label}</option>)}
        </select>

        <label className="text-sm font-medium mt-1">Position</label>
        <div className="flex gap-2">
          <NumberStepper label="x" value={pos.x} onChange={(v) => setPos({ ...pos, x: v })} />
          <NumberStepper label="y" value={pos.y} onChange={(v) => setPos({ ...pos, y: v })} />
          <NumberStepper label="z" value={pos.z} onChange={(v) => setPos({ ...pos, z: v })} />
        </div>

        <label className="text-sm font-medium mt-1">Rotation (degrees)</label>
        <div className="flex gap-2">
          <NumberStepper label="x" value={rotation.x} step={15} onChange={(v) => setRotation({ ...rotation, x: v })} />
          <NumberStepper label="y" value={rotation.y} step={15} onChange={(v) => setRotation({ ...rotation, y: v })} />
          <NumberStepper label="z" value={rotation.z} step={15} onChange={(v) => setRotation({ ...rotation, z: v })} />
        </div>

        {/* Generated entirely from shapeDef.fields — never touched when a new shape is added */}
        {shapeDef.fields.map((f) => (
          <div key={f.key} className="flex flex-col gap-1">
            <label className="text-sm font-medium mt-1 capitalize">{f.key}</label>
            {f.type === "vec3" ? (
              <div className="flex gap-2">
                {["x", "y", "z"].map((axis, i) => (
                  <NumberStepper key={axis} label={axis} value={shapeFields[f.key]?.[i] ?? f.default[i]}
                    onChange={(v) => {
                      const arr = [...(shapeFields[f.key] || f.default)];
                      arr[i] = v;
                      setShapeFields({ ...shapeFields, [f.key]: arr });
                    }} />
                ))}
              </div>
            ) : (
              <NumberStepper label={f.key} value={shapeFields[f.key] ?? f.default}
                onChange={(v) => setShapeFields({ ...shapeFields, [f.key]: Math.max(f.min ?? 0.1, v) })} />
            )}
          </div>
        ))}

        <label className="text-sm font-medium mt-1">Color</label>
        <input type="color" value={color} onChange={(e) => { setColor(e.target.value); setMaterialPreset(""); }}
          className="w-16 h-8 border rounded cursor-pointer" />

        <label className="text-sm font-medium mt-1">Material preset</label>
        <select value={materialPreset} onChange={(e) => applyPreset(e.target.value)}
          className="border rounded px-2 py-1 text-sm" style={inputStyle}>
          <option value="">Custom</option>
          {Object.keys(materials).map((name) => <option key={name} value={name}>{name}</option>)}
        </select>

        <label className="text-sm font-medium mt-1">Metalness <span style={{ color: "var(--color-fg-muted)" }}>({metalness.toFixed(2)})</span></label>
        <input type="range" min="0" max="1" step="0.01" value={metalness}
          onChange={(e) => { setMetalness(parseFloat(e.target.value)); setMaterialPreset(""); }} />

        <label className="text-sm font-medium mt-1">Roughness <span style={{ color: "var(--color-fg-muted)" }}>({roughness.toFixed(2)})</span></label>
        <input type="range" min="0" max="1" step="0.01" value={roughness}
          onChange={(e) => { setRoughness(parseFloat(e.target.value)); setMaterialPreset(""); }} />

        {error && <p className="text-sm" style={{ color: "var(--color-danger)" }}>{error}</p>}

        <button onClick={handleManualSubmit} className="rounded px-3 py-1.5 mt-1 text-sm"
          style={{ background: "var(--color-accent)", color: "var(--color-accent-fg)" }}>
          Enter
        </button>
      </div>
    </div>
  );
}