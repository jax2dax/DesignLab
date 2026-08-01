import { Code } from "lucide-react";

export default function TopToolBar({ scriptOpen, onToggleScript }) {
  return (
    <div className="absolute top-0 left-0 flex" style={{ margin: "5px" }}>
      <div className="flex gap-2 rounded-lg shadow-md p-2 border" style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}>
        <button
          onClick={onToggleScript}
          className="w-10 h-10 flex items-center justify-center rounded border"
          style={
            scriptOpen
              ? { background: "var(--color-accent)", color: "var(--color-accent-fg)", borderColor: "var(--color-accent)" }
              : { borderColor: "var(--color-border)", color: "var(--color-fg)" }
          }
          title="Script"
        >
          <Code size={18} />
        </button>
        {/* more buttons go here later, same w-10 h-10 pattern */}
      </div>
    </div>
  );
}