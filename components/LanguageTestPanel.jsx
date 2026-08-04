"use client";
import { useState, useRef, useCallback } from "react";
import { Minimize2, Maximize2, GripHorizontal } from "lucide-react";
import { parseLanguage, LanguageParseError } from "@/lib/language/parser";
import { applyLanguageOps } from "@/lib/language/apply";

const SAMPLE = `cube "test_cube" {
  group: testing
  pos: 0, 1, 0
  size: 1, 1, 1
  color: #4488ff
}

claw "test_cube" {
  color: #ff0000
}`;

const MIN_WIDTH = 260;
const MIN_HEIGHT = 220;
const MAX_WIDTH = 720;
const MAX_HEIGHT = 720;

export default function LanguageTestPanel({ sceneData, onApply, open }) {
  const [text, setText] = useState(SAMPLE);
  const [errors, setErrors] = useState([]);
  const [log, setLog] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [size, setSize] = useState({ width: 360, height: 420 });

  const resizing = useRef(null);
  const panelRef = useRef(null);

  const startResize = useCallback((e) => {
    e.preventDefault();
    resizing.current = { startX: e.clientX, startY: e.clientY, startW: size.width, startH: size.height };
    window.addEventListener("mousemove", onResizeMove);
    window.addEventListener("mouseup", stopResize);
  }, [size]);

  function onResizeMove(e) {
    if (!resizing.current) return;
    const { startX, startY, startW, startH } = resizing.current;
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startW + (e.clientX - startX)));
    const newHeight = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, startH + (e.clientY - startY)));
    setSize({ width: newWidth, height: newHeight });
  }

  function stopResize() {
    resizing.current = null;
    window.removeEventListener("mousemove", onResizeMove);
    window.removeEventListener("mouseup", stopResize);
  }

  if (!open) return null;

  function handleRun() {
    setErrors([]);
    let ops;
    try {
      ops = parseLanguage(text);
    } catch (e) {
      setErrors(e instanceof LanguageParseError ? e.errors : [e.message]);
      setLog((l) => [`Parse failed: ${e.message}`, ...l].slice(0, 20));
      return;
    }

    const { sceneData: nextScene, errors: applyErrors } = applyLanguageOps(ops, sceneData);
    if (applyErrors.length > 0) setErrors(applyErrors);

    const summary = ops.map((op) => {
      if (op.kind === "add") return `add ${op.type} "${op.name || "(auto)"}"`;
      if (op.kind === "edit") return `edit "${op.name}" (${Object.keys(op.fields).join(", ")})`;
      if (op.kind === "delete") return `delete "${op.name}"`;
      return "unknown op";
    });
    setLog((l) => [...summary.map((s) => `OK: ${s}`), ...l].slice(0, 20));
    onApply(nextScene);
  }

  return (
    <div
      ref={panelRef}
      className="absolute rounded-lg shadow-md border flex flex-col"
      style={{
        top: 5,
        right: 235,
        width: collapsed ? 220 : size.width,
        height: collapsed ? "auto" : size.height,
        maxWidth: "90vw",
        maxHeight: "85vh",
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b" style={{ borderColor: "var(--color-border)" }}>
        <span className="text-sm font-medium" style={{ color: "var(--color-fg)" }}>Language</span>
        <button onClick={() => setCollapsed((c) => !c)} style={{ color: "var(--color-fg-muted)" }}>
          {collapsed ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
        </button>
      </div>

      {!collapsed && (
        <>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 p-2 text-xs font-mono resize-none outline-none"
            style={{ background: "var(--color-bg)", color: "var(--color-fg)", minHeight: 80 }}
          />

          <div className="p-2 border-t" style={{ borderColor: "var(--color-border)" }}>
            <button
              onClick={handleRun}
              className="w-full rounded px-3 py-1.5 text-sm"
              style={{ background: "var(--color-accent)", color: "var(--color-accent-fg)" }}
            >
              Run
            </button>
          </div>

          {errors.length > 0 && (
            <div className="px-2 pb-2 text-xs whitespace-pre-line overflow-y-auto" style={{ color: "var(--color-danger)", maxHeight: 100 }}>
              {errors.join("\n")}
            </div>
          )}

          <div className="px-2 pb-2 text-xs overflow-y-auto border-t" style={{ borderColor: "var(--color-border)", color: "var(--color-fg-muted)", maxHeight: 100 }}>
            {log.length === 0 ? <p className="pt-1">No runs yet.</p> : log.map((l, i) => <p key={i} className="pt-1">{l}</p>)}
          </div>

          {/* Resize handle — bottom-right corner drag */}
          <div
            onMouseDown={startResize}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-end justify-end p-0.5"
            style={{ color: "var(--color-fg-muted)" }}
            title="Drag to resize"
          >
            <GripHorizontal size={12} style={{ transform: "rotate(45deg)" }} />
          </div>
        </>
      )}
    </div>
  );
}