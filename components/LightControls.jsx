export default function LightControls({ lightSettings, setLightSettings }) {
  function update(key, value) {
    setLightSettings((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Lighting</h2>

      <label className="text-sm font-medium">
        Ambient <span style={{ color: "var(--color-fg-muted)" }}>({lightSettings.ambientIntensity.toFixed(2)})</span>
      </label>
      <input
        type="range" min="0" max="2" step="0.05"
        value={lightSettings.ambientIntensity}
        onChange={(e) => update("ambientIntensity", parseFloat(e.target.value))}
      />

      <label className="text-sm font-medium">
        Directional <span style={{ color: "var(--color-fg-muted)" }}>({lightSettings.directionalIntensity.toFixed(2)})</span>
      </label>
      <input
        type="range" min="0" max="3" step="0.05"
        value={lightSettings.directionalIntensity}
        onChange={(e) => update("directionalIntensity", parseFloat(e.target.value))}
      />
    </div>
  );
}