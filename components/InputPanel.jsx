"use client";
import { useState } from "react";
import NumberStepper from "./NumberStepper";
import { presets } from "@/data/presets";

export default function InputPanel({ onSubmit }) {
  // --- preset quick-add ---
  const [selectedPreset, setSelectedPreset] = useState("");

  function handlePresetAdd() {
    if (!selectedPreset) return;
    onSubmit(selectedPreset, presets[selectedPreset]);
    setSelectedPreset("");
  }

  // --- manual structured builder ---
  const [groupName, setGroupName] = useState("");
  const [shapeType, setShapeType] = useState("cube");
  const [pos, setPos] = useState({ x: 0, y: 0, z: 0 });
  const [size, setSize] = useState({ x: 1, y: 1, z: 1 });
  const [radius, setRadius] = useState(1);
  const [error, setError] = useState(null);

  function handleManualSubmit() {
    setError(null);
    if (!groupName.trim()) {
      setError("Group name is required.");
      return;
    }

    const shape =
      shapeType === "sphere"
        ? { type: "sphere", radius, pos: [pos.x, pos.y, pos.z] }
        : { type: "cube", size: [size.x, size.y, size.z], pos: [pos.x, pos.y, pos.z] };

    onSubmit(groupName.trim(), [shape]);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Preset quick-add */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Add a preset</label>
        <div className="flex gap-2">
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="border rounded px-2 py-1 text-sm flex-1"
          >
            <option value="">Choose...</option>
            {Object.keys(presets).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <button
            onClick={handlePresetAdd}
            disabled={!selectedPreset}
            className="bg-gray-800 text-white rounded px-3 py-1 text-sm disabled:opacity-40"
          >
            Add
          </button>
        </div>
      </div>

      <hr />

      {/* Manual structured builder */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Group name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="e.g. wall"
          className="border rounded px-2 py-1 text-sm"
        />

        <label className="text-sm font-medium mt-1">Shape</label>
        <select
          value={shapeType}
          onChange={(e) => setShapeType(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="cube">Cube</option>
          <option value="sphere">Sphere</option>
        </select>

        <label className="text-sm font-medium mt-1">Position</label>
        <div className="flex gap-2">
          <NumberStepper label="x" value={pos.x} onChange={(v) => setPos({ ...pos, x: v })} />
          <NumberStepper label="y" value={pos.y} onChange={(v) => setPos({ ...pos, y: v })} />
          <NumberStepper label="z" value={pos.z} onChange={(v) => setPos({ ...pos, z: v })} />
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

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleManualSubmit}
          className="bg-blue-600 text-white rounded px-3 py-1.5 mt-1 text-sm hover:bg-blue-700"
        >
          Enter
        </button>
      </div>
    </div>
  );
}