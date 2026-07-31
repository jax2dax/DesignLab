"use client";
import { useState, useEffect } from "react";
import NumberStepper from "./NumberStepper";
import { presets } from "@/data/presets";
import { materials } from "@/data/materials";

const DEFAULTS = {
  groupName: "",
  shapeType: "cube",
  pos: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  size: { x: 1, y: 1, z: 1 },
  radius: 1,
  color: "#4488ff",
  materialPreset: "",
  metalness: 0,
  roughness: 0.5,
};

export default function AddMeshPanel({ onSubmit, onDraftChange, open, onOpenChange }) {
  const [selectedPreset, setSelectedPreset] = useState("");
  const [groupName, setGroupName] = useState(DEFAULTS.groupName);
  const [shapeType, setShapeType] = useState(DEFAULTS.shapeType);
  const [pos, setPos] = useState(DEFAULTS.pos);
  const [rotation, setRotation] = useState(DEFAULTS.rotation);
  const [size, setSize] = useState(DEFAULTS.size);
  const [radius, setRadius] = useState(DEFAULTS.radius);
  const [color, setColor] = useState(DEFAULTS.color);
  const [materialPreset, setMaterialPreset] = useState(DEFAULTS.materialPreset);
  const [metalness, setMetalness] = useState(DEFAULTS.metalness);
  const [roughness, setRoughness] = useState(DEFAULTS.roughness);
  const [error, setError] = useState(null);

  function resetForm() {
    setGroupName(DEFAULTS.groupName);
    setShapeType(DEFAULTS.shapeType);
    setPos(DEFAULTS.pos);
    setRotation(DEFAULTS.rotation);
    setSize(DEFAULTS.size);
    setRadius(DEFAULTS.radius);
    setColor(DEFAULTS.color);
    setMaterialPreset(DEFAULTS.materialPreset);
    setMetalness(DEFAULTS.metalness);
    setRoughness(DEFAULTS.roughness);
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
    const base =
      shapeType === "sphere"
        ? { type: "sphere", radius, pos: [pos.x, pos.y, pos.z] }
        : { type: "cube", size: [size.x, size.y, size.z], pos: [pos.x, pos.y, pos.z] };
    return {
      ...base,
      rotation: [(rotation.x * Math.PI) / 180, (rotation.y * Math.PI) / 180, (rotation.z * Math.PI) / 180],
      color,
      metalness,
      roughness,
    };
  }

  // Only broadcasts a ghost while this panel is actually open — this is what
  // stops the "ghost cube always sitting in the scene" problem: closed panel = no draft.
  useEffect(() => {
    if (!open) {
      onDraftChange(null);
      return;
    }
    onDraftChange(buildShape());
    return () => onDraftChange(null);
  }, [open, shapeType, pos.x, pos.y, pos.z, rotation.x, rotation.y, rotation.z, size.x, size.y, size.z, radius, color, metalness, roughness]);

  function handlePresetAdd() {
    if (!selectedPreset) return;
    onSubmit(selectedPreset, presets[selectedPreset]);
    setSelectedPreset("");
  }

  function handleManualSubmit() {
    setError(null);
    if (!groupName.trim()) {
      setError("Group name is required.");
      return;
    }
    onSubmit(groupName.trim(), [buildShape()]);
    resetForm(); // fields go back to default immediately after a successful add
  }

  const inputStyle = { background: "var(--color-bg)", color: "var(--color-fg)", borderColor: "var(--color-border)" };

  if (!open) {
    return (
      <button
        onClick={() => onOpenChange(true)}
        className="w-full rounded px-3 py-2 text-sm font-medium border"
        style={{ borderColor: "var(--color-border)", color: "var(--color-fg)", background: "var(--color-surface)" }}
      >
        + Add mesh
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Add mesh</h2>
        <button onClick={() => onOpenChange(false)} className="text-xs" style={{ color: "var(--color-fg-muted)" }}>
          Close
        </button>
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
        <select value={shapeType} onChange={(e) => setShapeType(e.target.value)}
          className="border rounded px-2 py-1 text-sm" style={inputStyle}>
          <option value="cube">Cube</option>
          <option value="sphere">Sphere</option>
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

        {shapeType === "cube" ? (
          <>
            <label className="text-sm font-medium mt-1">Size</label>
            <div className="flex gap-2">
              <NumberStepper label="x" value={size.x} onChange={(v) => setSize({ ...size, x: v })} />
              <NumberStepper label="y" value={size.y} onChange={(v) => setSize({ ...size, y: v })} />
              <NumberStepper label="z" value={size.z} onChange={(v) => setSize({ ...size, z: v })} />
            </div>
          </>
        ) : (
          <>
            <label className="text-sm font-medium mt-1">Radius</label>
            <NumberStepper label="r" value={radius} onChange={setRadius} />
          </>
        )}

        <label className="text-sm font-medium mt-1">Color</label>
        <input type="color" value={color} onChange={(e) => { setColor(e.target.value); setMaterialPreset(""); }}
          className="w-16 h-8 border rounded cursor-pointer" />

        <label className="text-sm font-medium mt-1">Material preset</label>
        <select value={materialPreset} onChange={(e) => applyPreset(e.target.value)}
          className="border rounded px-2 py-1 text-sm" style={inputStyle}>
          <option value="">Custom</option>
          {Object.keys(materials).map((name) => <option key={name} value={name}>{name}</option>)}
        </select>

        <label className="text-sm font-medium mt-1">
          Metalness <span style={{ color: "var(--color-fg-muted)" }}>({metalness.toFixed(2)})</span>
        </label>
        <input type="range" min="0" max="1" step="0.01" value={metalness}
          onChange={(e) => { setMetalness(parseFloat(e.target.value)); setMaterialPreset(""); }} />

        <label className="text-sm font-medium mt-1">
          Roughness <span style={{ color: "var(--color-fg-muted)" }}>({roughness.toFixed(2)})</span>
        </label>
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