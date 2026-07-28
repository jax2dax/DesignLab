import { MousePointer2, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export default function ToolBar() {
  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center" style={{ margin: "5px" }}>
      <div
        className="flex gap-2 rounded-lg shadow-md p-2 border"
        style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
      >
        {/* Pointer — single square button */}
        <button
          className="w-10 h-10 flex items-center justify-center rounded border"
          style={{ borderColor: "var(--color-border)", color: "var(--color-fg)" }}
        >
          <MousePointer2 size={18} />
        </button>

        {/* Up/Down — one 10x10 button-sized block, split into two internal halves */}
        <div
          className="w-10 h-10 flex flex-col rounded border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            className="flex-1 flex items-center justify-center"
            style={{ color: "var(--color-fg)" }}
          >
            <ChevronUp size={14} />
          </button>
          <div style={{ height: 1, background: "var(--color-border)" }} />
          <button
            className="flex-1 flex items-center justify-center"
            style={{ color: "var(--color-fg)" }}
          >
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Left/Right — same pattern, split horizontally instead */}
        <div
          className="w-10 h-10 flex flex-row rounded border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            className="flex-1 flex items-center justify-center"
            style={{ color: "var(--color-fg)" }}
          >
            <ChevronLeft size={14} />
          </button>
          <div style={{ width: 1, background: "var(--color-border)" }} />
          <button
            className="flex-1 flex items-center justify-center"
            style={{ color: "var(--color-fg)" }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}