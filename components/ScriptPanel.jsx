"use client";
import { useState, useEffect } from "react";
import { shapesToScript, parseScript, ScriptParseError } from "@/lib/scriptFormat";

export default function ScriptPanel({ sceneData, selected, onRunScript, open }) {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState([]);

  // Whenever the panel is open and selection changes, sync the box to the
  // selected mesh(es)' script form. Empty selection -> empty box to type into.
  useEffect(() => {
    if (!open) return;
    if (selected.size === 0) {
      setText("");
      setErrors([]);
      return;
    }
    const refs = [];
    Object.entries(sceneData).forEach(([groupName, shapes]) => {
      shapes.forEach((shape, i) => {
        const key = `${groupName}-${i}`;
        if (selected.has(groupName) || selected.has(key)) refs.push({ groupName, shape });
      });
    });
    setText(shapesToScript(refs));
    setErrors([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, open]);

  if (!open) return null;

  function handleRun() {
    try {
      const parsed = parseScript(text);
      setErrors([]);
      onRunScript(parsed);
    } catch (e) {
      setErrors(e instanceof ScriptParseError ? e.errors : [e.message]);
    }
  }

  return (
    <div
      className="absolute rounded-lg shadow-md border flex flex-col"
      style={{
        top: 56,
        left: 5,
        width: "clamp(280px, 25vw, 480px)",
        height: "clamp(220px, 40vh, 520px)",
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="px-3 py-2 text-sm font-medium border-b" style={{ borderColor: "var(--color-border)", color: "var(--color-fg)" }}>
        Script
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"cube {\n  group: wall\n  pos: 0, 0, 0\n  size: 1, 1, 1\n}"}
        className="flex-1 w-full p-2 text-xs font-mono resize-none outline-none"
        style={{ background: "var(--color-bg)", color: "var(--color-fg)" }}
      />
      {errors.length > 0 && (
        <div className="px-2 py-1 text-xs overflow-y-auto" style={{ color: "var(--color-danger)", maxHeight: 80 }}>
          {errors.map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}
      <div className="p-2 border-t" style={{ borderColor: "var(--color-border)" }}>
        <button
          onClick={handleRun}
          className="w-full rounded px-3 py-1.5 text-sm"
          style={{ background: "var(--color-accent)", color: "var(--color-accent-fg)" }}
        >
          Run
        </button>
      </div>
    </div>
  );
}