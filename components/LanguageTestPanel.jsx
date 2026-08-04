"use client";
import { useState } from "react";
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

export default function LanguageTestPanel({ sceneData, onApply, open }) {
  const [text, setText] = useState(SAMPLE);
  const [errors, setErrors] = useState([]);
  const [log, setLog] = useState([]);

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

    if (applyErrors.length > 0) {
      setErrors(applyErrors);
    }

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
      className="absolute rounded-lg shadow-md border flex flex-col"
      style={{
        top: 5,
        right: 235, // sits just left of MeshListPanel (which is width 220 + 5px margin)
        width: "clamp(280px, 26vw, 420px)",
        maxHeight: "70vh",
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="px-3 py-2 text-sm font-medium border-b" style={{ borderColor: "var(--color-border)", color: "var(--color-fg)" }}>
        Language test
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        className="p-2 text-xs font-mono resize-none outline-none"
        style={{ background: "var(--color-bg)", color: "var(--color-fg)" }}
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

      <div className="px-2 pb-2 text-xs overflow-y-auto border-t" style={{ borderColor: "var(--color-border)", color: "var(--color-fg-muted)", maxHeight: 120 }}>
        {log.length === 0 ? <p className="pt-1">No runs yet.</p> : log.map((l, i) => <p key={i} className="pt-1">{l}</p>)}
      </div>
    </div>
  );
}