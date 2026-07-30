import { MousePointer2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react";

export default function ToolBar({ moveStep, setMoveStep, scaleStep, setScaleStep, onMove, onScale }) {
  const barStyle = { background: "var(--color-surface)", borderColor: "var(--color-border)" };
  const btnStyle = { borderColor: "var(--color-border)", color: "var(--color-fg)" };

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center" style={{ margin: "5px" }}>
      <div className="flex items-center gap-3 rounded-lg shadow-md p-2 border" style={barStyle}>
        <button className="w-10 h-10 flex items-center justify-center rounded border" style={btnStyle}>
          <MousePointer2 size={18} />
        </button>

        {/* Up/Down = move along Y */}
        <div className="w-10 h-10 flex flex-col rounded border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          <button onClick={() => onMove(0, moveStep, 0)} className="flex-1 flex items-center justify-center" style={{ color: "var(--color-fg)" }}>
            <ChevronUp size={14} />
          </button>
          <div style={{ height: 1, background: "var(--color-border)" }} />
          <button onClick={() => onMove(0, -moveStep, 0)} className="flex-1 flex items-center justify-center" style={{ color: "var(--color-fg)" }}>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Left/Right = move along X */}
        <div className="w-10 h-10 flex flex-row rounded border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          <button onClick={() => onMove(-moveStep, 0, 0)} className="flex-1 flex items-center justify-center" style={{ color: "var(--color-fg)" }}>
            <ChevronLeft size={14} />
          </button>
          <div style={{ width: 1, background: "var(--color-border)" }} />
          <button onClick={() => onMove(moveStep, 0, 0)} className="flex-1 flex items-center justify-center" style={{ color: "var(--color-fg)" }}>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Scale up/down */}
        <div className="w-10 h-10 flex flex-col rounded border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          <button onClick={() => onScale(scaleStep)} className="flex-1 flex items-center justify-center" style={{ color: "var(--color-fg)" }}>
            <Plus size={14} />
          </button>
          <div style={{ height: 1, background: "var(--color-border)" }} />
          <button onClick={() => onScale(-scaleStep)} className="flex-1 flex items-center justify-center" style={{ color: "var(--color-fg)" }}>
            <Minus size={14} />
          </button>
        </div>

        {/* Step size controls */}
        <div className="flex flex-col text-xs gap-1 pl-2" style={{ color: "var(--color-fg-muted)" }}>
          <label className="flex items-center gap-1">
            Move
            <input
              type="number"
              value={moveStep}
              step="0.1"
              onChange={(e) => setMoveStep(parseFloat(e.target.value) || 1)}
              className="w-12 border rounded px-1"
              style={{ background: "var(--color-bg)", color: "var(--color-fg)", borderColor: "var(--color-border)" }}
            />
          </label>
          <label className="flex items-center gap-1">
            Scale
            <input
              type="number"
              value={scaleStep}
              step="0.1"
              onChange={(e) => setScaleStep(parseFloat(e.target.value) || 0.5)}
              className="w-12 border rounded px-1"
              style={{ background: "var(--color-bg)", color: "var(--color-fg)", borderColor: "var(--color-border)" }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}